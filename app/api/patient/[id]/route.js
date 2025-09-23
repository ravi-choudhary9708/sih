import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Problem from "@/models/Problem";

export async function GET(req, { params }) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Ensure the logged-in patient can only access their own dashboard
  if (decoded.id !== params.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const problems = await Problem.find({ patientId: decoded.id }).lean();
  return NextResponse.json({ problems });
}
