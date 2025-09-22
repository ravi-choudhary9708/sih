import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import ConceptMap from "@/models/ConceptMap";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  // if q empty return sample maps
  if (!q) {
    const maps = await ConceptMap.find({}).limit(200).lean();
    return NextResponse.json(maps);
  }
  // search by code
  const map = await ConceptMap.findOne({ sourceCode: q }).lean();
  return NextResponse.json(map || {});
}
