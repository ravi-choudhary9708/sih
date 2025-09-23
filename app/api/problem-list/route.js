import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Problem from "@/models/Problem";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const problem = await Problem.create({
      patientId: body.patientId || "demo-patient", // replace with ABHA later
      namaste: body.namaste,
      mappings: body.mappings || []
    });

    return NextResponse.json({ message: "Problem saved", problem });
  } catch (err) {
    console.error("ProblemList save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
