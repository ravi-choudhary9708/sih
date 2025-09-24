import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import ConceptMap from "@/models/ConceptMap";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ error: "Missing ?q=term" }, { status: 400 });
    }

    // fuzzy regex search in NAMASTE
    const results = await ConceptMap.find({
      sourceDisplay: { $regex: q, $options: "i" },
    })
      .limit(15)
      .lean();

    // Format response for frontend autocomplete
    const response = results.map((item) => ({
      namaste: {
        code: item.sourceCode,
        display: item.sourceDisplay,
      },
      mappings: item.targets || [],

    }));

    return NextResponse.json(response);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
