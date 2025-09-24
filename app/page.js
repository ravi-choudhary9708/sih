"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, Plus, Stethoscope, Code, FileText } from "lucide-react";

export default function ProblemListPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [router]);

  async function handleSearch(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Problem List Manager</h1>
              <p className="text-gray-600 mt-1">Add NAMASTE conditions with ICD mappings</p>
            </div>
          </div>

          {/* Dashboard Navigation */}
          {patientId && (
            <button
              onClick={() => router.push(`/patient/${patientId}`)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for medical conditions and symptoms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 placeholder-gray-500 bg-orange-50/30"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search Conditions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {results.map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                selected === item ? 'border-orange-300 bg-orange-50/50' : 'border-orange-100 hover:border-orange-200'
              }`}
            >
              <div className="p-6">
                {/* NAMASTE Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-white">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">NAMASTE Condition</h3>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="font-medium text-gray-900 text-lg">{item.namaste.display}</div>
                    <div className="text-orange-600 font-mono text-sm mt-1">Code: {item.namaste.code}</div>
                  </div>
                </div>

                {/* Mappings Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white">
                      <Code className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Standard Code Mappings</h4>
                  </div>
                  <div className="space-y-3">
                    {item.mappings.map((mapping, i) => (
                      <div key={i} className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{mapping.display}</div>
                            <div className="text-amber-600 font-mono text-sm mt-1">
                              {mapping.system}: {mapping.code}
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">
                            {mapping.system}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSave(item)}
                  className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                    selected === item 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  {selected === item ? 'Added to Problem List ✓' : 'Add to Problem List'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-12 text-center">
            <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-600">Search for medical conditions to view NAMASTE terms and their ICD mappings</p>
          </div>
        )}
      </div>
    </div>
  );
}