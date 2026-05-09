import { Generation, IGeneration, Tone, Length, Language } from "../models/Generation";

// ─────────────────────────────────────────────────────────────
//  historyService.ts
//
//  All database operations for generations.
//  Keeps the route handlers thin — business logic lives here.
// ─────────────────────────────────────────────────────────────

export interface SaveGenerationDTO {
  topic: string;
  tone: Tone;
  length: Length;
  language?: Language;
  keywords?: string[];
  prompt: string;
  output: string;
  model?: string;
  userId?: string;
  templateId?: string;
  refinementOf?: string;
}

export interface ListFilters {
  page?: number;
  limit?: number;
  userId?: string;
  tone?: Tone;
  language?: Language;
  search?: string;
  favouritesOnly?: boolean;
}

export async function saveGeneration(data: SaveGenerationDTO): Promise<IGeneration> {
  const generation = new Generation(data);
  return generation.save();
}

export async function getHistory(
  filters: ListFilters = {}
): Promise<{ items: IGeneration[]; total: number; pages: number; page: number; limit: number }> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 10));
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};
  if (filters.userId) query.userId = filters.userId;
  if (filters.tone) query.tone = filters.tone;
  if (filters.language) query.language = filters.language;
  if (filters.favouritesOnly) query.isFavourite = true;
  if (filters.search) {
    const safe = filters.search.trim();
    if (safe) {
      query.$or = [
        { topic: { $regex: safe, $options: "i" } },
        { output: { $regex: safe, $options: "i" } },
      ];
    }
  }

  const [items, total] = await Promise.all([
    Generation.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Generation.countDocuments(query),
  ]);

  return { items, total, pages: Math.ceil(total / limit), page, limit };
}

export async function getGenerationById(id: string, userId?: string): Promise<IGeneration | null> {
  const query: Record<string, unknown> = { _id: id };
  if (userId) query.userId = userId;
  return Generation.findOne(query).lean();
}

export async function getSharedGenerationById(id: string): Promise<IGeneration | null> {
  return Generation.findOne({ _id: id, isShared: true }).lean();
}

export async function deleteGeneration(id: string, userId?: string): Promise<boolean> {
  const query: Record<string, unknown> = { _id: id };
  if (userId) query.userId = userId;
  const result = await Generation.findOneAndDelete(query);
  return result !== null;
}

export async function clearAllHistory(userId?: string): Promise<number> {
  const query = userId ? { userId } : {};
  const result = await Generation.deleteMany(query);
  return result.deletedCount;
}

// ── Favourites ───────────────────────────────────────────────
export async function toggleFavourite(id: string, userId?: string): Promise<IGeneration | null> {
  const query: Record<string, unknown> = { _id: id };
  if (userId) query.userId = userId;
  const gen = await Generation.findOne(query);
  if (!gen) return null;
  gen.isFavourite = !gen.isFavourite;
  await gen.save();
  return gen;
}

// ── Sharing ──────────────────────────────────────────────────
export async function setShareStatus(id: string, isShared: boolean, userId?: string): Promise<IGeneration | null> {
  const query: Record<string, unknown> = { _id: id };
  if (userId) query.userId = userId;
  const gen = await Generation.findOneAndUpdate(query, { isShared }, { new: true });
  return gen;
}

// ── Stats Aggregations ───────────────────────────────────────
export interface StatsResult {
  totalGenerations: number;
  totalWords: number;
  favouritesCount: number;
  byTone: { _id: string; count: number }[];
  byLanguage: { _id: string; count: number }[];
  last30Days: { _id: string; count: number; words: number }[];
}

export async function getStats(userId?: string): Promise<StatsResult> {
  const match: Record<string, unknown> = userId ? { userId } : {};
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totals, byTone, byLanguage, last30] = await Promise.all([
    Generation.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          words: { $sum: "$wordCount" },
          favs: { $sum: { $cond: ["$isFavourite", 1, 0] } },
        },
      },
    ]),
    Generation.aggregate([
      { $match: match },
      { $group: { _id: "$tone", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Generation.aggregate([
      { $match: match },
      { $group: { _id: "$language", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Generation.aggregate([
      { $match: { ...match, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          words: { $sum: "$wordCount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalGenerations: totals[0]?.count ?? 0,
    totalWords: totals[0]?.words ?? 0,
    favouritesCount: totals[0]?.favs ?? 0,
    byTone,
    byLanguage,
    last30Days: last30,
  };
}
