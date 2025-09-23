import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Problem from "@/models/Problem";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const problem = await Problem.create({
      patientId: body.patientId || "demo-patient", // fallback for now
      codes: body.codes || [],                     // NAMASTE + ICD codes
      mappings: body.mappings || [],               // ICD11 mappings
      clinicalStatus: body.clinicalStatus || "active",
      onsetDateTime: body.onsetDateTime || new Date(),
      recordedBy: body.recordedBy || "system",
      consent: body.consent || { given: false },   // take from body
    });

    console.log("✅ Problem saved:", problem);

    return NextResponse.json({ message: "Problem saved", problem });
  } catch (err) {
    console.error("❌ ProblemList save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
