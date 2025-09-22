"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [abhaId, setAbhaId] = useState("");
  const [role, setRole] = useState("clinician");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abhaId, password, role }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>📝 Register</h2>
      <form onSubmit={handleRegister}>
        <input
          value={abhaId}
          onChange={(e) => setAbhaId(e.target.value)}
          placeholder="Enter 14-digit ABHA ID"
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Set Password"
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        >
          <option value="clinician">Clinician</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ marginTop: "10px" }}>Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
