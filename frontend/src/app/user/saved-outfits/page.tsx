
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Trash2 } from "lucide-react";

type SavedOutfit = {
  id: number;
  name: string;
  occasion: string;
  season: string;
  description: string;
  image: string;
};

const sampleOutfits: SavedOutfit[] = [
  {
    id: 1,
    name: "Casual Day Out",
    occasion: "Casual",
    season: "Summer",
    description: "White shirt, blue jeans and sneakers",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
  },
  {
    id: 2,
    name: "Office Ready",
    occasion: "Office",
    season: "All Seasons",
    description: "Formal shirt, trousers and blazer",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  },
];

export default function SavedOutfitsPage() {
  const [outfits, setOutfits] = useState(sampleOutfits);

  function removeOutfit(id: number) {
    const confirmed = window.confirm("Remove this saved outfit?");
    if (!confirmed) return;

    setOutfits((previous) => previous.filter((outfit) => outfit.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-[#172A4B]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#172A4B]">
          <Bookmark className="text-[#8170C4]" />
          My Saved Outfits
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage your favorite outfit combinations.
        </p>

        {outfits.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <Bookmark size={42} className="mx-auto text-[#8170C4]" />
            <h2 className="mt-4 text-xl font-semibold text-[#172A4B]">
              No saved outfits
            </h2>
            <p className="mt-2 text-gray-500">
              Explore outfit recommendations to discover new looks.
            </p>
            <Link
              href="/user/recommendation"
              className="mt-5 inline-block rounded-lg bg-[#172A4B] px-5 py-3 text-white"
            >
              Explore Outfits
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outfits.map((outfit) => (
              <article
                key={outfit.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <img
                  src={outfit.image}
                  alt={outfit.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-[#172A4B]">
                    {outfit.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    {outfit.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#EEE9FA] px-3 py-1 text-xs text-[#172A4B]">
                      {outfit.occasion}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      {outfit.season}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeOutfit(outfit.id)}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Remove Outfit
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
