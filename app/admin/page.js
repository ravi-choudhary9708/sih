"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState({ topCodes: [] });

  // Fetch audit logs
  async function fetchLogs() {
    const res = await fetch("/api/admin/audit");
    const data = await res.json();
    setLogs(data || []);
  }

  // Fetch analytics
  async function fetchAnalytics() {
    const res = await fetch("/api/admin/analytics");
    const data = await res.json();
    setAnalytics(data);
  }

  // Handle CSV upload
  async function handleUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.file.files[0]);

    const res = await fetch("/api/admin/uploadCsv", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  }

  // Trigger ICD sync
  async function handleSyncICD() {
    const res = await fetch("/api/admin/syncIcd");
    const data = await res.json();
    setMessage(data.message || data.error);
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>⚙️ Admin Dashboard</h2>

      {/* Tabs */}
      <nav style={{ marginBottom: "20px" }}>
        {["upload", "sync", "audit", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "audit") fetchLogs();
              if (tab === "analytics") fetchAnalytics();
            }}
            style={{
              marginRight: "10px",
              padding: "6px 12px",
              background: activeTab === tab ? "#0070f3" : "#eee",
              color: activeTab === tab ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Upload NAMASTE CSV */}
      {activeTab === "upload" && (
        <form onSubmit={handleUpload}>
          <input type="file" name="file" accept=".csv" required />
          <button type="submit" style={{ display: "block", marginTop: "10px" }}>
            Upload NAMASTE CSV
          </button>
          {message && <p>{message}</p>}
        </form>
      )}

      {/* Sync ICD-11 */}
      {activeTab === "sync" && (
        <div>
          <p>Pull latest ICD-11 TM2 + Biomedicine codes from WHO API.</p>
          <button onClick={handleSyncICD}>Sync ICD-11 Codes</button>
          {message && <p>{message}</p>}
        </div>
      )}

      {/* Audit Logs */}
      {activeTab === "audit" && (
        <div>
          <h3>📜 Audit Logs</h3>
          <ul>
            {logs.map((log, idx) => (
              <li key={idx}>
                <b>{log.user}</b> → {log.action} ({log.timestamp})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analytics */}
      {activeTab === "analytics" && (
        <div>
          <h3>📊 Analytics</h3>
          <ul>
            {analytics.topCodes.map((item, idx) => (
              <li key={idx}>
                {item.display} ({item.count} times)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
