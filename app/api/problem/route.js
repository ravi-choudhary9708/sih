import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Problem from "@/models/Problem";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const problem = await Problem.create(body);

    return NextResponse.json({ message: "✅ Problem added", problem });
  } catch (err) {
    console.error("Problem creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const problems = await Problem.find().limit(20);
    return NextResponse.json(problems);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
