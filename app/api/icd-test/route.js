import { NextResponse } from "next/server";
import { searchICD } from "@/utils/icd";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("q") || "Ama"; // default test term
    const linearization = searchParams.get("lin") || "tm2"; // tm2 or mms

    const matches = await searchICD(term, linearization);

    return NextResponse.json({
      query: term,
      linearization,
      results: matches,
    });
  } catch (err) {
    console.error("ICD Test API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
