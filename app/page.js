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
  const [loading, setLoading] = useState(false);

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
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(item) {
    if (!patientId) return;

    try {
      const res = await fetch("/api/problem-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          namaste: item.namaste,
          mappings: item.mappings,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Replace alert with a better notification (could be a toast)
        setSelected(item);
        // Simple inline success message for now
        alert("✅ Successfully added to Problem List!");
      } else {
        alert("❌ Failed to save. Please try again.");
      }
    } catch (err) {
      alert("❌ An error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-800">
              Add Health Condition
            </h1>
            {patientId && (
              <button
                onClick={() => router.push(`/patient/${patientId}`)}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                title="Go to Dashboard"
              >
                <span className="text-lg">🏠</span>
                <span className="font-medium">Dashboard</span>
              </button>
            )}
          </div>
          <p className="text-orange-600 mt-1 text-sm">Search NAMASTE terms and ICD mappings</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for health conditions (e.g., 'diabetes', 'hypertension')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-4 pl-12 pr-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  🔍 Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">No results found</h3>
            <p className="text-gray-600">Try searching for a different health condition</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-orange-800 mb-1">
                      {item.namaste.display}
                    </h3>
                    <p className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-block">
                      NAMASTE Code: {item.namaste.code}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleSave(item)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      ➕ Add
                    </button>
                  </div>
                </div>

                {/* Mappings */}
                {item.mappings && item.mappings.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      ICD Mappings
                    </h4>
                    <div className="space-y-2">
                      {item.mappings.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded-md border border-orange-200">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{m.code}</span>
                            <span className="text-sm text-gray-800">{m.display}</span>
                          </div>
                          <span className="text-xs text-orange-600 font-medium px-2 py-1 bg-orange-100 rounded-full">
                            {m.system}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}