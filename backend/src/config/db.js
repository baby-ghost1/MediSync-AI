import mongoose from "mongoose";

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

    console.log(`
=========================================
✅ MongoDB Connected Successfully
📦 Database : ${connection.connection.name}
🌍 Host     : ${connection.connection.host}
=========================================
`);

    mongoose.connection.on("connected", () => {
      console.log("🟢 MongoDB Connected");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("🟡 MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB Reconnected");
    });

    mongoose.connection.on("error", (error) => {
      console.error("🔴 MongoDB Error:", error.message);
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();

      console.log(
        "📦 MongoDB Connection Closed"
      );

      process.exit(0);
    });

    return connection;
  } catch (error) {
    console.error(`
=========================================
❌ MongoDB Connection Failed
${error.message}
=========================================
`);

    process.exit(1);
  }
};

export default connectDB;