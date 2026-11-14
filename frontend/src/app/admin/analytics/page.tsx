"use client";
import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [filter, setFilter] = useState("This Week");
  const [stats, setStats] = useState([
    { label: "Total Users", value: "0", change: "+12% this month", color: "#4c1d95" },
    { label: "Total Wardrobe Items", value: "0", change: "+8% this month", color: "#9d174d" },
    { label: "Total Outfits Created", value: "0", change: "+18% this month", color: "#065f46" },
    { label: "Total Categories", value: "0", change: "Active", color: "#9a3412" },
  ]);

  const [chartData] = useState([
    { day: "Mon", value: 65 },
    { day: "Tue", value: 82 },
    { day: "Wed", value: 78 },
    { day: "Thu", value: 95 },
    { day: "Fri", value: 110 },
    { day: "Sat", value: 125 },
    { day: "Sun", value: 90 },
  ]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [usersRes, catRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/categories"),
        ]);
        const users = await usersRes.json();
        const categories = await catRes.json();
        setStats([
          { label: "Total Users", value: String(Array.isArray(users) ? users.length : 0), change: "+12% this month", color: "#4c1d95" },
          { label: "Total Wardrobe Items", value: "0", change: "+8% this month", color: "#9d174d" },
          { label: "Total Outfits Created", value: "0", change: "+18% this month", color: "#065f46" },
          { label: "Total Categories", value: String(Array.isArray(categories) ? categories.length : 0), change: "Active", color: "#9a3412" },
        ]);
      } catch (e) { console.log("Analytics API failed"); }
    }
    loadAnalytics();
  }, []);

  return (
    <div style={{ padding: "24px", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Analytics</h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0 0 0" }}>Overview of your wardrobe platform</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["This Week", "This Month", "This Year"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", background: filter === f ? "#000" : "#f3f4f6", color: filter === f ? "#fff" : "#4b5563" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - 4 Cards Side by Side */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{s.label}</p>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", margin: "8px 0 0 0", color: s.color }}>{s.value}</h2>
            <p style={{ fontSize: "12px", color: "green", margin: "6px 0 0 0" }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>Weekly Activity - {filter}</h3>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "6px 0 20px 0" }}>User activity over the last 7 days</p>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "180px", gap: "16px" }}>
          {chartData.map((d) => (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "100%", background: "#4c1d95", borderRadius: "8px 8px 0 0", height: `${d.value}px` }} />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}