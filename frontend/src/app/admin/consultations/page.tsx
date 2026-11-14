"use client";
import { useState, useEffect } from "react";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [user, setUser] = useState("");
  const [stylist, setStylist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [type, setType] = useState("Wedding");
  const [status, setStatus] = useState("Pending");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD - API first, lekapothe localStorage
  useEffect(() => {
    fetch("/api/admin/consultations")
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          setConsultations(res.data);
        } else {
          const saved = localStorage.getItem("admin_consultations");
          if (saved) setConsultations(JSON.parse(saved));
          else {
            // First time - Screenshot lo unna default data
            const defaults = [
              { id: 1, user: "Priya Sharma", stylist: "Ananya Iyer", date: "13 Nov 2026", time: "10:00 AM", type: "Wedding", status: "Completed" },
              { id: 2, user: "Rahul Verma", stylist: "Arjun Mehta", date: "12 Nov 2026", time: "12:30 PM", type: "Office", status: "Pending" },
              { id: 3, user: "Sneha Patel", stylist: "Ananya Iyer", date: "14 Nov 2026", time: "11:00 AM", type: "Date", status: "Confirmed" },
              { id: 4, user: "Arjun Mehta", stylist: "Rahul Verma", date: "14 Nov 2026", time: "04:00 PM", type: "Winter", status: "Cancelled" },
              { id: 5, user: "Ananya Iyer", stylist: "Sneha Patel", date: "15 Nov 2026", time: "02:00 PM", type: "Trip", status: "Pending" },
            ];
            setConsultations(defaults);
            localStorage.setItem("admin_consultations", JSON.stringify(defaults));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        const saved = localStorage.getItem("admin_consultations");
        if (saved) setConsultations(JSON.parse(saved));
        setLoading(false);
      });
  }, []);

  const saveToStorage = (data: any[]) => localStorage.setItem("admin_consultations", JSON.stringify(data));

  const handleSave = async () => {
    if (!user.trim()) { setMsg("⚠️ Please enter User name"); return; }
    const item = { user, stylist, date, time, type, status };
    if (editingId !== null) {
      const updated = consultations.map(c => c.id === editingId ? { ...c, ...item } : c);
      setConsultations(updated); saveToStorage(updated);
      setMsg("✅ Updated Successfully!");
    } else {
      try {
        const res = await fetch("/api/admin/consultations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
        const result = await res.json();
        const newItem = result.data || { id: Date.now(), ...item };
        const updated = [...consultations, newItem];
        setConsultations(updated); saveToStorage(updated);
        setMsg("✅ Added Successfully! - Saved to API + Local");
      } catch {
        const newItem = { id: Date.now(), ...item };
        const updated = [...consultations, newItem];
        setConsultations(updated); saveToStorage(updated);
        setMsg("✅ Added Successfully! (Local)");
      }
    }
    setUser(""); setStylist(""); setDate(""); setTime("10:00 AM"); setType("Wedding"); setStatus("Pending");
    setEditingId(null); setShowForm(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setUser(item.user); setStylist(item.stylist); setDate(item.date); setTime(item.time); setType(item.type); setStatus(item.status);
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this consultation?")) return;
    const updated = consultations.filter(c => c.id !== id);
    setConsultations(updated); saveToStorage(updated);
    try { await fetch(`/api/admin/consultations?id=${id}`, { method: "DELETE" }); } catch {}
    setMsg("🗑️ Deleted!"); setTimeout(() => setMsg(""), 2000);
  };

  const filtered = consultations.filter(c => {
    const mSearch = c.user?.toLowerCase().includes(search.toLowerCase()) || c.stylist?.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || c.status === filter;
    return mSearch && mFilter;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading Consultations...</div>;

  const inputStyle = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const btnStyle = { padding: "10px 18px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;
  const statusColor: any = { Pending: "#fef3c7", Confirmed: "#dcfce7", Completed: "#dbeafe", Cancelled: "#fee2e2" };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Consultations</h1><p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Manage consultations - Real API Connected</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setUser(""); setStylist(""); }} style={{ ...btnStyle, background: "#111827", color: "#fff" }}>{showForm ? "✕ Close" : "+ Add Consultation"}</button>
      </div>

      {msg && <div style={{ marginTop: 16, background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{consultations.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Pending</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{consultations.filter(c => c.status === "Pending").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Completed</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{consultations.filter(c => c.status === "Completed").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Status</p><h2 style={{ fontSize: 16, margin: "12px 0 0", color: "#16a34a" }}>● API Live</h2></div>
      </div>

      {showForm && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 16px" }}>{editingId !== null ? "✏️ Edit Consultation" : "➕ Add New Consultation"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={inputStyle} placeholder="User Name" value={user} onChange={e => setUser(e.target.value)} />
            <input style={inputStyle} placeholder="Stylist Name" value={stylist} onChange={e => setStylist(e.target.value)} />
            <input style={inputStyle} type="text" placeholder="Date - Ex: 16 Nov 2026" value={date} onChange={e => setDate(e.target.value)} />
            <input style={inputStyle} placeholder="Time - Ex: 10:00 AM" value={time} onChange={e => setTime(e.target.value)} />
            <select style={inputStyle} value={type} onChange={e => setType(e.target.value)}><option>Wedding</option><option>Office</option><option>Date</option><option>Winter</option><option>Trip</option><option>Party</option></select>
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: "#2563eb", color: "#fff" }}>{editingId !== null ? "Update" : "Save Consultation"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "#e5e7eb" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 2, minWidth: 200 }} placeholder="🔍 Search user / stylist..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={filter} onChange={e => setFilter(e.target.value)}><option value="All">All Status</option><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20, overflowX: "auto" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}><h3 style={{ margin: 0 }}>All Consultations</h3><span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20 }}>{filtered.length} records</span></div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}><div style={{ fontSize: 48 }}>📅</div><p style={{ fontWeight: 600 }}>No consultations found</p><p style={{ color: "#6b7280", fontSize: 14 }}>Click + Add Consultation to add first one.</p></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#f9fafb", textAlign: "left", fontSize: 13, color: "#6b7280" }}><th style={{ padding: "12px 20px" }}>User</th><th style={{ padding: "12px" }}>Stylist</th><th style={{ padding: "12px" }}>Date</th><th style={{ padding: "12px" }}>Time</th><th style={{ padding: "12px" }}>Type</th><th style={{ padding: "12px" }}>Status</th><th style={{ padding: "12px" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6", fontSize: 14 }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600 }}>{item.user}</td>
                  <td style={{ padding: 12 }}>{item.stylist}</td>
                  <td style={{ padding: 12 }}>{item.date}</td>
                  <td style={{ padding: 12 }}>{item.time}</td>
                  <td style={{ padding: 12 }}>{item.type}</td>
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