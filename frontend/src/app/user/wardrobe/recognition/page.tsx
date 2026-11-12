
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Shirt,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { apiRequest } from "@/lib/api";

// Clothing item returned by backend
type ClothingItem = {
  id: string;
  name: string | null;
  category: string | null;
  color: string | null;
  season: string | null;
  occasion: string[] | string;
  image_path: string | null;
};

// Recommended outfit
type RecommendedOutfit = {
  item_ids: string[];
  items: ClothingItem[];
  reason?: string;
  reasons?: string[];
  score?: number;
};

// API response
type RecommendationResponse = {
  data: {
    outfits: RecommendedOutfit[];
    message: string | null;
  } | null;
  error: string | null;
};

// Occasion options
const occasions = [
  { label: "College", value: "college" },
  { label: "Casual", value: "casual" },
  { label: "Office", value: "office" },
  { label: "Party", value: "party" },
  { label: "Festival", value: "festival" },
  { label: "Wedding", value: "wedding" },
];

export default function RecommendationPage() {

  const [occasion, setOccasion] =
    useState("college");

  const [limit, setLimit] =
    useState(5);

  const [outfits, setOutfits] =
    useState<RecommendedOutfit[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [generated, setGenerated] =
    useState(false);

  const [generatedOccasion, setGeneratedOccasion] =
    useState("");

  // Connect to recommendation API
  async function generateRecommendations() {

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");
    setOutfits([]);
    setGenerated(false);

    try {

      const response =
        await apiRequest<RecommendationResponse>(
          "/recommendations",
          {
            method: "POST",
            body: JSON.stringify({
              occasion: occasion,
              limit: limit,
              weather: null,
              recent_outfits: null,
            }),
          }
        );

      if (response.error) {
        throw new Error(response.error);
      }

      if (
        !response.data ||
        !Array.isArray(response.data.outfits)
      ) {
        throw new Error(
          "Invalid recommendation response."
        );
      }

      setOutfits(response.data.outfits);

      setMessage(
        response.data.message || ""
      );

      setGeneratedOccasion(occasion);

      setGenerated(true);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Unable to generate recommendations."
      );

    } finally {

      setLoading(false);

    }
  }

  // Reset recommendation filters
  function resetFilters() {

    setOccasion("college");
    setLimit(5);
    setOutfits([]);
    setMessage("");
    setError("");
    setGenerated(false);
    setGeneratedOccasion("");

  }

  return (

    <main className="min-h-screen bg-gray-50 p-6 text-[#172A4B]">

      <div className="mx-auto max-w-7xl">

        {/* Back navigation */}
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Page heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="flex items-center gap-3 text-3xl font-bold">

              <Sparkles
                className="text-[#8170C4]"
              />

              Outfit Recommendations

            </h1>

            <p className="mt-2 text-gray-600">
              Discover personalized outfits from
              your digital wardrobe.
            </p>

          </div>

          <Link
            href="/user/wardrobe"
            className="inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65]"
          >

            <Shirt size={18} />

            My Wardrobe

          </Link>

        </div>

        {/* Recommendation filters */}
        <Card shadow="small">

          <h2 className="mb-5 text-xl font-semibold">
            Generate Your Outfit
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Occasion */}
            <div>

              <label
                htmlFor="occasion"
                className="mb-2 block text-sm font-medium"
              >
                Select Occasion
              </label>

              <select
                id="occasion"
                value={occasion}
                disabled={loading}
                onChange={(event) =>
                  setOccasion(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-[#8170C4] focus:outline-none"
              >

                {occasions.map((item) => (

                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>

                ))}

              </select>

            </div>

            {/* Number of outfits */}
            <div>

              <label
                htmlFor="limit"
                className="mb-2 block text-sm font-medium"
              >
                Number of Recommendations
              </label>

              <select
                id="limit"
                value={limit}
                disabled={loading}
                onChange={(event) =>
                  setLimit(Number(event.target.value))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-[#8170C4] focus:outline-none"
              >

                <option value={3}>
                  3 Outfits
                </option>

                <option value={5}>
                  5 Outfits
                </option>

                <option value={10}>
                  10 Outfits
                </option>

                <option value={20}>
                  20 Outfits
                </option>

              </select>

            </div>

          </div>

          {/* Generate and reset buttons */}
          <div className="mt-6 flex flex-wrap gap-3">

            <Button
              type="button"
              size="medium"
              onClick={generateRecommendations}
              disabled={loading}
            >

              <span className="inline-flex items-center gap-2">

                {loading ? (

                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                ) : (

                  <Sparkles size={18} />

                )}

                {loading
                  ? "Generating..."
                  : "Generate Recommendations"}

              </span>

            </Button>

            <Button
              type="button"
              variant="outline"
              size="medium"
              onClick={resetFilters}
              disabled={loading}
            >
              Reset
            </Button>

          </div>

        </Card>

        {/* Loading state */}
        {loading && (

          <div
            role="status"
            className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm"
          >

            <Loader2
              size={40}
              className="mx-auto mb-4 animate-spin text-[#8170C4]"
            />

            <h3 className="text-lg font-semibold">
              Generating your outfits...
            </h3>

            <p className="mt-2 text-gray-500">
              Finding suitable clothing combinations
              from your wardrobe.
            </p>

          </div>

        )}

        {/* Error state */}
        {error && (

          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-100 bg-red-50 p-5"
          >

            <div className="flex items-center gap-2 text-red-700">

              <AlertCircle size={20} />

              <h3 className="font-semibold">
                Unable to generate recommendations
              </h3>

            </div>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <div className="mt-4">

              <Button
                type="button"
                size="medium"
                onClick={generateRecommendations}
              >
                Try Again
              </Button>

            </div>

          </div>

        )}

        {/* Initial state */}
        {!generated && !loading && !error && (

          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">

            <Sparkles
              size={42}
              className="mx-auto mb-4 text-[#8170C4]"
            />

            <h3 className="text-lg font-semibold">
              Ready to discover your next outfit?
            </h3>

            <p className="mt-2 text-gray-500">
              Select an occasion and click Generate
              Recommendations to get started.
            </p>

          </div>

        )}

        {/* Empty recommendation state */}
        {generated &&
          !loading &&
          !error &&
          outfits.length === 0 && (

            <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">

              <Shirt
                size={42}
                className="mx-auto mb-4 text-[#8170C4]"
              />

              <h3 className="text-lg font-semibold">
                No outfits found
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-gray-500">

                {message ||
                  "Add more clothing items or try another occasion."}

              </p>

              <Link
                href="/user/wardrobe/add"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65]"
              >

                <Shirt size={18} />

                Add Clothing

              </Link>

            </div>

          )}

        {/* Real recommended outfits */}
        {generated &&
          !loading &&
          !error &&
          outfits.length > 0 && (

            <section className="mt-8">

              <div className="mb-5">

                <h2 className="text-2xl font-semibold">
                  Recommended Outfits
                </h2>

                <p className="mt-2 text-sm text-gray-500">

                  Showing {outfits.length} outfit
                  {outfits.length === 1 ? "" : "s"}
                  {" "}for {generatedOccasion}.

                </p>

              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {outfits.map((outfit, index) => (

                  <Card
                    key={`${outfit.item_ids.join("-")}-${index}`}
                    shadow="small"
                  >

                    {/* Outfit heading */}
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                      <h3 className="text-xl font-semibold">

                        Outfit {index + 1}

                      </h3>

                      <span className="rounded-full bg-[#EEE9FA] px-3 py-1 text-xs font-medium capitalize">

                        {generatedOccasion}

                      </span>

                    </div>

                    {/* Clothing items */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      {outfit.items.map((item) => (

                        <div
                          key={item.id}
                          className="overflow-hidden rounded-xl border border-gray-100"
                        >

                          {/* Clothing image */}
                          <div className="flex h-44 items-center justify-center bg-[#EEE9FA]">

                            {item.image_path &&
                            (
                              item.image_path.startsWith("https://") ||
                              item.image_path.startsWith("http://") ||
                              item.image_path.startsWith("data:image/") ||
                              item.image_path.startsWith("/")
                            ) ? (

                              <img
                                src={item.image_path}
                                alt={item.name || "Clothing item"}
                                className="h-full w-full object-contain"
                              />

                            ) : (

                              <Shirt
                                size={48}
                                className="text-[#8170C4]"
                              />

                            )}

                          </div>

                          {/* Clothing information */}
                          <div className="p-4">

                            <h4 className="font-semibold">

                              {item.name || "Clothing item"}

                            </h4>

                            <p className="mt-2 text-sm text-gray-500">

                              Category: {item.category || "Not specified"}

                            </p>

                            <p className="text-sm text-gray-500">

                              Color: {item.color || "Not specified"}

                            </p>

                            <p className="text-sm text-gray-500">

                              Season: {item.season || "Not specified"}

                            </p>

                          </div>

                        </div>

                      ))}

                    </div>

                    {/* Recommendation reason */}
                    {(outfit.reason ||
                      outfit.reasons?.length) ? (

                      <div className="mt-5 rounded-lg bg-[#F3F0FA] p-4">

                        <div className="mb-2 flex items-center gap-2">

                          <Sparkles
                            size={18}
                            className="text-[#8170C4]"
                          />

                          <h4 className="font-semibold">
                            Why this outfit?
                          </h4>

                        </div>

                        <p className="text-sm text-gray-600">

                          {outfit.reason ||
                            outfit.reasons?.join("; ")}

                        </p>

                      </div>

                    ) : null}

                    {/* Model score */}
                    {typeof outfit.score === "number" && (

                      <p className="mt-4 text-sm text-gray-500">

                        Recommendation score:{" "}
                        {outfit.score.toFixed(2)}

                      </p>

                    )}

                    <p className="mt-4 text-xs text-gray-500">
                      Recommended from your personal wardrobe.
                    </p>

                  </Card>

                ))}

              </div>

            </section>

          )}

      </div>

    </main>

  );
}

