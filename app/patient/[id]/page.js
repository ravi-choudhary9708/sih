"use client";

import { useState, useEffect,use } from "react";

export default function PatientDashboard({ params }) {
    const resolvedparams= use(params)
  const patientId = resolvedparams.id; // URL param /patient/[id]
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      try {
        const res = await fetch(`/api/patient/${patientId}`);
        const data = await res.json();
        setProblems(data.problems || []);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, [patientId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Problem List</h1>

      {loading ? (
        <p>Loading problems...</p>
      ) : problems.length === 0 ? (
        <p>No problems found for this patient.</p>
      ) : (
        <ul className="space-y-4">
          {problems.map((p) => {
            // Extract NAMASTE code
            const namasteCode = p.codes?.find((c) => c.system === "NAMASTE");

            return (
              <li key={p._id} className="border p-4 rounded shadow">
                <div>
                  <strong>NAMASTE Term:</strong>{" "}
                  {namasteCode?.display || "N/A"} ({namasteCode?.code || "N/A"})
                </div>

                <div>
                  <strong>Clinical Status:</strong> {p.clinicalStatus || "unknown"}
                </div>

                <div>
                  <strong>Onset:</strong>{" "}
                  {new Date(p.onsetDateTime).toLocaleString()}
                </div>

                <div className="mt-2">
                  <strong>All Codes:</strong>
                  <ul className="list-disc ml-6">
                    {p.codes?.map((c, idx) => (
                      <li key={idx}>
                        [{c.system}] {c.display} ({c.code})
                      </li>
                    )) || <li>No codes</li>}
                  </ul>
                </div>

                <div className="mt-2">
                  <strong>ICD Mappings:</strong>
                  <ul className="list-disc ml-6">
                    {p.mappings?.length > 0 ? (
                      p.mappings.map((m, idx) => (
                        <li key={idx}>
                          [{m.system}] {m.display} ({m.code})
                        </li>
                      ))
                    ) : (
                      <li>No mappings</li>
                    )}
                  </ul>
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  Created: {new Date(p.createdAt).toLocaleString()}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
