// Day 8 - M2 - Admin Reports
"use client";
import { useState } from "react";

export default function ReportsPage() {
  const [filter, setFilter] = useState("All");

  const reports = [
    { id: 1, title: "Total Users", value: "125", change: "+12 this week", type: "Users" },
    { id: 2, title: "Total Outfits", value: "340", change: "+45 this week", type: "Outfits" },
    { id: 3, title: "AI Suggestions Used", value: "890", change: "+120 this week", type: "AI" },
    { id: 4, title: "Trip Plans Created", value: "56", change: "+8 this week", type: "Trips" },
  ];

  const filtered = filter === "All" ? reports : reports.filter((r) => r.type === filter);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "black" }}>
      <h1 style={{ color: "black" }}>Admin Reports</h1>
      <p style={{ color: "black" }}>View platform usage, growth and AI performance</p>

      <div style={{ margin: "20px 0" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "white", color: "black" }}>
          <option value="All">All Reports</option>
          <option value="Users">Users</option>
          <option value="Outfits">Outfits</option>
          <option value="AI">AI</option>
          <option value="Trips">Trips</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {filtered.map((r) => (
          <div key={r.id} style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #ddd", color: "black" }}>
            <p style={{ color: "black", margin: 0 }}>{r.title}</p>
            <h2 style={{ color: "black", fontSize: "32px", margin: "10px 0" }}>{r.value}</h2>
            <p style={{ color: "green", margin: 0 }}>{r.change}</p>
            <span style={{ padding: "4px 10px", borderRadius: "12px", background: "#e0e7ff", color: "black", fontSize: "12px" }}>{r.type}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #ddd", color: "black" }}>
        <h3 style={{ color: "black" }}>Summary</h3>
        <p style={{ color: "black" }}>• Most active feature: AI Outfit Suggestions</p>
        <p style={{ color: "black" }}>• Fastest growing: Trip Planner</p>
        <p style={{ color: "black" }}>• Total active users this month: 98 out of 125</p>
      </div>
    </div>
  );
}