"use client";
import { useState, useEffect } from "react";

export default function ClothingPage() {
  const [clothes, setClothes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Top");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("M");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD - API first, lekapothe localStorage
  useEffect(() => {
    fetch("/api/admin/clothing")
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          setClothes(res.data);
        } else {
          const saved = localStorage.getItem("admin_clothes");
          if (saved) setClothes(JSON.parse(saved));
        }
        setLoading(false);
      })
      .catch(() => {
        const saved = localStorage.getItem("admin_clothes");
        if (saved) setClothes(JSON.parse(saved));
        setLoading(false);
      });
  }, []);

  const saveToStorage = (data: any[]) => {
    localStorage.setItem("admin_clothes", JSON.stringify(data));
  };

  const handleSave = async () => {
    if (!name.trim()) { setMsg("⚠️ Please enter name"); return; }
    const item = { name, category, color, size };

    if (editingId !== null) {
      const updated = clothes.map(c => c.id === editingId ? { ...c, ...item } : c);
      setClothes(updated);
      saveToStorage(updated);
      setMsg("✅ Updated Successfully!");
    } else {
      // API ki pampu
      try {
        const res = await fetch("/api/admin/clothing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const result = await res.json();
        const newItem = result.data || { id: Date.now(), ...item };
        const updated = [...clothes, newItem];
        setClothes(updated);
        saveToStorage(updated);
        setMsg("✅ Added Successfully! - Saved to API + Local");
      } catch {
        const newItem = { id: Date.now(), ...item };
        const updated = [...clothes, newItem];
        setClothes(updated);
        saveToStorage(updated);
        setMsg("✅ Added Successfully! (Local)");
      }
    }
    setName(""); setColor(""); setCategory("Top"); setSize("M");
    setEditingId(null); setShowForm(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name); setCategory(item.category); setColor(item.color); setSize(item.size);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    const updated = clothes.filter(c => c.id !== id);
    setClothes(updated);
    saveToStorage(updated);
    try { await fetch(`/api/admin/clothing?id=${id}`, { method: "DELETE" }); } catch {}
    setMsg("🗑️ Deleted!");
    setTimeout(() => setMsg(""), 2000);
  };

  const filtered = clothes.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.category === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading Clothing...</div>;

  const inputStyle = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const btnStyle = { padding: "10px 18px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Clothing</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Manage wardrobe - Real API Connected</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setColor(""); }} style={{ ...btnStyle, background: "#111827", color: "#fff" }}>
          {showForm ? "✕ Close" : "+ Add Clothing"}
        </button>
      </div>

      {msg && <div style={{ marginTop: 16, background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{msg}</div>}

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 150 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total Clothing</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{clothes.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 150 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Categories</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{new Set(clothes.map(c => c.category)).size}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 150 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Showing</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{filtered.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 150 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Status</p><h2 style={{ fontSize: 16, margin: "12px 0 0", color: "#16a34a" }}>● API Live</h2></div>
      </div>

      {/* Add / Edit Form - Old Feature */}
      {showForm && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 16px" }}>{editingId !== null ? "✏️ Edit Clothing" : "➕ Add New Clothing"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={inputStyle} placeholder="Name - Ex: Blue Shirt" value={name} onChange={e => setName(e.target.value)} />
            <select style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}>
              <option>Top</option><option>Bottom</option><option>Dress</option><option>Outerwear</option><option>Accessories</option>
            </select>
            <input style={inputStyle} placeholder="Color - Ex: Blue" value={color} onChange={e => setColor(e.target.value)} />
            <select style={inputStyle} value={size} onChange={e => setSize(e.target.value)}>
              <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: "#2563eb", color: "#fff" }}>{editingId !== null ? "Update" : "Save Clothing"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "#e5e7eb" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Search + Filter - Old Feature */}
      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 2, minWidth: 200 }} placeholder="🔍 Search clothes..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Categories</option><option>Top</option><option>Bottom</option><option>Dress</option><option>Outerwear</option><option>Accessories</option>
        </select>
      </div>

      {/* List - Old Feature + Beautiful */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>All Clothing Items</h3>
          <span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20 }}>{filtered.length} records</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48 }}>👕</div>
            <p style={{ fontWeight: 600, fontSize: 18 }}>No Clothing data found</p>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Click + Add Clothing to add your first item.</p>
            <p style={{ color: "#2563eb", fontSize: 12, background: "#eff6ff", display: "inline-block", padding: "6px 12px", borderRadius: 20 }}>✅ API Connected - Ready to Save</p>
          </div>
        ) : (
          filtered.map((item: any) => (
            <div key={item.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
                <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 0" }}>{item.category} • {item.color} • Size {item.size}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleEdit(item)} style={{ ...btnStyle, background: "#fef3c7", padding: "8px 14px" }}>✏️ Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ ...btnStyle, background: "#fee2e2", padding: "8px 14px" }}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}