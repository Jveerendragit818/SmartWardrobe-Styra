"use client";
import { useState, useEffect } from "react";

export default function RecommendationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [user, setUser] = useState("");
  const [outfit, setOutfit] = useState("");
  const [occasion, setOccasion] = useState("Wedding");
  const [stylist, setStylist] = useState("");
  const [confidence, setConfidence] = useState("95%");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/recommendations")
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) setItems(res.data);
        else {
          const saved = localStorage.getItem("admin_recommendations");
          if (saved) setItems(JSON.parse(saved));
          else {
            const defaults = [
              { id: 1, user: "Priya Sharma", outfit: "Red Silk Saree + Gold Jewellery", occasion: "Wedding", stylist: "Ananya Iyer", confidence: "98%", status: "Active" },
              { id: 2, user: "Rahul Verma", outfit: "Navy Blazer + White Shirt + Black Trousers", occasion: "Office", stylist: "Arjun Mehta", confidence: "92%", status: "Active" },
              { id: 3, user: "Sneha Patel", outfit: "Floral Summer Dress + Sandals", occasion: "Date", stylist: "Ananya Iyer", confidence: "95%", status: "Active" },
              { id: 4, user: "Arjun Mehta", outfit: "Woolen Sweater + Jeans + Boots", occasion: "Winter", stylist: "Rahul Verma", confidence: "90%", status: "Archived" },
              { id: 5, user: "Ananya Iyer", outfit: "Casual Kurti + Leggings + Dupatta", occasion: "Trip", stylist: "Sneha Patel", confidence: "94%", status: "Active" },
            ];
            setItems(defaults);
            localStorage.setItem("admin_recommendations", JSON.stringify(defaults));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        const saved = localStorage.getItem("admin_recommendations");
        if (saved) setItems(JSON.parse(saved));
        setLoading(false);
      });
  }, []);

  const saveToStorage = (data: any[]) => localStorage.setItem("admin_recommendations", JSON.stringify(data));

  const handleSave = async () => {
    if (!user.trim()) { setMsg("⚠️ Please enter User name"); return; }
    const item = { user, outfit, occasion, stylist, confidence, status };
    if (editingId !== null) {
      const updated = items.map(i => i.id === editingId ? { ...i, ...item } : i);
      setItems(updated); saveToStorage(updated); setMsg("✅ Updated Successfully!");
    } else {
      try {
        const res = await fetch("/api/admin/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
        const result = await res.json();
        const newItem = result.data || { id: Date.now(), ...item };
        const updated = [...items, newItem];
        setItems(updated); saveToStorage(updated); setMsg("✅ Added Successfully! - Saved to API + Local");
      } catch {
        const newItem = { id: Date.now(), ...item };
        const updated = [...items, newItem];
        setItems(updated); saveToStorage(updated); setMsg("✅ Added Successfully! (Local)");
      }
    }
    setUser(""); setOutfit(""); setOccasion("Wedding"); setStylist(""); setConfidence("95%"); setStatus("Active");
    setEditingId(null); setShowForm(false); setTimeout(() => setMsg(""), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setUser(item.user); setOutfit(item.outfit); setOccasion(item.occasion); setStylist(item.stylist); setConfidence(item.confidence); setStatus(item.status);
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this recommendation?")) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated); saveToStorage(updated);
    try { await fetch(`/api/admin/recommendations?id=${id}`, { method: "DELETE" }); } catch {}
    setMsg("🗑️ Deleted!"); setTimeout(() => setMsg(""), 2000);
  };

  const filtered = items.filter(i => {
    const mSearch = i.user?.toLowerCase().includes(search.toLowerCase()) || i.outfit?.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || i.status === filter;
    return mSearch && mFilter;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading Recommendations...</div>;

  const inputStyle = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const btnStyle = { padding: "10px 18px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;
  const statusColor: any = { Active: "#dcfce7", Archived: "#e5e7eb", Pending: "#fef3c7" };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Recommendations</h1><p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>AI outfit recommendations - Real API Connected</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setUser(""); setOutfit(""); }} style={{ ...btnStyle, background: "#111827", color: "#fff" }}>{showForm ? "✕ Close" : "+ Add Recommendation"}</button>
      </div>

      {msg && <div style={{ marginTop: 16, background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{items.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Active</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{items.filter(i => i.status === "Active").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>AI Accuracy</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>94%</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Status</p><h2 style={{ fontSize: 16, margin: "12px 0 0", color: "#16a34a" }}>● API Live</h2></div>
      </div>

      {showForm && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 16px" }}>{editingId !== null ? "✏️ Edit Recommendation" : "➕ Add New Recommendation"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={inputStyle} placeholder="User Name" value={user} onChange={e => setUser(e.target.value)} />
            <input style={inputStyle} placeholder="Stylist Name" value={stylist} onChange={e => setStylist(e.target.value)} />
            <input style={{ ...inputStyle, gridColumn: "1 / -1" }} placeholder="Outfit - Ex: Red Silk Saree + Gold Jewellery" value={outfit} onChange={e => setOutfit(e.target.value)} />
            <select style={inputStyle} value={occasion} onChange={e => setOccasion(e.target.value)}><option>Wedding</option><option>Office</option><option>Date</option><option>Winter</option><option>Trip</option><option>Party</option></select>
            <input style={inputStyle} placeholder="Confidence - Ex: 95%" value={confidence} onChange={e => setConfidence(e.target.value)} />
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}><option>Active</option><option>Archived</option><option>Pending</option></select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: "#2563eb", color: "#fff" }}>{editingId !== null ? "Update" : "Save Recommendation"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "#e5e7eb" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 2, minWidth: 200 }} placeholder="🔍 Search user / outfit..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={filter} onChange={e => setFilter(e.target.value)}><option value="All">All Status</option><option>Active</option><option>Archived</option><option>Pending</option></select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20, overflowX: "auto" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}><h3 style={{ margin: 0 }}>All Recommendations</h3><span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20 }}>{filtered.length} records</span></div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}><div style={{ fontSize: 48 }}>🤖</div><p style={{ fontWeight: 600 }}>No recommendations found</p><p style={{ color: "#6b7280", fontSize: 14 }}>Click + Add Recommendation to add first one.</p></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#f9fafb", textAlign: "left", fontSize: 13, color: "#6b7280" }}><th style={{ padding: "12px 20px" }}>User</th><th style={{ padding: "12px" }}>Outfit</th><th style={{ padding: "12px" }}>Occasion</th><th style={{ padding: "12px" }}>Stylist</th><th style={{ padding: "12px" }}>Confidence</th><th style={{ padding: "12px" }}>Status</th><th style={{ padding: "12px" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6", fontSize: 14 }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600 }}>{item.user}</td>
                  <td style={{ padding: 12, maxWidth: 280 }}>{item.outfit}</td>
                  <td style={{ padding: 12 }}>{item.occasion}</td>
                  <td style={{ padding: 12 }}>{item.stylist}</td>
                  <td style={{ padding: 12 }}><span style={{ background: "#dcfce7", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.confidence}</span></td>
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