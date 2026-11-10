"use client";
import { useState } from "react";

export default function AnalyticsPage() {
  const [filter, setFilter] = useState("This Week");

  const stats = [
    { label: "Total Users", value: "1,248", change: "+12% this month", color: "#4c1d95" },
    { label: "Total Wardrobe Items", value: "8,542", change: "+8% this month", color: "#9d174d" },
    { label: "Total Outfits Created", value: "3,210", change: "+18% this month", color: "#065f46" },
    { label: "Total Categories", value: "7", change: "Active", color: "#9a3412" },
  ];

  const chartData = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 85 },
    { day: "Wed", value: 45 },
    { day: "Thu", value: 95 },
    { day: "Fri", value: 70 },
    { day: "Sat", value: 120 },
    { day: "Sun", value: 90 },
  ];

  const activities = [
    { user: "Priya S.", action: "Added 3 new items", time: "2 min ago", type: "Wardrobe" },
    { user: "Rahul K.", action: "Created Casual Outfit", time: "15 min ago", type: "Outfit" },
    { user: "Ananya M.", action: "Added Winter Jacket", time: "1 hour ago", type: "Wardrobe" },
    { user: "Vikram R.", action: "Created Party Outfit", time: "2 hours ago", type: "Outfit" },
    { user: "Sneha P.", action: "Added Summer Dress", time: "3 hours ago", type: "Wardrobe" },
  ];

  return (
    <div style={{ padding: "24px", background: "#ffffff", minHeight: "100vh", fontFamily: "Arial", color: "#000000" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: "900", margin: 0, color: "#000000" }}>Analytics Dashboard</h1>
          <p style={{ color: "#111111", fontWeight: "700", fontSize: "15px" }}>Track users, wardrobe & outfit activity</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: "8px", border: "2px solid #000", fontWeight: "bold", color: "#000", background: "white" }}>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "20px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "white", padding: "20px", borderRadius: "12px", border: "2px solid #000000", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
            <p style={{ color: "#000000", margin: 0, fontSize: "15px", fontWeight: "800" }}>{s.label}</p>
            <h2 style={{ fontSize: "34px", margin: "8px 0", color: "#000000", fontWeight: "900" }}>{s.value}</h2>
            <p style={{ color: s.color, margin: 0, fontSize: "14px", fontWeight: "900" }}>{s.change} • {filter}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginTop: "20px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "2px solid #000" }}>
          <h3 style={{ color: "#000", fontWeight: "900", fontSize: "18px", margin: 0 }}>Wardrobe Activity - {filter}</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "200px", marginTop: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
            {chartData.map((d) => (
              <div key={d.day} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ background: "#4c1d95", height: `${d.value}px`, borderRadius: "8px 8px 0 0", margin: "0 auto", maxWidth: "45px" }}></div>
                <p style={{ fontSize: "13px", marginTop: "8px", color: "#000", fontWeight: "800" }}>{d.day}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "#000", fontSize: "14px", fontWeight: "700" }}>Items added per day</p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "2px solid #000" }}>
          <h3 style={{ color: "#000", fontWeight: "900", fontSize: "18px", margin: 0 }}>Recent Activity Report</h3>
          {activities.map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #000" }}>
              <div>
                <p style={{ margin: 0, fontWeight: "900", fontSize: "15px", color: "#000" }}>{a.user}</p>
                <p style={{ margin: 0, color: "#111", fontSize: "14px", fontWeight: "700" }}>{a.action}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: a.type === "Outfit" ? "#000000" : "#4c1d95", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "800" }}>{a.type}</span>
                <p style={{ margin: "5px 0 0", color: "#000", fontSize: "12px", fontWeight: "700" }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginTop: "20px", border: "2px solid #000" }}>
        <h3 style={{ color: "#000", fontWeight: "900", fontSize: "18px", margin: 0 }}>User & Wardrobe Report</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", color: "#000" }}>
          <thead><tr style={{ background: "#000000", color: "white", textAlign: "left" }}><th style={{ padding: "12px" }}>User</th><th style={{ padding: "12px" }}>Items</th><th style={{ padding: "12px" }}>Outfits</th><th style={{ padding: "12px" }}>Status</th></tr></thead>
          <tbody style={{ fontWeight: "700" }}>
            <tr style={{ borderBottom: "1px solid #000" }}><td style={{ padding: "12px" }}>Priya S.</td><td style={{ padding: "12px" }}>42</td><td style={{ padding: "12px" }}>15</td><td style={{ padding: "12px", color: "#065f46" }}>● Active</td></tr>
            <tr style={{ borderBottom: "1px solid #000" }}><td style={{ padding: "12px" }}>Rahul K.</td><td style={{ padding: "12px" }}>28</td><td style={{ padding: "12px" }}>9</td><td style={{ padding: "12px", color: "#065f46" }}>● Active</td></tr>
            <tr><td style={{ padding: "12px" }}>Ananya M.</td><td style={{ padding: "12px" }}>65</td><td style={{ padding: "12px" }}>22</td><td style={{ padding: "12px", color: "#9a3412" }}>● New</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}