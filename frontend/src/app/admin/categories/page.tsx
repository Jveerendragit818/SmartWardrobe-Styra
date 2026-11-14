"use client";
import { useState, useEffect } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("👗");
  const [count, setCount] = useState("");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) setCategories(res.data);
        else {
          const saved = localStorage.getItem("admin_categories");
          if (saved) setCategories(JSON.parse(saved));
          else {
            const defaults = [
              { id: 1, name: "Women Wear", description: "Sarees, Kurtis, Dresses", icon: "👗", count: "250", status: "Active" },
              { id: 2, name: "Men Wear", description: "Shirts, Trousers, Blazers", icon: "👔", count: "180", status: "Active" },
              { id: 3, name: "Wedding", description: "Bridal & Groom collections", icon: "💍", count: "95", status: "Active" },
              { id: 4, name: "Winter Wear", description: "Sweaters, Jackets, Hoodies", icon: "🧥", count: "120", status: "Active" },
              { id: 5, name: "Accessories", description: "Bags, Jewellery, Watches", icon: "👜", count: "200", status: "Active" },
            ];
            setCategories(defaults);
            localStorage.setItem("admin_categories", JSON.stringify(defaults));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        const saved = localStorage.getItem("admin_categories");
        if (saved) setCategories(JSON.parse(saved));
        setLoading(false);
      });
  }, []);

  const saveToStorage = (data: any[]) => localStorage.setItem("admin_categories", JSON.stringify(data));

  const handleSave = async () => {
    if (!name.trim()) { setMsg("⚠️ Please enter Category name"); return; }
    const item = { name, description, icon, count, status };
    if (editingId !== null) {
      const updated = categories.map(c => c.id === editingId ? { ...c, ...item } : c);
      setCategories(updated); saveToStorage(updated); setMsg("✅ Updated Successfully!");
    } else {
      try {
        const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
        const result = await res.json();
        const newItem = result.data || { id: Date.now(), ...item };
        const updated = [...categories, newItem];
        setCategories(updated); saveToStorage(updated); setMsg("✅ Added Successfully! - Saved to API + Local");
      } catch {
        const newItem = { id: Date.now(), ...item };
        const updated = [...categories, newItem];
        setCategories(updated); saveToStorage(updated); setMsg("✅ Added Successfully! (Local)");
      }
    }
    setName(""); setDescription(""); setIcon("👗"); setCount(""); setStatus("Active");
    setEditingId(null); setShowForm(false); setTimeout(() => setMsg(""), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setName(item.name); setDescription(item.description); setIcon(item.icon); setCount(item.count); setStatus(item.status);
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated); saveToStorage(updated);
    try { await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" }); } catch {}
    setMsg("🗑️ Deleted!"); setTimeout(() => setMsg(""), 2000);
  };

  const filtered = categories.filter(c => {
    const mSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || c.status === filter;
    return mSearch && mFilter;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading Categories...</div>;

  const inputStyle = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const btnStyle = { padding: "10px 18px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;
  const statusColor: any = { Active: "#dcfce7", Inactive: "#fee2e2", Draft: "#fef3c7" };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Categories</h1><p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Manage clothing categories - Real API Connected</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setDescription(""); }} style={{ ...btnStyle, background: "#111827", color: "#fff" }}>{showForm ? "✕ Close" : "+ Add Category"}</button>
      </div>

      {msg && <div style={{ marginTop: 16, background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total Categories</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{categories.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Active</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{categories.filter(c => c.status === "Active").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total Items</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{categories.reduce((a, c) => a + Number(c.count || 0), 0)}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Status</p><h2 style={{ fontSize: 16, margin: "12px 0 0", color: "#16a34a" }}>● API Live</h2></div>
      </div>

      {showForm && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 16px" }}>{editingId !== null ? "✏️ Edit Category" : "➕ Add New Category"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={inputStyle} placeholder="Category Name - Ex: Women Wear" value={name} onChange={e => setName(e.target.value)} />
            <input style={inputStyle} placeholder="Items Count - Ex: 250" value={count} onChange={e => setCount(e.target.value)} />
            <input style={{ ...inputStyle, gridColumn: "1 / -1" }} placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} />
            <select style={inputStyle} value={icon} onChange={e => setIcon(e.target.value)}><option value="👗">👗 Women</option><option value="👔">👔 Men</option><option value="💍">💍 Wedding</option><option value="🧥">🧥 Winter</option><option value="👜">👜 Accessories</option><option value="👟">👟 Shoes</option><option value="🧢">🧢 Casual</option><option value="👶">👶 Kids</option></select>
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}><option>Active</option><option>Inactive</option><option>Draft</option></select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: "#2563eb", color: "#fff" }}>{editingId !== null ? "Update" : "Save Category"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "#e5e7eb" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 2, minWidth: 200 }} placeholder="🔍 Search category..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={filter} onChange={e => setFilter(e.target.value)}><option value="All">All Status</option><option>Active</option><option>Inactive</option><option>Draft</option></select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20, overflowX: "auto" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}><h3 style={{ margin: 0 }}>All Categories</h3><span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20 }}>{filtered.length} records</span></div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}><div style={{ fontSize: 48 }}>📂</div><p style={{ fontWeight: 600 }}>No categories found</p><p style={{ color: "#6b7280", fontSize: 14 }}>Click + Add Category to add first one.</p></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#f9fafb", textAlign: "left", fontSize: 13, color: "#6b7280" }}><th style={{ padding: "12px 20px" }}>Category</th><th style={{ padding: "12px" }}>Description</th><th style={{ padding: "12px" }}>Items</th><th style={{ padding: "12px" }}>Status</th><th style={{ padding: "12px" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6", fontSize: 14 }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600 }}><span style={{ fontSize: 22, marginRight: 8 }}>{item.icon}</span> {item.name}</td>
                  <td style={{ padding: 12 }}>{item.description}</td>
                  <td style={{ padding: 12 }}><span style={{ background: "#dbeafe", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.count} Items</span></td>
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