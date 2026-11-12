// Day 9 - M2 - Admin Reports with API
"use client";
import { useState, useEffect } from "react";
import { getAdminReports } from "@/app/lib/api";

export default function ReportsPage() {
  const [filter, setFilter] = useState("All");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminReports()
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load reports. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "20px", color: "black" }}>Loading reports...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

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