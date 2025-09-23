import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Code from "@/models/Code";
import ConceptMap from "@/models/ConceptMap";
import { parse } from "csv-parse/sync";
import { searchICD } from "@/utils/icd";

// Delay helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    for (const row of records) {
      // Insert/update NAMASTE code
      await Code.updateOne(
        { system: "NAMASTE", code: row.NAMC_CODE },
        {
          $set: {
            display: row.NAMC_term,
            display_diacritical: row.NAMC_term_diacritical,
            display_devanagari: row.NAMC_term_DEVANAGARI,
            short_description: row.Short_definition,
            long_description: row.Long_definition,
            ontology: row.Ontology_branches,
            alt_names: {
              english: row["Name English"],
              under_index: row["Name English Under Index"],
              primary_related: row["Primary Index Related"],
            },
            version: "uploaded",
          },
        },
        { upsert: true }
      );

      // 🔍 Auto-link with ICD-11 TM2 + MMS
      const matchesTM2 = await searchICD(row.NAMC_term, "tm2");
      const matchesMMS = await searchICD(row.NAMC_term, "mms");

      const targets = [
        ...matchesTM2.map((m) => ({ ...m, system: "ICD11-TM2" })),
        ...matchesMMS.map((m) => ({ ...m, system: "ICD11-MMS" })),
      ];

      if (targets.length > 0) {
        linkedCount++;

        await ConceptMap.updateOne(
          { sourceCode: row.NAMC_CODE, sourceSystem: "NAMASTE" },
          {
            $set: {
              sourceDisplay: row.NAMC_term,
              targets,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
      }

      // Small delay to prevent throttling
      await sleep(100);
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
