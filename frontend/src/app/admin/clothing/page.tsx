"use client";
import { useState } from "react";

const initialClothes = [
  { id: 1, name: "White T-Shirt", category: "Top", color: "White", size: "M", image: "👕" },
  { id: 2, name: "Blue Denim Jeans", category: "Bottom", color: "Blue", size: "32", image: "👖" },
  { id: 3, name: "Black Jacket", category: "Outerwear", color: "Black", size: "L", image: "🧥" },
  { id: 4, name: "Red Dress", category: "Dress", color: "Red", size: "S", image: "👗" },
];

export default function AdminClothing() {
  const [clothes, setClothes] = useState(initialClothes);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", category: "Top", color: "", size: "" });

  const categories = ["All", "Top", "Bottom", "Dress", "Outerwear", "Shoes", "Accessories"];
  const filtered = clothes.filter((c) => (filter === "All" || c.category === filter) && c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!form.name) return alert("Enter name");
    if (editing) setClothes(clothes.map((c) => c.id === editing.id ? { ...c, ...form } : c));
    else setClothes([...clothes, { id: Date.now(), ...form, image: "👕" }]);
    setShowForm(false); setEditing(null);
    setForm({ name: "", category: "Top", color: "", size: "" });
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Clothing Management</h1><p className="text-slate-500 text-sm">Manage clothing items and categories - Admin</p></div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Clothing</button>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clothes..." className="w-full mt-4 p-3 border rounded-lg bg-white" />
      <div className="flex gap-2 mt-3 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm ${filter === cat ? "bg-blue-600 text-white" : "bg-white border"}`}>{cat}</button>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden mt-5">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left"><tr><th className="p-3">Item</th><th className="p-3">Category</th><th className="p-3 hidden md:table-cell">Color</th><th className="p-3 hidden md:table-cell">Size</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3 font-medium">{item.image} {item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3 hidden md:table-cell">{item.color}</td>
                <td className="p-3 hidden md:table-cell">{item.size}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} className="bg-slate-100 px-3 py-1 rounded">Edit</button>
                  <button onClick={() => setClothes(clothes.filter((c) => c.id !== item.id))} className="bg-red-50 text-red-600 px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-3">
            <h2 className="font-bold text-lg">{editing ? "Edit Clothing" : "Add Clothing"}</h2>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-2 border rounded"><option>Top</option><option>Bottom</option><option>Dress</option><option>Outerwear</option><option>Shoes</option><option>Accessories</option></select>
            <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full p-2 border rounded" />
            <input placeholder="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full p-2 border rounded" />
            <div className="flex gap-2"><button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded">Save</button><button onClick={() => setShowForm(false)} className="flex-1 bg-slate-100 py-2 rounded">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}