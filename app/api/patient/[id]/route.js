import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Problem from "@/models/Problem";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const resolvedparams= await params
    const patientId = resolvedparams.id;
    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    const problems = await Problem.find({ patientId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ patientId, problems });
  } catch (err) {
    console.error("Patient problems fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
