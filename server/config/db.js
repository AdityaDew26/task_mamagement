import mongoose from "mongoose";
import dotenv from "dotenv"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.error("Something went wrong connecting to the database:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
