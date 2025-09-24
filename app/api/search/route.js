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

    // Find ConceptMaps where any element code or display matches the query (case-insensitive)
    const results = await ConceptMap.find({
      "groups.elements.display": { $regex: q, $options: "i" },
    })
      .limit(20)
      .lean();

    // Transform results for frontend autocomplete
    const response = [];

    results.forEach((map) => {
      map.groups.forEach((group) => {
        group.elements.forEach((el) => {
          if (el.display.toLowerCase().includes(q.toLowerCase())) {
            response.push({
              namaste: {
                code: el.code,
                display: el.display,
              },
              mappings: el.target || [],
            });
          }
        });
      });
    });

    return NextResponse.json(response.slice(0, 15)); // Limit results
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
