import { Generation, IGeneration } from "../models/Generation";

// ─────────────────────────────────────────────────────────────
//  historyService.ts
//
//  All database operations for generations.
//  Keeps the route handlers thin — business logic lives here.
// ─────────────────────────────────────────────────────────────

export interface SaveGenerationDTO {
  topic: string;
  tone: "formal" | "casual" | "creative" | "academic";
  length: "short" | "medium" | "long";
  prompt: string;
  output: string;
  model?: string;
}

// Save a completed generation to MongoDB
export async function saveGeneration(
  data: SaveGenerationDTO
): Promise<IGeneration> {
  const generation = new Generation(data);
  return generation.save();
}

// Get paginated history — newest first
export async function getHistory(
  page = 1,
  limit = 10
): Promise<{ items: IGeneration[]; total: number; pages: number }> {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Generation.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Generation.countDocuments(),
  ]);

  return {
    items,
    total,
    pages: Math.ceil(total / limit),
  };
}

// Get a single generation by ID
export async function getGenerationById(
  id: string
): Promise<IGeneration | null> {
  return Generation.findById(id).lean();
}

// Delete a single generation
export async function deleteGeneration(id: string): Promise<boolean> {
  const result = await Generation.findByIdAndDelete(id);
  return result !== null;
}

// Delete ALL history (for "clear all" feature)
export async function clearAllHistory(): Promise<number> {
  const result = await Generation.deleteMany({});
  return result.deletedCount;
}
