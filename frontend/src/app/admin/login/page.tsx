"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } else {
      setError(data.message);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "24px", border: "1px solid #ddd", borderRadius: "12px" }}>
      <h2>Admin Login</h2>
      <p>SmartWardrobe - Styra</p>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", background: "black", color: "white", padding: "12px", borderRadius: "8px" }}>Login</button>
      </form>
      <p style={{ fontSize: "12px", marginTop: "12px", color: "#666" }}>Demo: admin@styra.com / admin123</p>
    </div>
  );
}