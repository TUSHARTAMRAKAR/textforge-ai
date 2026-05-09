import { Schema, model, Document } from "mongoose";
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────
//  ApiKey.ts  —  Public API Mode
//
//  Each authenticated user can mint API keys that let third
//  parties call the public /v1/* endpoints from their own
//  apps. Keys are prefixed `tf_live_` for easy identification.
// ─────────────────────────────────────────────────────────────

export interface IApiKey extends Document {
  userId: string;
  key: string;
  name: string;
  lastUsed?: Date;
  requestCount: number;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    userId: { type: String, required: true, index: true },
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    lastUsed: { type: Date },
    requestCount: { type: Number, default: 0 },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export function generateApiKey(): string {
  return `tf_live_${crypto.randomBytes(24).toString("hex")}`;
}

export const ApiKey = model<IApiKey>("ApiKey", ApiKeySchema);
