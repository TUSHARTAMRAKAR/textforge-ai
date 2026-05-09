import { Schema, model, Document } from "mongoose";

// ─────────────────────────────────────────────────────────────
//  Generation.ts  —  Mongoose Model
//
//  Every time a user generates text, we save it here.
//  This powers the History page on the frontend.
//
//  Schema fields:
//    topic      — what the user asked to write about
//    tone       — formal / casual / creative / academic
//    length     — short / medium / long
//    prompt     — the full prompt we sent to Claude
//    output     — the full text Claude returned
//    wordCount  — auto-calculated on save
//    createdAt  — auto timestamp from mongoose
// ─────────────────────────────────────────────────────────────

export interface IGeneration extends Document {
  topic: string;
  tone: "formal" | "casual" | "creative" | "academic";
  length: "short" | "medium" | "long";
  prompt: string;
  output: string;
  wordCount: number;
  model: string;
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
      default: "gemini-2.0-flash",
    },
  },
  {
    timestamps: true, // auto adds createdAt + updatedAt
  }
);

// Auto-calculate word count before saving
GenerationSchema.pre("save", function (next) {
  this.wordCount = this.output.split(/\s+/).filter(Boolean).length;
  next();
});

// Index for fast history queries (newest first)
GenerationSchema.index({ createdAt: -1 });

export const Generation = model<IGeneration>("Generation", GenerationSchema);
