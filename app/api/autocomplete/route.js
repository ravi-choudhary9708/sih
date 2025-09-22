import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose.js";
import Code from "@/models/Code.js";
import ConceptMap from "@/models/ConceptMap";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const codes = await Code.find({
    $or: [
      { system: "NAMASTE", display: { $regex: q, $options: "i" } },
      { system: "ICD11", display: { $regex: q, $options: "i" } }
    ]
  }).limit(30).lean();

  const results = await Promise.all(
    codes.map(async (c) => {
      if (c.system === "NAMASTE") {
        const map = await ConceptMap.findOne({ sourceCode: c.code }).lean();
        let mapped = null;
        if (map) {
          const target = await Code.findOne({ system: "ICD11", code: map.targetCode }).lean();
          mapped = { targetCode: map.targetCode, display: target ? target.display : null };
        }
        return { ...c, mapped };
      }
      return c;
    })
  );

  return NextResponse.json(results);
}
