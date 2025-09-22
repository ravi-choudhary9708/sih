import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Code from "@/models/Code";
import ConceptMap from "@/models/ConceptMap";
import { parse } from "csv-parse/sync";

// WHO ICD-11 Search API
async function searchICD(term) {
  const url = `https://id.who.int/icd/entity/search?q=${encodeURIComponent(
    term
  )}&linearization=tm2`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.error("WHO API error:", res.status);
      return [];
    }
    const data = await res.json();

    // Simplify results (take first 1–2 matches only)
    return (data.destinationEntities || []).slice(0, 2).map((item) => ({
      code: item.id,
      display: item.title?.["@value"] || "No Title",
    }));
  } catch (err) {
    console.error("WHO ICD fetch failed:", err);
    return [];
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const form = await req.formData();
    const file = form.get("file");
    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf8");

    // Parse CSV
    const records = parse(text, { columns: true, trim: true });

    let linkedCount = 0;

    for (const r of records) {
      // Insert/update NAMASTE code
      await Code.updateOne(
        { system: "NAMASTE", code: r.code },
        {
          $set: {
            display: r.term,
            description: r.description || "",
            version: "uploaded",
          },
        },
        { upsert: true }
      );

      // Auto-link with ICD-11 (TM2/biomedicine)
      const matches = await searchICD(r.term);
      if (matches.length > 0) {
        linkedCount++;

        // Save concept map (overwrite if exists)
        await ConceptMap.updateOne(
          { sourceCode: r.code, system: "NAMASTE" },
          {
            $set: {
              sourceDisplay: r.term,
              targets: matches,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({
      message: `✅ Uploaded ${records.length} NAMASTE codes`,
      autoLinked: linkedCount,
    });
  } catch (err) {
    console.error("CSV Upload Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
