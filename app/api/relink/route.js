import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Code from "@/models/Code";
import ConceptMap from "@/models/ConceptMap";
import { searchICD } from "@/utils/icd";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function GET() {
  try {
    await connectDB();

    const codes = await Code.find({ system: "NAMASTE" });
    let tm2Count = 0;
    let mmsCount = 0;

    for (const code of codes) {
      // ICD-11 TM2
      const tm2Matches = await searchICD(code.display, "tm2");
      console.log("tm2:",tm2Matches)
      if (tm2Matches.length > 0) {
        tm2Count++;
        await ConceptMap.updateOne(
          { sourceCode: code.code, sourceSystem: "NAMASTE" },
          {
            $set: {
              sourceDisplay: code.display,
              targets: tm2Matches,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
      }

      // ICD-11 MMS (biomedicine)
      const mmsMatches = await searchICD(code.display, "mms");
        console.log("mms:",mmsMatches)
      if (mmsMatches.length > 0) {
        mmsCount++;
        await ConceptMap.updateOne(
          { sourceCode: code.code, sourceSystem: "NAMASTE" },
          {
            $addToSet: { targets: { $each: mmsMatches } }, // merge instead of overwrite
            $set: { updatedAt: new Date() },
          },
          { upsert: true }
        );
      }

      // avoid WHO API throttling
      await sleep(200);
    }

    return NextResponse.json({
      message: "🔄 Re-link job completed",
      total: codes.length,
      linkedTM2: tm2Count,
      linkedMMS: mmsCount,
    });
  } catch (err) {
    console.error("Relink job error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
