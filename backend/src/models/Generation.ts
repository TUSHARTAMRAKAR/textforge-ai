import { Schema, model, Document } from "mongoose";

// ─────────────────────────────────────────────────────────────
//  Generation.ts  —  Mongoose Model
//
//  Every time a user generates text, we save it here.
//  This powers the History page on the frontend.
// ─────────────────────────────────────────────────────────────

export type Tone = "formal" | "casual" | "creative" | "academic";
export type Length = "short" | "medium" | "long";
export type Language = "en" | "hi" | "es" | "fr" | "ja" | "ar" | "de" | "zh";

export interface IGeneration extends Document {
  topic: string;
  tone: Tone;
  length: Length;
  language: Language;
  keywords: string[];
  prompt: string;
  output: string;
  wordCount: number;
  model: string;

  // User scoping (used when authentication is enabled)
  userId?: string;

  // Roadmap features
  isFavourite: boolean;
  isShared: boolean;
  templateId?: string;
  refinementOf?: string;

  createdAt: Date;
  updatedAt: Date;
}

const GenerationSchema = new Schema<IGeneration>(
  {
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      maxlength: [500, "Topic cannot exceed 500 characters"],
    },
    tone: {
      type: String,
      enum: ["formal", "casual", "creative", "academic"],
      required: [true, "Tone is required"],
      default: "formal",
    },
    length: {
      type: String,
      enum: ["short", "medium", "long"],
      required: [true, "Length is required"],
      default: "medium",
    },
    language: {
      type: String,
      enum: ["en", "hi", "es", "fr", "ja", "ar", "de", "zh"],
      default: "en",
    },
    keywords: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length <= 10,
        message: "Cannot have more than 10 SEO keywords",
      },
    },
    prompt: {
      type: String,
      required: [true, "Prompt is required"],
    },
    output: {
      type: String,
      required: [true, "Output is required"],
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    model: {
      type: String,
      default: "gemini-2.5-flash",
    },
    userId: {
      type: String,
      index: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    isShared: {
      type: Boolean,
      default: true,
    },
    templateId: {
      type: String,
    },
    refinementOf: {
      type: Schema.Types.ObjectId,
      ref: "Generation",
    },
  },
  {
    timestamps: true,
  }
);

GenerationSchema.pre("save", function (next) {
  this.wordCount = this.output.split(/\s+/).filter(Boolean).length;
  next();
});

GenerationSchema.index({ createdAt: -1 });
GenerationSchema.index({ isFavourite: 1, createdAt: -1 });
GenerationSchema.index({ userId: 1, createdAt: -1 });
GenerationSchema.index({ topic: "text", output: "text" });

export const Generation = model<IGeneration>("Generation", GenerationSchema);
