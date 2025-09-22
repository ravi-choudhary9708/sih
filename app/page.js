// src/app/page.js
'use client';
import { useState } from "react";

export default function Page(){
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [bundleJson, setBundleJson] = useState(null);

  async function search(){
    if (!q) return;
    const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data || []);
  }

  async function saveAsBundle(item){
    // create a minimal FHIR bundle using patient dummy data
    const bundle = {
      resourceType: "Bundle",
      type: "collection",
      entry: [
        { resource: { resourceType: "Patient", id: "demo-patient-1", name:[{text:"Demo Patient"}] } },
        {
          resource: {
            resourceType: "Condition",
            id: `cond-${Date.now()}`,
            code: {
              coding: [
                { system: "NAMASTE", code: item.code, display: item.display },
                ...(item.mapped ? [{ system: "ICD11", code: item.mapped.targetCode, display: item.mapped.display }] : [])
              ]
            },
            clinicalStatus: { text: "active" }
          }
        }
      ]
    };
    const res = await fetch('/api/bundle', {
      method:'POST', headers:{ 'Content-Type':'application/json','authorization':'Bearer demo-token' }, body: JSON.stringify({ bundle, user: "demo-doctor" })
    });
    const j = await res.json();
    setMessage(j.message || 'saved');
    setBundleJson(j.saved || null);
  }

  return (
    <div>
      <div className="card">
        <h2>Clinician Sandbox</h2>
        <div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search NAMASTE or ICD term..." />
          <button onClick={search}>Search</button>
        </div>
        <div style={{ marginTop: 12 }}>
          {results.length===0 ? <p>No results yet</p> : results.map(r=>(
            <div key={r.code} style={{ padding:8, borderBottom:"1px solid #eee" }}>
              <b>{r.display}</b> <small>({r.system}:{r.code})</small>
              <div>
                {r.mapped && <span style={{ marginRight:8 }}>→ ICD: {r.mapped.targetCode} / {r.mapped.display}</span>}
                <button onClick={()=>saveAsBundle(r)}>Add to Patient (create FHIR Bundle)</button>
              </div>
            </div>
          ))}
        </div>
        {message && <div style={{ marginTop:12 }}>{message}</div>}
      </div>

      <div style={{ marginTop: 20 }} className="card">
        <h3>Last saved bundle (DB)</h3>
        <pre>{bundleJson ? JSON.stringify(bundleJson, null, 2) : "No bundle saved yet."}</pre>
      </div>
    </div>
  );
}
