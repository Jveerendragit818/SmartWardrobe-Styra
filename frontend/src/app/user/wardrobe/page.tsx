
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Shirt,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react";
// Sample clothing data
const clothingItems = [
  {
    id: 1,
    name: "White Shirt",
    category: "Tops",
    color: "White",
  },
  {
    id: 2,
    name: "Blue Jeans",
    category: "Bottoms",
    color: "Blue",
  },
  {
    id: 3,
    name: "Casual Dress",
    category: "Dresses",
    color: "Lavender",
  },
];

const categories = ["All", "Tops", "Bottoms", "Dresses"];

export default function WardrobePage() {
  // React hooks must be inside the component
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [items, setItems] = useState(clothingItems);

  // Delete a clothing item
  function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this clothing item?"
    );

    if (!confirmed) {
      return;
    }

    setItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );
  }

  // Filter clothing by category
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter(
          (item) => item.category === selectedCategory
        );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#172A4B]">
              My Wardrobe
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your clothing collection
            </p>
          </div>

             
<div className="flex flex-wrap items-center gap-3">
  <Link
    href="/user/wardrobe/add"
    className="inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65]"
  >
    <Plus size={20} />
    Add Clothing
  </Link>

  <Link
    href="/user/wardrobe/recognition"
    className="inline-flex items-center gap-2 rounded-lg bg-[#EEE9FA] px-5 py-3 font-medium text-[#172A4B] hover:bg-[#DDD4F3]"
  >
    <Sparkles size={20} />
    AI Recognition
  </Link>
</div>

        </div>

        {/* Clothing collection */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#172A4B]">
            My Clothing Collection
          </h2>

          {/* Category filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                aria-pressed={
                  selectedCategory === category
                }
                className={`rounded-lg px-5 py-2 transition ${
                  selectedCategory === category
                    ? "bg-[#172A4B] text-white"
                    : "bg-[#EEE9FA] text-[#172A4B] hover:bg-[#DDD4F3]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Clothing cards */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                {/* Clothing icon */}
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-[#EEE9FA]">
                  <Shirt
                    size={48}
                    className="text-[#8170C4]"
                  />
                </div>

                {/* Clothing details */}
                <h3 className="text-lg font-semibold text-[#172A4B]">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Category: {item.category}
                </p>

                <p className="text-sm text-gray-500">
                  Color: {item.color}
                </p>

                {/* Edit and Delete buttons */}
                <div className="mt-4 flex flex-wrap gap-3">

                  <Link
                    href={`/user/wardrobe/edit/${item.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#EEE9FA] px-4 py-2 text-[#172A4B] hover:bg-[#DDD4F3]"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Empty collection message */}
          {filteredItems.length === 0 && (
            <p className="mt-8 text-gray-500">
              No clothing items found.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
