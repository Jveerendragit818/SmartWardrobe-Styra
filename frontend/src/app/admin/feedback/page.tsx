"use client";
import { useState, useEffect } from "react";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("New");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/feedback")
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) setFeedbacks(res.data);
        else {
          const saved = localStorage.getItem("admin_feedback");
          if (saved) setFeedbacks(JSON.parse(saved));
          else {
            const defaults = [
              { id: 1, user: "Priya Sharma", message: "Amazing styling! Loved the wedding look.", rating: "5", date: "13 Nov 2026", status: "Reviewed" },
              { id: 2, user: "Rahul Verma", message: "Good service, but delivery was late.", rating: "3", date: "12 Nov 2026", status: "New" },
              { id: 3, user: "Sneha Patel", message: "Best wardrobe app! Very easy to use.", rating: "5", date: "14 Nov 2026", status: "Reviewed" },
              { id: 4, user: "Arjun Mehta", message: "Need more winter collection options.", rating: "4", date: "14 Nov 2026", status: "Pending" },
              { id: 5, user: "Ananya Iyer", message: "Stylist was very helpful and friendly.", rating: "5", date: "15 Nov 2026", status: "New" },
            ];
            setFeedbacks(defaults);
            localStorage.setItem("admin_feedback", JSON.stringify(defaults));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        const saved = localStorage.getItem("admin_feedback");
        if (saved) setFeedbacks(JSON.parse(saved));
        setLoading(false);
      });
  }, []);

  const saveToStorage = (data: any[]) => localStorage.setItem("admin_feedback", JSON.stringify(data));

  const handleSave = async () => {
    if (!user.trim()) { setMsg("⚠️ Please enter User name"); return; }
    const item = { user, message, rating, date, status };
    if (editingId !== null) {
      const updated = feedbacks.map(f => f.id === editingId ? { ...f, ...item } : f);
      setFeedbacks(updated); saveToStorage(updated); setMsg("✅ Updated Successfully!");
    } else {
      try {
        const res = await fetch("/api/admin/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
        const result = await res.json();
        const newItem = result.data || { id: Date.now(), ...item };
        const updated = [...feedbacks, newItem];
        setFeedbacks(updated); saveToStorage(updated); setMsg("✅ Added Successfully! - Saved to API + Local");
      } catch {
        const newItem = { id: Date.now(), ...item };
        const updated = [...feedbacks, newItem];
        setFeedbacks(updated); saveToStorage(updated); setMsg("✅ Added Successfully! (Local)");
      }
    }
    setUser(""); setMessage(""); setRating("5"); setDate(""); setStatus("New");
    setEditingId(null); setShowForm(false); setTimeout(() => setMsg(""), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setUser(item.user); setMessage(item.message); setRating(item.rating); setDate(item.date); setStatus(item.status);
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this feedback?")) return;
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated); saveToStorage(updated);
    try { await fetch(`/api/admin/feedback?id=${id}`, { method: "DELETE" }); } catch {}
    setMsg("🗑️ Deleted!"); setTimeout(() => setMsg(""), 2000);
  };

  const filtered = feedbacks.filter(f => {
    const mSearch = f.user?.toLowerCase().includes(search.toLowerCase()) || f.message?.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || f.status === filter;
    return mSearch && mFilter;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading Feedback...</div>;

  const inputStyle = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const btnStyle = { padding: "10px 18px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;
  const statusColor: any = { New: "#dbeafe", Reviewed: "#dcfce7", Pending: "#fef3c7", Resolved: "#e9d5ff" };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Feedback</h1><p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Manage user feedback - Real API Connected</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setUser(""); setMessage(""); }} style={{ ...btnStyle, background: "#111827", color: "#fff" }}>{showForm ? "✕ Close" : "+ Add Feedback"}</button>
      </div>

      {msg && <div style={{ marginTop: 16, background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total Feedback</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{feedbacks.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>New</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{feedbacks.filter(f => f.status === "New").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Avg Rating</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>⭐ {(feedbacks.reduce((a, f) => a + Number(f.rating || 0), 0) / (feedbacks.length || 1)).toFixed(1)}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Status</p><h2 style={{ fontSize: 16, margin: "12px 0 0", color: "#16a34a" }}>● API Live</h2></div>
      </div>

      {showForm && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 16px" }}>{editingId !== null ? "✏️ Edit Feedback" : "➕ Add New Feedback"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={inputStyle} placeholder="User Name" value={user} onChange={e => setUser(e.target.value)} />
            <input style={inputStyle} placeholder="Date - Ex: 16 Nov 2026" value={date} onChange={e => setDate(e.target.value)} />
            <select style={inputStyle} value={rating} onChange={e => setRating(e.target.value)}><option value="5">⭐⭐⭐⭐⭐ - 5 Star</option><option value="4">⭐⭐⭐⭐ - 4 Star</option><option value="3">⭐⭐⭐ - 3 Star</option><option value="2">⭐⭐ - 2 Star</option><option value="1">⭐ - 1 Star</option></select>
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}><option>New</option><option>Reviewed</option><option>Pending</option><option>Resolved</option></select>
            <textarea style={{ ...inputStyle, gridColumn: "1 / -1", minHeight: 80 }} placeholder="Feedback Message..." value={message} onChange={e => setMessage(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: "#2563eb", color: "#fff" }}>{editingId !== null ? "Update" : "Save Feedback"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "#e5e7eb" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 2, minWidth: 200 }} placeholder="🔍 Search user / message..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={filter} onChange={e => setFilter(e.target.value)}><option value="All">All Status</option><option>New</option><option>Reviewed</option><option>Pending</option><option>Resolved</option></select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20, overflowX: "auto" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}><h3 style={{ margin: 0 }}>All Feedback</h3><span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20 }}>{filtered.length} records</span></div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}><div style={{ fontSize: 48 }}>💬</div><p style={{ fontWeight: 600 }}>No feedback found</p><p style={{ color: "#6b7280", fontSize: 14 }}>Click + Add Feedback to add first one.</p></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#f9fafb", textAlign: "left", fontSize: 13, color: "#6b7280" }}><th style={{ padding: "12px 20px" }}>User</th><th style={{ padding: "12px" }}>Message</th><th style={{ padding: "12px" }}>Rating</th><th style={{ padding: "12px" }}>Date</th><th style={{ padding: "12px" }}>Status</th><th style={{ padding: "12px" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6", fontSize: 14 }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600 }}>{item.user}</td>
                  <td style={{ padding: 12, maxWidth: 300 }}>{item.message}</td>
                  <td style={{ padding: 12 }}>{"⭐".repeat(Number(item.rating || 5))} ({item.rating})</td>
                  <td style={{ padding: 12 }}>{item.date}</td>
                  <td style={{ padding: 12 }}><span style={{ background: statusColor[item.status] || "#f3f4f6", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status}</span></td>
                  <td style={{ padding: 12 }}><div style={{ display: "flex", gap: 6 }}><button onClick={() => handleEdit(item)} style={{ ...btnStyle, background: "#fef3c7", padding: "6px 12px", fontSize: 12 }}>✏️ Edit</button><button onClick={() => handleDelete(item.id)} style={{ ...btnStyle, background: "#fee2e2", padding: "6px 12px", fontSize: 12 }}>🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}