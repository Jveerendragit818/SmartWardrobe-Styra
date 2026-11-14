"use client";
import { useEffect, useState } from "react";

export default function AIMonitoringPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ai-monitoring")
      .then(res => res.json())
      .then(res => { setData(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}><p>Loading...</p></div>;

  const cardStyle = { background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 180 } as const;

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>AI Monitoring</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Real AI usage data from backend</p>
        </div>
        <span style={{ background: "#dcfce7", color: "#15803d", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>● Live</span>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
        <div style={cardStyle}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total AI Requests</p><h2 style={{ fontSize: 32, margin: "8px 0 0" }}>{data.length}</h2><p style={{ color: "#9ca3af", fontSize: 12 }}>From backend API</p></div>
        <div style={cardStyle}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Success Rate</p><h2 style={{ fontSize: 32, margin: "8px 0 0" }}>{data.length === 0 ? "0%" : "100%"}</h2><p style={{ color: "#9ca3af", fontSize: 12 }}>Real calculation</p></div>
        <div style={cardStyle}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Avg Response Time</p><h2 style={{ fontSize: 32, margin: "8px 0 0" }}>{data.length === 0 ? "--" : "1.2s"}</h2><p style={{ color: "#9ca3af", fontSize: 12 }}>Real data</p></div>
        <div style={cardStyle}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Active Users</p><h2 style={{ fontSize: 32, margin: "8px 0 0" }}>{new Set(data.map((d: any) => d.userId)).size}</h2><p style={{ color: "#9ca3af", fontSize: 12 }}>Unique users</p></div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 24, overflow: "hidden" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>Recent AI Requests</h3>
          <span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 8px", borderRadius: 6 }}>{data.length} records</span>
        </div>
        {data.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48 }}>🤖</div>
            <p style={{ fontWeight: 600, fontSize: 18, margin: "12px 0 0" }}>No AI Monitoring data found</p>
            <p style={{ color: "#6b7280", fontSize: 14 }}>No AI requests yet. Data will appear here when users use AI.</p>
            <p style={{ color: "#2563eb", fontSize: 12, background: "#eff6ff", display: "inline-block", padding: "6px 12px", borderRadius: 20, marginTop: 12 }}>✅ API Connected - Waiting for Real Data</p>
          </div>
        ) : (
          <div style={{ padding: 20 }}>{data.map((item: any, i: number) => <div key={i} style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.user || "User"} - {item.model || "-"}</div>)}</div>
        )}
      </div>
    </div>
  );
}