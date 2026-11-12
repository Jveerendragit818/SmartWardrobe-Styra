
// Day 9 - M2 - Admin Users with API
"use client";
import { useState, useEffect } from "react";
import { getAdminUsers } from "@/app/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: "20px", color: "black" }}>Loading users...</div>;

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "black" }}>
      <h1 style={{ color: "black" }}>Admin Users</h1>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "white", color: "black", margin: "15px 0" }} />
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #ddd", overflow: "hidden" }}>
        {filtered.map((u) => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #eee", color: "black" }}>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: "black" }}>{u.name}</p>
              <p style={{ margin: 0, color: "black" }}>{u.email}</p>
            </div>
            <span style={{ padding: "5px 12px", borderRadius: "12px", background: u.status === "Active" ? "#dcfce7" : "#fce7f3", color: "black", height: "fit-content" }}>{u.status}</span>
          </div>
        ))}
      </div>
      <p style={{ color: "black", marginTop: "10px" }}>Total: {filtered.length} users from API</p>
    </div>
  );
}