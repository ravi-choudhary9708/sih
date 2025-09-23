"use client";
import { useState } from "react";

export default function ProblemListPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  }

  async function handleSave(item) {
    const res = await fetch("/api/problem-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: "demo-patient",
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

