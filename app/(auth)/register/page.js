"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    abhaId: "",
    password: "",
    name: "",
    gender: "male",
    birthDate: "",
    phone: "",
    email: "",
    address: { line: "", city: "", state: "", postalCode: "", country: "India" },
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  }

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>📝 Patient Register</h2>
      <form onSubmit={handleRegister}>
        <input name="abhaId" value={form.abhaId} onChange={handleChange} placeholder="ABHA ID" required style={{ display: "block", margin: "10px 0", width: "100%" }} />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Set Password" required style={{ display: "block", margin: "10px 0", width: "100%" }} />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required style={{ display: "block", margin: "10px 0", width: "100%" }} />
        <select name="gender" value={form.gender} onChange={handleChange} style={{ display: "block", margin: "10px 0", width: "100%" }}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required style={{ display: "block", margin: "10px 0", width: "100%" }} />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" style={{ display: "block", margin: "10px 0", width: "100%" }} />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ display: "block", margin: "10px 0", width: "100%" }} />

        <h4>📍 Address</h4>
        <input name="address.line" value={form.address.line} onChange={handleChange} placeholder="Street / Locality" style={{ display: "block", margin: "5px 0", width: "100%" }} />
        <input name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" style={{ display: "block", margin: "5px 0", width: "100%" }} />
        <input name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" style={{ display: "block", margin: "5px 0", width: "100%" }} />
        <input name="address.postalCode" value={form.address.postalCode} onChange={handleChange} placeholder="Postal Code" style={{ display: "block", margin: "5px 0", width: "100%" }} />
        <input name="address.country" value={form.address.country} onChange={handleChange} placeholder="Country" style={{ display: "block", margin: "5px 0", width: "100%" }} />

        <button type="submit" style={{ marginTop: "15px", padding: "10px 20px" }}>Register Patient</button>
      </form>
      {message && <p style={{ marginTop: "15px", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}
