"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [abhaId, setAbhaId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abhaId, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Login successful ✅");
      router.push("/"); // redirect to home or dashboard
    } else {
      setMessage(data.error || "Login failed ❌");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>🔑 Login</h2>
      <form onSubmit={handleLogin}>
        <input
          value={abhaId}
          onChange={(e) => setAbhaId(e.target.value)}
          placeholder="Enter ABHA ID"
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <button type="submit" style={{ marginTop: "10px" }}>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
