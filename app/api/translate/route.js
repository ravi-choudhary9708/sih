// app/api/translate/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import ConceptMap from "@/models/ConceptMap";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");            // source code to translate
    const sourceSystem = searchParams.get("source");  // e.g., NAMASTE
    const targetSystem = searchParams.get("target");  // e.g., ICD11-TM2

    if (!code || !sourceSystem || !targetSystem) {
      return NextResponse.json({ error: "Missing query params: code, source, target" }, { status: 400 });
    }

    const conceptMap = await ConceptMap.findOne({
      "groups.sourceSystem": sourceSystem,
      "groups.targetSystem": targetSystem
    }).lean();

    if (!conceptMap) return NextResponse.json({ translation: [] });

    const group = conceptMap.groups.find(
      g => g.sourceSystem === sourceSystem && g.targetSystem === targetSystem
    );

    const element = group?.elements.find(e => e.code === code);

    return NextResponse.json({ translation: element?.target || [] });

  } catch (err) {
    console.error("FHIR $translate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
