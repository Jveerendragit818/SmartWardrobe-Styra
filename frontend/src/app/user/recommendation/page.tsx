
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Shirt,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

type Outfit = {
  id: number;
  name: string;
  occasion: string;
  season: string;
  description: string;
  image: string;
};

const outfits: Outfit[] = [
  {
    id: 1,
    name: "Casual Day Out",
    occasion: "Casual",
    season: "Summer",
    description: "White shirt, blue jeans and sneakers",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
  },
  {
    id: 2,
    name: "Office Ready",
    occasion: "Office",
    season: "All Seasons",
    description: "Formal shirt, trousers and blazer",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  },
  {
    id: 3,
    name: "Party Look",
    occasion: "Party",
    season: "Winter",
    description: "Stylish dress with matching accessories",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
  },
  {
    id: 4,
    name: "Festival Style",
    occasion: "Festival",
    season: "Summer",
    description: "Traditional outfit with accessories",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
  },
  {
    id: 5,
    name: "Wedding Elegance",
    occasion: "Wedding",
    season: "Winter",
    description: "Elegant formal outfit for celebrations",
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800",
  },
  {
    id: 6,
    name: "Rainy Day Comfort",
    occasion: "Casual",
    season: "Rainy",
    description: "Comfortable layers and weather-ready shoes",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  },
];

const occasions = [
  "All",
  "Casual",
  "Office",
  "Party",
  "Festival",
  "Wedding",
];

const seasons = [
  "All",
  "Summer",
  "Winter",
  "Rainy",
  "All Seasons",
];

export default function RecommendationPage() {
  const [selectedOccasion, setSelectedOccasion] =
    useState("All");

  const [selectedSeason, setSelectedSeason] =
    useState("All");

  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredOutfits = outfits.filter((outfit) => {
    const matchesOccasion =
      selectedOccasion === "All" ||
      outfit.occasion === selectedOccasion;

    const matchesSeason =
      selectedSeason === "All" ||
      outfit.season === selectedSeason ||
      outfit.season === "All Seasons";

    return matchesOccasion && matchesSeason;
  });

  function toggleFavorite(id: number) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  }

  function resetFilters() {
    setSelectedOccasion("All");
    setSelectedSeason("All");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#172A4B] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#172A4B]">
              <Sparkles className="text-[#8170C4]" />
              Outfit Recommendations
            </h1>

            <p className="mt-2 text-gray-600">
              Discover outfit ideas for every occasion and season.
            </p>
          </div>

          <Link
            href="/user/wardrobe"
            className="inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white transition hover:bg-[#283F65]"
          >
            <Shirt size={18} />
            My Wardrobe
          </Link>
        </div>

        {/* Filters */}
        <section className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#172A4B]">
            <SlidersHorizontal size={20} />
            Filter Outfits
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="occasion"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Occasion
              </label>

              <select
                id="occasion"
                value={selectedOccasion}
                onChange={(event) =>
                  setSelectedOccasion(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#172A4B] focus:border-[#8170C4] focus:outline-none"
              >
                {occasions.map((occasion) => (
                  <option key={occasion} value={occasion}>
                    {occasion === "All"
                      ? "All Occasions"
                      : occasion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="season"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Season
              </label>

              <select
                id="season"
                value={selectedSeason}
                onChange={(event) =>
                  setSelectedSeason(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#172A4B] focus:border-[#8170C4] focus:outline-none"
              >
                {seasons.map((season) => (
                  <option key={season} value={season}>
                    {season === "All"
                      ? "All Seasons (Filter)"
                      : season}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {filteredOutfits.length} of{" "}
              {outfits.length} outfit ideas
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg bg-[#EEE9FA] px-4 py-2 text-sm font-medium text-[#172A4B] hover:bg-[#DDD4F3]"
            >
              Reset Filters
            </button>
          </div>
        </section>

        {/* Outfit Cards */}
        <section>
          <h2 className="mb-5 text-2xl font-semibold text-[#172A4B]">
            Recommended Outfits
          </h2>

          {filteredOutfits.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <Shirt
                size={42}
                className="mx-auto mb-4 text-[#8170C4]"
              />

              <h3 className="text-lg font-semibold text-[#172A4B]">
                No matching outfits
              </h3>

              <p className="mt-2 text-gray-500">
                Try changing the occasion or season filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-lg bg-[#172A4B] px-5 py-2 text-white hover:bg-[#283F65]"
              >
                Show All Outfits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOutfits.map((outfit) => {
                const isFavorite = favorites.includes(outfit.id);

                return (
                  <article
                    key={outfit.id}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative h-56 bg-[#EEE9FA]">
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => toggleFavorite(outfit.id)}
                        aria-label={
                          isFavorite
                            ? `Remove ${outfit.name} from favorites`
                            : `Add ${outfit.name} to favorites`
                        }
                        aria-pressed={isFavorite}
                        className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm"
                      >
                        <Heart
                          size={20}
                          className={
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-[#172A4B]"
                          }
                        />
                      </button>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#172A4B]">
                        {outfit.name}
                      </h3>

                      <p className="mt-2 text-sm text-gray-600">
                        {outfit.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#EEE9FA] px-3 py-1 text-xs font-medium text-[#172A4B]">
                          {outfit.occasion}
                        </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {outfit.season}
                        </span>
                      </div>

                      <p className="mt-4 text-xs text-gray-500">
                        Sample outfit recommendation
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
