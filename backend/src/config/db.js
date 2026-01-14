import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  // Check if we already have a ready connection
  if (mongoose.connection.readyState === 1) {
    console.log("MONGODB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MONGODB connected successfully", conn.connection.host);
  } catch (error) {
    console.error("MONGODB connection failed", error);
    process.exit(1);
  }
};
