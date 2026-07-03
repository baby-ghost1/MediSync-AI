import mongoose from "mongoose";
import logger from "../services/logger.service.js";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        autoIndex: process.env.NODE_ENV !== "production",
        maxPoolSize: 20,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      }
    );

    logger.info(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);

    mongoose.connection.on("connected", () => {
      logger.debug("MongoDB re-connected");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB error:", error.message);
    });

    return connection;
  } catch (error) {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
