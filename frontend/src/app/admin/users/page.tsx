// Day 7 - M2 - User Management - Fixed Colors
"use client";
import { useState } from "react";

const allUsers = [
  { id: 1, name: "Priya S.", email: "priya@gmail.com", outfits: 12, items: 45, status: "Active", joined: "10 Jan 2026" },
  { id: 2, name: "Rahul K.", email: "rahul@gmail.com", outfits: 8, items: 32, status: "Active", joined: "15 Jan 2026" },
  { id: 3, name: "Ananya M.", email: "ananya@gmail.com", outfits: 5, items: 20, status: "Blocked", joined: "20 Jan 2026" },
  { id: 4, name: "Vikram R.", email: "vikram@gmail.com", outfits: 15, items: 60, status: "Active", joined: "02 Feb 2026" },
  { id: 5, name: "Sneha P.", email: "sneha@gmail.com", outfits: 3, items: 10, status: "Inactive", joined: "05 Feb 2026" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "white" }}>
      <h1 style={{ color: "black" }}>User Management</h1>
      <p style={{ color: "black" }}>Manage users, search, filter and view details</p>

      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", flex: 1, borderRadius: "8px", border: "1px solid #ccc", background: "white", color: "black" }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "white", color: "black" }}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <p style={{ color: "black" }}>Total Users: {filtered.length}</p>

      <table style={{ width: "100%", background: "white", borderCollapse: "collapse", color: "black" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", color: "black" }}>
            <th style={{ padding: "12px", textAlign: "left", color: "black" }}>Name</th>
            <th style={{ padding: "12px", textAlign: "left", color: "black" }}>Email</th>
            <th style={{ padding: "12px", color: "black" }}>Outfits</th>
            <th style={{ padding: "12px", color: "black" }}>Status</th>
            <th style={{ padding: "12px", color: "black" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} style={{ borderTop: "1px solid #eee", color: "black" }}>
              <td style={{ padding: "12px", color: "black" }}>{u.name}</td>
              <td style={{ padding: "12px", color: "black" }}>{u.email}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "black" }}>{u.outfits}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "black" }}>
                <span style={{ padding: "4px 10px", borderRadius: "12px", color: "black", background: u.status === "Active" ? "#dcfce7" : u.status === "Blocked" ? "#fee2e2" : "#fef9c3" }}>
                  {u.status}
                </span>
              </td>
              <td style={{ padding: "12px", textAlign: "center" }}>
                <button onClick={() => setSelected(u)} style={{ padding: "6px 12px", background: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div style={{ marginTop: "20px", padding: "20px", background: "white", borderRadius: "12px", border: "1px solid #ddd", color: "black" }}>
          <h3 style={{ color: "black" }}>User Details - {selected.name}</h3>
          <p style={{ color: "black" }}><b>Email:</b> {selected.email}</p>
          <p style={{ color: "black" }}><b>Joined:</b> {selected.joined}</p>
          <p style={{ color: "black" }}><b>Wardrobe Items:</b> {selected.items}</p>
          <p style={{ color: "black" }}><b>Outfits Created:</b> {selected.outfits}</p>
          <p style={{ color: "black" }}><b>Account Status:</b> {selected.status}</p>
          <button onClick={() => setSelected(null)} style={{ marginTop: "10px", padding: "8px 14px", cursor: "pointer", background: "white", color: "black" }}>Close</button>
        </div>
      )}
    </div>
  );
}