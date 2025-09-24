"use client";

import { useState, useEffect, use } from "react";
import { 
  User, 
  FileText, 
  Calendar, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Code, 
  Activity, 
  Clock, 
  Plus,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

export default function PatientDashboard({ params }) {
  const resolvedparams = use(params);
  const patientId = resolvedparams.id; // URL param /patient/[id]
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patient problems
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

  // Update consent
  async function handleConsent(problemId, given) {
    try {
      const res = await fetch(`/api/problem/${problemId}/consent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: { given } }),
      });

      if (!res.ok) throw new Error("Failed to update consent");

      const updated = await res.json();

      // Update local state
      setProblems((prev) =>
        prev.map((p) => (p._id === problemId ? { ...p, consent: updated.consent } : p))
      );
    } catch (err) {
      console.error("Consent update failed:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-12 text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Problems...</h2>
          <p className="text-gray-600">Fetching your medical information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600 mt-1">Medical Problem List & Consent Management</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{problems.length} Problem{problems.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Patient ID: {patientId}</span>
            </div>
          </div>
        </div>

        {problems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-12 text-center">
            <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Problems Found</h3>
            <p className="text-gray-600 mb-6">No medical problems are currently recorded for this patient.</p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
              <Plus className="w-4 h-4" />
              Add New Problem
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {problems.map((problem) => {
              const namasteCode = problem.codes?.find((c) => c.system === "NAMASTE");
              const isConsentGiven = problem.consent?.given;

              return (
                <div 
                  key={problem._id} 
                  className="bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    {/* Problem Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {namasteCode?.display || "Medical Condition"}
                          </h3>
                          <p className="text-orange-600 font-mono text-sm mt-1">
                            Code: {namasteCode?.code || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Consent Status Badge */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        isConsentGiven 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {isConsentGiven ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Consent Given
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            No Consent
                          </>
                        )}
                      </div>
                    </div>

                    {/* Problem Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-gray-900">Clinical Status</span>
                          </div>
                          <p className="text-gray-700 capitalize">{problem.clinicalStatus || "Unknown"}</p>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-amber-600" />
                            <span className="font-medium text-gray-900">Onset Date</span>
                          </div>
                          <p className="text-gray-700">
                            {new Date(problem.onsetDateTime).toLocaleDateString()} at{' '}
                            {new Date(problem.onsetDateTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900">Created</span>
                          </div>
                          <p className="text-gray-700">
                            {new Date(problem.createdAt).toLocaleDateString()} at{' '}
                            {new Date(problem.createdAt).toLocaleTimeString()}
                          </p>
                        </div>

                        {/* Consent Actions */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-900">Consent Management</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConsent(problem._id, true)}
                              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Give Consent
                            </button>
                            <button
                              onClick={() => handleConsent(problem._id, false)}
                              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                              <ShieldX className="w-4 h-4" />
                              Revoke
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Code Mappings Section */}
                    <div className="space-y-4">
                      {/* All Codes */}
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Code className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-gray-900">All Medical Codes</span>
                        </div>
                        <div className="space-y-2">
                          {problem.codes?.length > 0 ? (
                            problem.codes.map((code, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200">
                                <div>
                                  <span className="font-medium text-gray-900">{code.display}</span>
                                  <span className="text-purple-600 font-mono text-sm ml-2">({code.code})</span>
                                </div>
                                <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                                  {code.system}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic">No codes available</p>
                          )}
                        </div>
                      </div>

                      {/* ICD Mappings */}
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium text-gray-900">ICD Mappings</span>
                        </div>
                        <div className="space-y-2">
                          {problem.mappings?.length > 0 ? (
                            problem.mappings.map((mapping, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-indigo-200">
                                <div>
                                  <span className="font-medium text-gray-900">{mapping.display}</span>
                                  <span className="text-indigo-600 font-mono text-sm ml-2">({mapping.code})</span>
                                </div>
                                <span className="px-2 py-1 bg-indigo-200 text-indigo-800 text-xs font-medium rounded-full">
                                  {mapping.system}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic">No ICD mappings available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}