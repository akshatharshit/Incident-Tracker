import mongoose from "mongoose";

export const connectDB = async (MONGO_URI) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
