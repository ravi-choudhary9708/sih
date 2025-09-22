import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose.js";
import Audit from "@/models/Audit";

export async function GET() {
  await connectDB();
  const logs = await Audit.find().sort({ timestamp: -1 }).limit(20);
  return NextResponse.json(logs);
}
