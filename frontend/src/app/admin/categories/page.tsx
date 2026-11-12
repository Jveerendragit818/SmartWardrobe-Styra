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

// Day 9 - Connect Categories API
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
        setLoading(false);
      })
      .catch(() => {
        // If API fails, keep defaultCategories
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20, background: "#fff", minHeight: "100vh", color: "#000" }}>
        <h1 style={{ color: "#000" }}>Categories</h1>
        <p style={{ color: "#000" }}>Loading categories...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, background: "#fff", minHeight: "100vh", color: "#000" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#000" }}>
        Categories
      </h1>
      <p style={{ color: "#333", marginBottom: 20 }}>
        Total: {categories.length} categories
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              background: "#ffffff",
              color: "#000",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: "bold", color: "#000", margin: 0 }}>
              {cat.name}
            </h3>
            <p style={{ color: "#555", margin: "8px 0" }}>{cat.description}</p>
            <span
              style={{
                background: "#e0e0e0",
                color: "#000",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 13,
                display: "inline-block",
              }}
            >
              {cat.items} items
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}