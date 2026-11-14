"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Users", value: "0", color: "#4c1d95" },
    { label: "Wardrobe Items", value: "0", color: "#9d174d" },
    { label: "Total Categories", value: "0", color: "#065f46" },
    { label: "Pending Requests", value: "0", color: "#9a3412" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [usersRes, catRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/categories"),
        ]);
        if (!usersRes.ok || !catRes.ok) throw new Error("API failed");
        const users = await usersRes.json();
        const categories = await catRes.json();
        setStats([
          { label: "Total Users", value: String(Array.isArray(users) ? users.length : 0), color: "#4c1d95" },
          { label: "Wardrobe Items", value: "0", color: "#9d174d" },
          { label: "Total Categories", value: String(Array.isArray(categories) ? categories.length : 0), color: "#065f46" },
          { label: "Pending Requests", value: "0", color: "#9a3412" },
        ]);
      } catch (e) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <div style={{ padding: "24px" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: "24px", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0 20px 0" }}>Welcome to SmartWardrobe administration</p>
      {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "12px", borderRadius: "10px", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#eef2ff", padding: "20px", borderRadius: "12px" }}>
            <p style={{ fontSize: "13px", color: "#4b5563", margin: 0 }}>{s.label}</p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0 0 0", color: s.color }}>{s.value}</h2>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>Recent Activity</h3>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px" }}>Total Users: <b>{stats[0].value}</b> | Total Categories: <b>{stats[2].value}</b> - Real data from API</p>
      </div>
    </div>
  );
}