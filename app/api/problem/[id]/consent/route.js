import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Problem from "@/models/Problem";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
 const resolvedparams= await params;
    const { id } = resolvedparams; // problemId from URL
    const body = await req.json();

    if (!body.consent) {
      return NextResponse.json(
        { error: "Consent data missing" },
        { status: 400 }
      );
    }

    const updated = await Problem.findByIdAndUpdate(
      id,
      { consent: body.consent },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Consent updated successfully",
      consent: updated.consent,
    });
  } catch (err) {
    console.error("Consent update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
