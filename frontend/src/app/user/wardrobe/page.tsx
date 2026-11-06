
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Shirt } from "lucide-react";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";

const categories = [
  "All",
  "Tops",
  "Shirts",
  "T-Shirts",
  "Denims",
  "Bottoms",
  "Dresses",
  "Ethnic Wear",
  "Active Wear",
  "Footwear",
  "Accessories",
];

export default function WardrobePage() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#17233F]">
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* Page heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              My Digital Wardrobe
            </h1>
            <p className="mt-3 text-gray-600">
              Organize and explore your clothing collection.
            </p>
          </div>

          <Link href="/user/wardrobe/add">
            <Button size="medium">
              <span className="inline-flex items-center gap-2">
                <Plus size={18} />
                Add Clothing
              </span>
            </Button>
          </Link>
        </div>

        {/* Category filters */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">
            Categories
          </h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#17233F] text-white"
                    : "border border-gray-200 bg-white text-[#17233F] hover:bg-[#E9E2F5]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Wardrobe content */}
        <Card shadow="small">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-5 rounded-full bg-[#E9E2F5] p-5">
              <Shirt
                size={40}
                className="text-[#77649B]"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-xl font-semibold">
              No clothing items yet
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
              {selectedCategory === "All"
                ? "Your wardrobe is currently empty. Start adding your clothes to organize your collection."
                : `No items found in ${selectedCategory}. Add clothing to start building this category.`}
            </p>

            <div className="mt-6">
              <Link href="/user/wardrobe/add">
                <Button size="medium">
                  Add Your First Item
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
