import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose;
  const uri = process.env.MONGO_URI ;
  await mongoose.connect(uri, { dbName: "ayush" });
  isConnected = true;
  console.log(" MongoDB connected");
  return mongoose;
}
