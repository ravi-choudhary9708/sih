import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Problem from "@/models/Problem";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedparams= await params
    const patientId = resolvedparams.id;

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    const problems = await Problem.find({ patientId }).lean();

    // Map each problem to a FHIR Condition resource
 const conditions = problems.map((p) => ({
  resourceType: "Condition",
  id: p._id.toString(),
  clinicalStatus: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
        code: p.clinicalStatus || "active",
      },
    ],
  },
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-category",
          code: "problem-list-item",
        },
      ],
    },
  ],
  code: {
    coding: p.codes?.map((c) => ({
      system:
        c.system === "NAMASTE"
          ? "http://indianhealth.gov.in/namaste"
          : c.system === "ICD11-TM2"
          ? "http://id.who.int/icd/entity/tm2"
          : "http://id.who.int/icd/entity/mms",
      code: c.code,
      display: c.display,
    })),
  },
  subject: { reference: `Patient/${p.patientId}` },
  onsetDateTime: p.onsetDateTime,
  recordedDate: p.createdAt,
  recorder: p.recordedBy ? { reference: `Practitioner/${p.recordedBy}` } : undefined,
  extension: [
    {
      url: "http://hl7.org/fhir/StructureDefinition/consent",
      valueBoolean: p.consent?.given || false,
    },
    {
      url: "http://hl7.org/fhir/StructureDefinition/consentDateTime",
      valueDateTime: p.consent?.givenAt,
    },
    {
      url: "http://hl7.org/fhir/StructureDefinition/consentPurpose",
      valueString: p.consent?.purpose,
    },
  ],
}));

    return NextResponse.json({ patientId, conditions });
  } catch (err) {
    console.error("FHIR conditions fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
