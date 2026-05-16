// this just connects to the DB called by server.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`,
    );
    console.log(
      `\nMongoDB connected.\nDB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MongoDB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
