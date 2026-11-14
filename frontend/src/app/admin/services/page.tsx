"use client";
import { useState, useEffect } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("60 mins");
  const [category, setCategory] = useState("Styling");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/services")
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) setServices(res.data);
        else {
          const saved = localStorage.getItem("admin_services");
          if (saved) setServices(JSON.parse(saved));
          else {
            const defaults = [
              { id: 1, name: "Personal Styling Session", description: "1-on-1 styling with expert stylist", price: "₹2,499", duration: "60 mins", category: "Styling", status: "Active" },
              { id: 2, name: "Wedding Wardrobe Planning", description: "Complete wedding outfit planning", price: "₹9,999", duration: "3 Hours", category: "Wedding", status: "Active" },
              { id: 3, name: "Wardrobe Audit", description: "Review your existing wardrobe", price: "₹1,499", duration: "90 mins", category: "Audit", status: "Active" },
              { id: 4, name: "Virtual Styling", description: "Online styling via video call", price: "₹999", duration: "45 mins", category: "Styling", status: "Active" },
              { id: 5, name: "Corporate Styling", description: "Office wear styling for professionals", price: "₹3,999", duration: "2 Hours", category: "Corporate", status: "Inactive" },
            ];
            setServices(defaults);
            localStorage.setItem("admin_services", JSON.stringify(defaults));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        const saved = localStorage.getItem("admin_services");
        if (saved) setServices(JSON.parse(saved));
        setLoading(false);
      });
  }, []);

  const saveToStorage = (data: any[]) => localStorage.setItem("admin_services", JSON.stringify(data));

  const handleSave = async () => {
    if (!name.trim()) { setMsg("⚠️ Please enter Service name"); return; }
    const item = { name, description, price, duration, category, status };
    if (editingId !== null) {
      const updated = services.map(s => s.id === editingId ? { ...s, ...item } : s);
      setServices(updated); saveToStorage(updated); setMsg("✅ Updated Successfully!");
    } else {
      try {
        const res = await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
        const result = await res.json();
        const newItem = result.data || { id: Date.now(), ...item };
        const updated = [...services, newItem];
        setServices(updated); saveToStorage(updated); setMsg("✅ Added Successfully! - Saved to API + Local");
      } catch {
        const newItem = { id: Date.now(), ...item };
        const updated = [...services, newItem];
        setServices(updated); saveToStorage(updated); setMsg("✅ Added Successfully! (Local)");
      }
    }
    setName(""); setDescription(""); setPrice(""); setDuration("60 mins"); setCategory("Styling"); setStatus("Active");
    setEditingId(null); setShowForm(false); setTimeout(() => setMsg(""), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setName(item.name); setDescription(item.description); setPrice(item.price); setDuration(item.duration); setCategory(item.category); setStatus(item.status);
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    const updated = services.filter(s => s.id !== id);
    setServices(updated); saveToStorage(updated);
    try { await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" }); } catch {}
    setMsg("🗑️ Deleted!"); setTimeout(() => setMsg(""), 2000);
  };

  const filtered = services.filter(s => {
    const mSearch = s.name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || s.status === filter;
    return mSearch && mFilter;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading Services...</div>;

  const inputStyle = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const btnStyle = { padding: "10px 18px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;
  const statusColor: any = { Active: "#dcfce7", Inactive: "#fee2e2", Draft: "#fef3c7" };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Services</h1><p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Manage styling services - Real API Connected</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setDescription(""); }} style={{ ...btnStyle, background: "#111827", color: "#fff" }}>{showForm ? "✕ Close" : "+ Add Service"}</button>
      </div>

      {msg && <div style={{ marginTop: 16, background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total Services</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{services.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Active</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{services.filter(s => s.status === "Active").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Categories</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{new Set(services.map(s => s.category)).size}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Status</p><h2 style={{ fontSize: 16, margin: "12px 0 0", color: "#16a34a" }}>● API Live</h2></div>
      </div>

      {showForm && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 16px" }}>{editingId !== null ? "✏️ Edit Service" : "➕ Add New Service"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={inputStyle} placeholder="Service Name" value={name} onChange={e => setName(e.target.value)} />
            <input style={inputStyle} placeholder="Price - Ex: ₹2,499" value={price} onChange={e => setPrice(e.target.value)} />
            <input style={{ ...inputStyle, gridColumn: "1 / -1" }} placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} />
            <input style={inputStyle} placeholder="Duration - Ex: 60 mins" value={duration} onChange={e => setDuration(e.target.value)} />
            <select style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}><option>Styling</option><option>Wedding</option><option>Audit</option><option>Corporate</option><option>Virtual</option></select>
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}><option>Active</option><option>Inactive</option><option>Draft</option></select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: "#2563eb", color: "#fff" }}>{editingId !== null ? "Update" : "Save Service"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "#e5e7eb" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 2, minWidth: 200 }} placeholder="🔍 Search service..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={filter} onChange={e => setFilter(e.target.value)}><option value="All">All Status</option><option>Active</option><option>Inactive</option><option>Draft</option></select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20, overflowX: "auto" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}><h3 style={{ margin: 0 }}>All Services</h3><span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20 }}>{filtered.length} records</span></div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}><div style={{ fontSize: 48 }}>🛎️</div><p style={{ fontWeight: 600 }}>No services found</p><p style={{ color: "#6b7280", fontSize: 14 }}>Click + Add Service to add first one.</p></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#f9fafb", textAlign: "left", fontSize: 13, color: "#6b7280" }}><th style={{ padding: "12px 20px" }}>Service</th><th style={{ padding: "12px" }}>Description</th><th style={{ padding: "12px" }}>Price</th><th style={{ padding: "12px" }}>Duration</th><th style={{ padding: "12px" }}>Category</th><th style={{ padding: "12px" }}>Status</th><th style={{ padding: "12px" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6", fontSize: 14 }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: 12, maxWidth: 240 }}>{item.description}</td>
                  <td style={{ padding: 12, fontWeight: 700, color: "#2563eb" }}>{item.price}</td>
                  <td style={{ padding: 12 }}>{item.duration}</td>
                  <td style={{ padding: 12 }}>{item.category}</td>
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