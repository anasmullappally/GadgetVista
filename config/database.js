import mongoose from "mongoose";
import { config } from "dotenv";
config();

export const connectDB = async () => {
  try {
    // Connection URI
    const uri = process.env.MONGO_URI;

    // Connect to MongoDB
    await mongoose.connect(uri);

    console.log("Connected successfully to MongoDB");

    // Return the connected database object if needed
    return mongoose.connection;
  } catch (error) {
    console.error("Connection error:", error.message);
    // Exit the process on connection error
    process.exit(1);
  }
};
