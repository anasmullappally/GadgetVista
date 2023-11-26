import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./logger.js";
config();

export const connectDB = async () => {
  try {
    // Connection URI
    const uri = process.env.MONGO_URI;

    // Connect to MongoDB
    await mongoose.connect(uri);

    logger.info({
      label: "Database",
      message: `Database connected successfully`,
    });

    // Return the connected database object if needed
    return mongoose.connection;
  } catch (error) {
    logger.info({
      label: "Database",
      message: `connection Error : ${error.message}`,
    });
    // Exit the process on connection error
    process.exit(1);
  }
};
