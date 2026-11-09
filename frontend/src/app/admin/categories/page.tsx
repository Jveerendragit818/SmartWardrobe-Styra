"use client";
import { useState, useEffect } from "react";

type Category = {
  id: number;
  name: string;
  description: string;
  items: number;
};

const defaultCategories: Category[] = [
  { id: 1, name: "Men", description: "Men clothes", items: 12 },
  { id: 2, name: "Women", description: "Women clothes", items: 15 },
  { id: 3, name: "Kids", description: "Kids clothes", items: 8 },
  { id: 4, name: "Shoes", description: "Shoes collection", items: 10 },
  { id: 5, name: "Bags", description: "Bags collection", items: 5 },
  { id: 6, name: "Accessories", description: "Accessories", items: 0 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // 1. LOAD saved categories on first open
  useEffect(() => {
    const saved = localStorage.getItem("categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // 2. SAVE every time categories change - THIS MAKES IT STAY
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories, loaded]);

  const handleSave = () => {
    if (!name.trim()) return alert("Enter Category Name");
    if (editId) {
      // EDIT
      setCategories(categories.map((c) =>
        c.id === editId ? { ...c, name, description } : c
      ));
    } else {
      // ADD
      const newCat: Category = {
        id: Date.now(),
        name,
        description,
        items: 0,
      };
      setCategories([...categories, newCat]);
    }
    setName("");
    setDescription("");
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  if (!loaded) return <div style={{ padding: 20 }}>Loading...</div>;

  const totalItems = categories.reduce((sum, c) => sum + c.items, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Category Management</h1>

      {/* STATISTICS */}
      <div style={{ display: "flex", gap: 15, margin: "20px 0" }}>
        <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 8 }}>
          <b>Total Categories</b><br />{categories.length}
        </div>
        <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 8 }}>
          <b>Total Items</b><br />{totalItems}
        </div>
      </div>

      <button onClick={() => { setShowForm(!showForm); setEditId(null); setName(""); setDescription(""); }}>
        + Add Category
      </button>

      {showForm && (
        <div style={{ border: "1px solid #ddd", padding: 15, marginTop: 15, borderRadius: 8 }}>
          <h3>{editId ? "Edit Category" : "Add Category"}</h3>
          <input
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "100%" }}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "100%" }}
          />
          <button onClick={handleSave} style={{ background: "green", color: "white", padding: "8px 15px", marginRight: 10 }}>Save</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {/* LIST */}
      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Name</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Description</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Items</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>{c.name}</td>
              <td style={{ borderBottom: "1px solid #eee" }}>{c.description}</td>
              <td style={{ borderBottom: "1px solid #eee" }}>{c.items} items</td>
              <td style={{ borderBottom: "1px solid #eee" }}>
                <button onClick={() => handleEdit(c)} style={{ marginRight: 10 }}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}  