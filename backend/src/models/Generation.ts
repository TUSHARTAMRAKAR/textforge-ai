import { Schema, model, Document, Types } from "mongoose";

export type Tone     = "formal" | "casual" | "creative" | "academic";
export type Length   = "short"  | "medium" | "long";
export type Language = "en" | "hi" | "es" | "fr" | "ja" | "ar" | "de" | "zh";

// ─────────────────────────────────────────────────────────────
//  Generation.ts — Mongoose Model
//  Note: field renamed from "model" to "modelName" to avoid
//  conflict with Mongoose's built-in Document.model() method.
// ─────────────────────────────────────────────────────────────

export interface IGeneration {
  _id:          Types.ObjectId;
  topic:        string;
  tone:         Tone;
  length:       Length;
  language:     Language;
  keywords:     string[];
  prompt:       string;
  output:       string;
  wordCount:    number;
  modelName:    string;
  userId?:      string;
  isFavourite:  boolean;
  isShared:     boolean;
  templateId?:  string;
  refinementOf?: string;
  createdAt:    Date;
  updatedAt:    Date;
}

const GenerationSchema = new Schema(
  {
    topic:       { type: String, required: true, trim: true, maxlength: 500 },
    tone:        { type: String, enum: ["formal","casual","creative","academic"], default: "formal" },
    length:      { type: String, enum: ["short","medium","long"], default: "medium" },
    language:    { type: String, default: "en" },
    keywords:    { type: [String], default: [] },
    prompt:      { type: String, required: true },
    output:      { type: String, required: true },
    wordCount:   { type: Number, default: 0 },
    modelName:   { type: String, default: "gemini-2.5-flash" },
    userId:      { type: String, index: true },
    isFavourite: { type: Boolean, default: false, index: true },
    isShared:    { type: Boolean, default: false },
    templateId:  { type: String },
    refinementOf:{ type: String },
  },
  { timestamps: true }
);

// Auto word count
GenerationSchema.pre("save", function (next) {
  const doc = this as any;
  doc.wordCount = (doc.output || "").split(/\s+/).filter(Boolean).length;
  next();
});

GenerationSchema.index({ createdAt: -1 });
GenerationSchema.index({ isFavourite: 1, createdAt: -1 });
GenerationSchema.index({ userId: 1, createdAt: -1 });

export const Generation = model("Generation", GenerationSchema);
