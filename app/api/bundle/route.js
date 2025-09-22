import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose.js";
import Bundle from "@/models/Bundle.js";
import Audit from "@/models/Audit";
import FhirKitClient from "fhir-kit-client";

export async function POST(req) {
  const body = await req.json();
  const { bundle, user } = body;
  await connectDB();

  // 🔍 validate against HAPI FHIR server
  const client = new FhirKitClient({ baseUrl: "https://hapi.fhir.org/baseR4" });
  try {
    await client.create({ resourceType: "Bundle", body: bundle });
  } catch (e) {
    return NextResponse.json({ error: "FHIR validation failed", details: e.message }, { status: 400 });
  }

  const stored = new Bundle({ bundle, createdBy: user || "unknown" });
  await stored.save();
  await new Audit({ action: "bundle-save", user: user || "unknown", details: { id: stored._id } }).save();

  return NextResponse.json({ message: "Bundle validated & saved ✅", saved: stored });
}
