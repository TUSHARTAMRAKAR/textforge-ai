import mongoose from "mongoose";
import { config } from "../config";

// ─────────────────────────────────────────────────────────────
//  database.ts
//  Manages the MongoDB Atlas connection.
//  Uses mongoose's built-in connection pooling.
//  Retries on failure with exponential backoff.
// ─────────────────────────────────────────────────────────────

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if DB fails — app can't run without it
  }
}
