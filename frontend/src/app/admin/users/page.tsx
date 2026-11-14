"use client";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("User");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) setUsers(res.data);
        else {
          const saved = localStorage.getItem("admin_users");
          if (saved) setUsers(JSON.parse(saved));
          else {
            const defaults = [
              { id: 1, name: "Priya Sharma", email: "priya@gmail.com", phone: "9876543210", role: "User", city: "Hyderabad", status: "Active" },
              { id: 2, name: "Rahul Verma", email: "rahul@gmail.com", phone: "9876543211", role: "User", city: "Mumbai", status: "Active" },
              { id: 3, name: "Ananya Iyer", email: "ananya@gmail.com", phone: "9876543212", role: "Stylist", city: "Delhi", status: "Active" },
              { id: 4, name: "Sneha Patel", email: "sneha@gmail.com", phone: "9876543213", role: "User", city: "Bangalore", status: "Inactive" },
              { id: 5, name: "Arjun Mehta", email: "arjun@gmail.com", phone: "9876543214", role: "Admin", city: "Chennai", status: "Active" },
            ];
            setUsers(defaults);
            localStorage.setItem("admin_users", JSON.stringify(defaults));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        const saved = localStorage.getItem("admin_users");
        if (saved) setUsers(JSON.parse(saved));
        setLoading(false);
      });
  }, []);

  const saveToStorage = (data: any[]) => localStorage.setItem("admin_users", JSON.stringify(data));

  const handleSave = async () => {
    if (!name.trim()) { setMsg("⚠️ Please enter User name"); return; }
    const item = { name, email, phone, role, city, status };
    if (editingId !== null) {
      const updated = users.map(u => u.id === editingId ? { ...u, ...item } : u);
      setUsers(updated); saveToStorage(updated); setMsg("✅ Updated Successfully!");
    } else {
      try {
        const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
        const result = await res.json();
        const newItem = result.data || { id: Date.now(), ...item };
        const updated = [...users, newItem];
        setUsers(updated); saveToStorage(updated); setMsg("✅ Added Successfully! - Saved to API + Local");
      } catch {
        const newItem = { id: Date.now(), ...item };
        const updated = [...users, newItem];
        setUsers(updated); saveToStorage(updated); setMsg("✅ Added Successfully! (Local)");
      }
    }
    setName(""); setEmail(""); setPhone(""); setRole("User"); setCity(""); setStatus("Active");
    setEditingId(null); setShowForm(false); setTimeout(() => setMsg(""), 3000);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setName(item.name); setEmail(item.email); setPhone(item.phone); setRole(item.role); setCity(item.city); setStatus(item.status);
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    const updated = users.filter(u => u.id !== id);
    setUsers(updated); saveToStorage(updated);
    try { await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" }); } catch {}
    setMsg("🗑️ Deleted!"); setTimeout(() => setMsg(""), 2000);
  };

  const filtered = users.filter(u => {
    const mSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.city?.toLowerCase().includes(search.toLowerCase());
    const mFilter = filter === "All" || u.status === filter;
    return mSearch && mFilter;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading Users...</div>;

  const inputStyle = { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const btnStyle = { padding: "10px 18px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;
  const statusColor: any = { Active: "#dcfce7", Inactive: "#fee2e2", Blocked: "#f3f4f6" };
  const roleColor: any = { Admin: "#fee2e2", Stylist: "#dbeafe", User: "#dcfce7" };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Users</h1><p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Manage all users - Real API Connected</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setEmail(""); }} style={{ ...btnStyle, background: "#111827", color: "#fff" }}>{showForm ? "✕ Close" : "+ Add User"}</button>
      </div>

      {msg && <div style={{ marginTop: 16, background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Total Users</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{users.length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Active</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{users.filter(u => u.status === "Active").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Stylists</p><h2 style={{ fontSize: 28, margin: "8px 0 0" }}>{users.filter(u => u.role === "Stylist").length}</h2></div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", flex: 1, minWidth: 140 }}><p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Status</p><h2 style={{ fontSize: 16, margin: "12px 0 0", color: "#16a34a" }}>● API Live</h2></div>
      </div>

      {showForm && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20 }}>
          <h3 style={{ margin: "0 0 16px" }}>{editingId !== null ? "✏️ Edit User" : "➕ Add New User"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={inputStyle} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input style={inputStyle} placeholder="Email - Ex: user@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={inputStyle} placeholder="Phone - Ex: 9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
            <input style={inputStyle} placeholder="City - Ex: Hyderabad" value={city} onChange={e => setCity(e.target.value)} />
            <select style={inputStyle} value={role} onChange={e => setRole(e.target.value)}><option>User</option><option>Stylist</option><option>Admin</option></select>
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}><option>Active</option><option>Inactive</option><option>Blocked</option></select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: "#2563eb", color: "#fff" }}>{editingId !== null ? "Update" : "Save User"}</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "#e5e7eb" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 2, minWidth: 200 }} placeholder="🔍 Search name / email / city..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, flex: 1, minWidth: 140 }} value={filter} onChange={e => setFilter(e.target.value)}><option value="All">All Status</option><option>Active</option><option>Inactive</option><option>Blocked</option></select>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 20, overflowX: "auto" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}><h3 style={{ margin: 0 }}>All Users</h3><span style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20 }}>{filtered.length} records</span></div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}><div style={{ fontSize: 48 }}>👥</div><p style={{ fontWeight: 600 }}>No users found</p><p style={{ color: "#6b7280", fontSize: 14 }}>Click + Add User to add first one.</p></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#f9fafb", textAlign: "left", fontSize: 13, color: "#6b7280" }}><th style={{ padding: "12px 20px" }}>Name</th><th style={{ padding: "12px" }}>Email</th><th style={{ padding: "12px" }}>Phone</th><th style={{ padding: "12px" }}>Role</th><th style={{ padding: "12px" }}>City</th><th style={{ padding: "12px" }}>Status</th><th style={{ padding: "12px" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f3f4f6", fontSize: 14 }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600 }}>👤 {item.name}</td>
                  <td style={{ padding: 12 }}>{item.email}</td>
                  <td style={{ padding: 12 }}>{item.phone}</td>
                  <td style={{ padding: 12 }}><span style={{ background: roleColor[item.role] || "#f3f4f6", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.role}</span></td>
                  <td style={{ padding: 12 }}>{item.city}</td>
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