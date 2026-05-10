import { Generation } from "../models/Generation";

export interface SaveGenerationDTO {
  topic:        string;
  tone:         string;
  length:       string;
  language?:    string;
  keywords?:    string[];
  prompt:       string;
  output:       string;
  modelName?:   string;
  userId?:      string;
  templateId?:  string;
  refinementOf?: string;
}

export interface ListFilters {
  page?:           number;
  limit?:          number;
  userId?:         string;
  tone?:           string;
  language?:       string;
  search?:         string;
  favouritesOnly?: boolean;
}

export async function saveGeneration(data: SaveGenerationDTO): Promise<any> {
  const generation = new Generation({
    ...data,
    modelName: data.modelName || "gemini-2.5-flash",
  });
  return generation.save();
}

export async function getHistory(filters: ListFilters = {}): Promise<{
  items: any[]; total: number; pages: number; page: number; limit: number;
}> {
  const page  = Math.max(1, filters.page  ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 10));
  const skip  = (page - 1) * limit;
  const query: Record<string, any> = {};

  if (filters.userId)         query.userId      = filters.userId;
  if (filters.tone)           query.tone        = filters.tone;
  if (filters.favouritesOnly) query.isFavourite = true;

  // Language filter — treat missing as "en"
  if (filters.language) {
    query.language = filters.language === "en"
      ? { $in: ["en", null, undefined] }
      : filters.language;
  }

  // Search filter
  if (filters.search?.trim()) {
    const safe = filters.search.trim();
    const searchOr = { $or: [
      { topic:  { $regex: safe, $options: "i" } },
      { output: { $regex: safe, $options: "i" } },
    ]};
    if (query.language) {
      query.$and = [{ language: query.language }, searchOr] as any;
      delete query.language;
    } else {
      Object.assign(query, searchOr);
    }
  }

  const [items, total] = await Promise.all([
    Generation.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Generation.countDocuments(query),
  ]);

  return { items: items as any[], total, pages: Math.ceil(total / limit), page, limit };
}

export async function getGenerationById(id: string, userId?: string): Promise<any> {
  const query: Record<string, any> = { _id: id };
  if (userId) query.userId = userId;
  return Generation.findOne(query).lean();
}

export async function getSharedGenerationById(id: string): Promise<any> {
  return Generation.findOne({ _id: id, isShared: true }).lean();
}

export async function deleteGeneration(id: string, userId?: string): Promise<boolean> {
  const query: Record<string, any> = { _id: id };
  if (userId) query.userId = userId;
  const result = await Generation.findOneAndDelete(query);
  return result !== null;
}

export async function clearAllHistory(userId?: string): Promise<number> {
  const query = userId ? { userId } : {};
  const result = await Generation.deleteMany(query);
  return result.deletedCount;
}

export async function toggleFavourite(id: string, userId?: string): Promise<any> {
  const query: Record<string, any> = { _id: id };
  if (userId) query.userId = userId;
  const gen = await Generation.findOne(query);
  if (!gen) return null;
  (gen as any).isFavourite = !(gen as any).isFavourite;
  await gen.save();
  return gen;
}

export async function setShareStatus(id: string, isShared: boolean, userId?: string): Promise<any> {
  const query: Record<string, any> = { _id: id };
  if (userId) query.userId = userId;
  return Generation.findOneAndUpdate(query, { isShared }, { new: true });
}

export async function getStats(userId?: string): Promise<any> {
  const match: Record<string, any> = userId ? { userId } : {};
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totals, byTone, byLanguage, last30] = await Promise.all([
    Generation.aggregate([
      { $match: match },
      { $group: { _id: null, count: { $sum: 1 }, words: { $sum: "$wordCount" }, favs: { $sum: { $cond: ["$isFavourite", 1, 0] } } }},
    ]),
    Generation.aggregate([
      { $match: match },
      { $group: { _id: "$tone", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Generation.aggregate([
      { $match: match },
      { $addFields: { lang: { $ifNull: ["$language", "en"] } } },
      { $group: { _id: "$lang", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Generation.aggregate([
      { $match: { ...match, createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 }, words: { $sum: "$wordCount" } }},
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalGenerations: totals[0]?.count ?? 0,
    totalWords:       totals[0]?.words ?? 0,
    favouritesCount:  totals[0]?.favs  ?? 0,
    byTone, byLanguage,
    last30Days: last30,
  };
}
