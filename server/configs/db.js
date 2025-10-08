import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to:", mongoose.connection.name);
    });

    await mongoose.connect(process.env.DATABASE);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default connectDB;
