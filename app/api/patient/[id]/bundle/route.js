import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Patient from "@/models/Patient";
import Problem from "@/models/Problem";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedparams= await params;
    const patientId = resolvedparams.id;

    // fetch patient
    const patient = await Patient.findById(patientId).lean();
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // fetch problems
    const problems = await Problem.find({ patientId }).lean();

    // build FHIR Bundle
    const bundle = {
      resourceType: "Bundle",
      type: "collection",
      entry: [],
    };

    // add Patient resource
    bundle.entry.push({
      resource: {
        resourceType: "Patient",
        id: patient._id.toString(),
        name: [{ text: patient.name }],
        gender: patient.gender || "unknown",
        birthDate: patient.birthDate
          ? new Date(patient.birthDate).toISOString().split("T")[0]
          : undefined,
      },
    });

    // add Condition resources for each problem
    problems.forEach((p) => {
      // Condition resource
      bundle.entry.push({
        resource: {
          resourceType: "Condition",
          id: p._id.toString(),
          subject: { reference: `Patient/${patient._id}` },
          clinicalStatus: { text: p.clinicalStatus },
          code: {
            coding: p.codes.map((c) => ({
              system: c.system,
              code: c.code,
              display: c.display,
            })),
          },
          onsetDateTime: p.onsetDateTime,
          note: [
            {
              text:
                p.mappings?.map(
                  (m) => `[${m.system}] ${m.display} (${m.code})`
                )?.join("; ") || "No mappings",
            },
          ],
        },
      });

      // Consent resource (if given)
      if (p.consent && p.consent.given) {
        bundle.entry.push({
          resource: {
            resourceType: "Consent",
            id: `${p._id.toString()}-consent`,
            status: p.consent.given ? "active" : "inactive",
            patient: { reference: `Patient/${patient._id}` },
            dateTime: p.consent.givenAt?.toISOString(),
            provision: {
              type: "permit",
              purpose: [{ text: p.consent.purpose }],
              actor: [
                {
                  role: { text: "patient" },
                  reference: { reference: `Patient/${patient._id}` },
                },
              ],
            },
          },
        });
      }
    });

    return NextResponse.json(bundle);
  } catch (err) {
    console.error("FHIR Bundle export error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
