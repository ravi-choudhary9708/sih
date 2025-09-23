"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPatientIdFromToken } from "@/utils/auth";

export default function ProblemListPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
  async function getMe() {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (!data.patient) {
        router.push("/login");
      } else {
        setPatientId(data.patient._id);
      }
    } catch (err) {
      router.push("/login");
    }
  }

  getMe();
}, []);

  async function handleSearch(e) {
    e.preventDefault();
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  }

  async function handleSave(item) {
    if (!patientId) return;

    const res = await fetch("/api/problem-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        namaste: item.namaste,
        mappings: item.mappings,
      }),
    });
    const data = await res.json();
    alert("✅ Saved to ProblemList");
    setSelected(item);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Problem (NAMASTE + ICD)</h1>

      {/* Go to Dashboard Button */}
      {patientId && (
        <button
          onClick={() => router.push(`/patient/${patientId}`)}
          className="mb-4 bg-purple-500 text-white px-4 py-2 rounded"
        >
          🏠 Go to Dashboard
        </button>
      )}

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search NAMASTE term..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <ul className="space-y-3">
        {results.map((item, idx) => (
          <li key={idx} className="border p-3 rounded">
            <div>
              <strong>NAMASTE:</strong> {item.namaste.display} ({item.namaste.code})
            </div>
            <div className="ml-4">
              <strong>Mappings:</strong>
              <ul className="list-disc ml-6">
                {item.mappings.map((m, i) => (
                  <li key={i}>
                    [{m.system}] {m.display} ({m.code})
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleSave(item)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              ➕ Add to ProblemList
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
