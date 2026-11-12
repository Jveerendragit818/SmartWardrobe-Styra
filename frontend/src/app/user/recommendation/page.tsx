
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Shirt,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { apiRequest } from "@/lib/api";
import { getSupabase } from "@/lib/supabase";

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

// Recommendation API response
type RecommendationResponse = {
  data: {
    outfits: RecommendedOutfit[];
    message: string | null;
  } | null;
  error: string | null;
};

// Save outfit API response
type SaveOutfitResponse = {
  data: {
    id: string;
    title: string | null;
  } | null;
  error: string | null;
};

// Saved outfits API response
type SavedOutfitsResponse = {
  data: {
    id: string;
    title: string | null;
    items: ClothingItem[];
  }[];
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

// User-friendly category names
const categoryLabels: Record<string, string> = {
  tshirt: "T-Shirts",
  shirt: "Shirts",
  trousers: "Trousers",
  jeans: "Jeans",
  skirt: "Skirts",
  dress: "Dresses",
  jacket: "Jackets",
  shoes: "Footwear",
};

// User-friendly season names
const seasonLabels: Record<string, string> = {
  summer: "Summer",
  winter: "Winter",
  monsoon: "Rainy",
  all_season: "All Seasons",
};

// Format text
function formatText(value: string | null) {
  if (!value) return "Not specified";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

// Format category
function formatCategory(value: string | null) {
  if (!value) return "Not specified";

  return (
    categoryLabels[value.toLowerCase()] ||
    formatText(value)
  );
}

// Format season
function formatSeason(value: string | null) {
  if (!value) return "Not specified";

  return (
    seasonLabels[value.toLowerCase()] ||
    formatText(value)
  );
}

// Create a unique key for an outfit combination
function getOutfitKey(itemIds: string[]) {
  return [...new Set(itemIds)]
    .sort()
    .join("|");
}

// Display actual clothing image
function ClothingImage({
  imagePath,
  name,
}: {
  imagePath: string | null;
  name: string;
}) {
  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [imageLoading, setImageLoading] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadImage() {
      setImageUrl(null);

      if (!imagePath) {
        setImageLoading(false);
        return;
      }

      setImageLoading(true);

      try {
        // Handle direct image URLs
        if (
          imagePath.startsWith("https://") ||
          imagePath.startsWith("http://") ||
          imagePath.startsWith("data:image/") ||
          imagePath.startsWith("/")
        ) {
          if (active) {
            setImageUrl(imagePath);
          }

          return;
        }

        // Load image from Supabase storage
        const supabase = getSupabase();

        const { data, error } =
          await supabase.storage
            .from("wardrobe-images")
            .createSignedUrl(imagePath, 3600);

        if (error) {
          console.error(
            "Image loading error:",
            error.message
          );

          return;
        }

        if (active && data?.signedUrl) {
          setImageUrl(data.signedUrl);
        }

      } catch (error) {
        console.error(
          "Unable to load clothing image:",
          error
        );

      } finally {
        if (active) {
          setImageLoading(false);
        }
      }
    }

    void loadImage();

    return () => {
      active = false;
    };

  }, [imagePath]);

  return (
    <div className="flex h-44 items-center justify-center overflow-hidden bg-[#EEE9FA]">

      {imageLoading ? (
        <Loader2
          size={30}
          className="animate-spin text-[#8170C4]"
        />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-contain"
          onError={() => setImageUrl(null)}
        />
      ) : (
        <Shirt
          size={48}
          className="text-[#8170C4]"
        />
      )}

    </div>
  );
}

export default function RecommendationPage() {

  // Recommendation states
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

  const [
    generatedOccasion,
    setGeneratedOccasion,
  ] = useState("");

  // Save outfit states
  const [savingOutfit, setSavingOutfit] =
    useState<string | null>(null);

  const [savedOutfits, setSavedOutfits] =
    useState<string[]>([]);

  const [savedLoading, setSavedLoading] =
    useState(true);

  const [savedLoadError, setSavedLoadError] =
    useState("");

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveError, setSaveError] =
    useState("");

  const [activeSaveKey, setActiveSaveKey] =
    useState<string | null>(null);

  // Load already saved outfits
  async function loadSavedOutfits() {
    setSavedLoading(true);
    setSavedLoadError("");

    try {
      const response =
        await apiRequest<SavedOutfitsResponse>(
          "/saved-outfits"
        );

      if (response.error) {
        throw new Error(response.error);
      }

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Invalid saved outfits response."
        );
      }

      const keys = response.data
        .filter(
          (outfit) =>
            Array.isArray(outfit.items) &&
            outfit.items.length > 0
        )
        .map((outfit) =>
          getOutfitKey(
            outfit.items.map((item) => item.id)
          )
        );

      setSavedOutfits(
        Array.from(new Set(keys))
      );

    } catch (error) {
      setSavedLoadError(
        error instanceof Error
          ? error.message
          : "Unable to check saved outfits."
      );

    } finally {
      setSavedLoading(false);
    }
  }

  // Check saved outfits when page opens
  useEffect(() => {
    void loadSavedOutfits();
  }, []);

  // Generate recommendations using backend
  async function generateRecommendations() {
    if (loading || savingOutfit) return;

    setLoading(true);
    setError("");
    setMessage("");
    setOutfits([]);
    setGenerated(false);
    setSaveMessage("");
    setSaveError("");
    setActiveSaveKey(null);

    try {
      const response =
        await apiRequest<RecommendationResponse>(
          "/recommendations",
          {
            method: "POST",
            body: JSON.stringify({
              occasion,
              limit,
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

  // Save recommended outfit to database
  async function saveOutfit(
    outfit: RecommendedOutfit,
    index: number
  ) {
    const itemIds = Array.from(
      new Set(outfit.item_ids)
    );

    const outfitKey =
      getOutfitKey(itemIds);

    if (
      savingOutfit ||
      savedLoading ||
      savedLoadError ||
      savedOutfits.includes(outfitKey)
    ) {
      return;
    }

    setSaveMessage("");
    setSaveError("");
    setActiveSaveKey(outfitKey);

    if (
      itemIds.length === 0 ||
      itemIds.length > 20
    ) {
      setSaveError(
        "An outfit must contain between 1 and 20 clothing items."
      );

      return;
    }

    setSavingOutfit(outfitKey);

    try {
      const response =
        await apiRequest<SaveOutfitResponse>(
          "/saved-outfits",
          {
            method: "POST",
            body: JSON.stringify({
              title:
                `${formatText(generatedOccasion)} Outfit ${index + 1}`,
              item_ids: itemIds,
            }),
          }
        );

      if (
        response.error ||
        !response.data?.id
      ) {
        throw new Error(
          response.error ||
            "Unable to save outfit."
        );
      }

      // Mark outfit as saved
      setSavedOutfits((previous) =>
        Array.from(
          new Set([
            ...previous,
            outfitKey,
          ])
        )
      );

      setSaveMessage(
        "Outfit saved successfully!"
      );

    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save outfit."
      );

    } finally {
      setSavingOutfit(null);
    }
  }

  // Reset recommendation filters
  function resetFilters() {
    if (savingOutfit) return;

    setOccasion("college");
    setLimit(5);
    setOutfits([]);
    setMessage("");
    setError("");
    setGenerated(false);
    setGeneratedOccasion("");
    setSaveMessage("");
    setSaveError("");
    setActiveSaveKey(null);
  }

  const selectClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-[#8170C4] focus:outline-none";

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

          <div className="flex flex-wrap gap-3">

            <Link
              href="/user/wardrobe"
              className="inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65]"
            >
              <Shirt size={18} />
              My Wardrobe
            </Link>

            <Link
              href="/user/saved-outfits"
              className="inline-flex items-center gap-2 rounded-lg border border-[#172A4B] px-5 py-3 font-medium hover:bg-[#F3F0FA]"
            >
              <Bookmark size={18} />
              Saved Outfits
            </Link>

          </div>

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
                disabled={
                  loading ||
                  savingOutfit !== null
                }
                onChange={(event) =>
                  setOccasion(event.target.value)
                }
                className={selectClass}
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

            {/* Number of recommendations */}
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
                disabled={
                  loading ||
                  savingOutfit !== null
                }
                onChange={(event) =>
                  setLimit(
                    Number(event.target.value)
                  )
                }
                className={selectClass}
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
              disabled={
                loading ||
                savingOutfit !== null
              }
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
              disabled={
                loading ||
                savingOutfit !== null
              }
            >
              Reset
            </Button>

          </div>

        </Card>

        {/* Saved outfits loading error */}
        {savedLoadError && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800"
          >

            <p className="text-sm font-medium">
              Unable to check your saved outfits.
            </p>

            <p className="mt-1 text-sm">
              {savedLoadError}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadSavedOutfits()
              }
              className="mt-3 text-sm font-semibold underline"
            >
              Retry loading saved outfits
            </button>

          </div>
        )}

        {/* Recommendation loading state */}
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

        {/* Recommendation error */}
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

        {/* Recommended outfits */}
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
                  {" "}for{" "}
                  {formatText(generatedOccasion)}.
                </p>

              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {outfits.map((outfit, index) => {

                  const outfitKey =
                    getOutfitKey(
                      outfit.item_ids
                    );

                  const isSaved =
                    savedOutfits.includes(
                      outfitKey
                    );

                  const isSaving =
                    savingOutfit === outfitKey;

                  const reasons =
                    outfit.reasons?.length
                      ? outfit.reasons
                      : outfit.reason
                        ? outfit.reason
                            .split(";")
                            .map((reason) =>
                              reason.trim()
                            )
                            .filter(Boolean)
                        : [];

                  const score =
                    typeof outfit.score === "number" &&
                    Number.isFinite(outfit.score)
                      ? Math.round(
                          Math.min(
                            1,
                            Math.max(
                              0,
                              outfit.score
                            )
                          ) * 100
                        )
                      : null;

                  return (

                    <Card
                      key={`${outfitKey}-${index}`}
                      shadow="small"
                    >

                      {/* Outfit heading */}
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                        <h3 className="text-xl font-semibold">
                          Outfit {index + 1}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-[#EEE9FA] px-3 py-1 text-xs font-medium capitalize">
                            {generatedOccasion}
                          </span>

                          {isSaved && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                              <CheckCircle2 size={13} />
                              Saved
                            </span>
                          )}

                        </div>

                      </div>

                      {/* Clothing items */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {outfit.items.map((item) => (

                          <div
                            key={item.id}
                            className="overflow-hidden rounded-xl border border-gray-100"
                          >

                            {/* Clothing image */}
                            <ClothingImage
                              imagePath={
                                item.image_path
                              }
                              name={
                                item.name ||
                                "Clothing item"
                              }
                            />

                            {/* Clothing details */}
                            <div className="p-4">

                              <h4 className="font-semibold">
                                {formatText(item.name)}
                              </h4>

                              <p className="mt-2 text-sm text-gray-500">
                                Category:{" "}
                                {formatCategory(
                                  item.category
                                )}
                              </p>

                              <p className="text-sm text-gray-500">
                                Color:{" "}
                                {formatText(item.color)}
                              </p>

                              <p className="text-sm text-gray-500">
                                Season:{" "}
                                {formatSeason(
                                  item.season
                                )}
                              </p>

                            </div>

                          </div>

                        ))}

                      </div>

                      {/* Recommendation reasons */}
                      {reasons.length > 0 && (

                        <div className="mt-5 rounded-lg bg-[#F3F0FA] p-4">

                          <div className="mb-3 flex items-center gap-2">

                            <Sparkles
                              size={18}
                              className="text-[#8170C4]"
                            />

                            <h4 className="font-semibold">
                              Why this outfit?
                            </h4>

                          </div>

                          <ul className="space-y-3">

                            {reasons.map(
                              (reason, reasonIndex) => (

                                <li
                                  key={reasonIndex}
                                  className="flex items-start gap-2 text-sm text-gray-600"
                                >

                                  <CheckCircle2
                                    size={16}
                                    className="mt-0.5 shrink-0 text-[#8170C4]"
                                  />

                                  <span>
                                    {reason}
                                  </span>

                                </li>

                              )
                            )}

                          </ul>

                        </div>

                      )}

                      {/* Recommendation score */}
                      {score !== null && (

                        <div className="mt-5 rounded-lg border border-gray-100 p-4">

                          <div className="mb-3 flex items-center justify-between">

                            <h4 className="text-sm font-medium">
                              Recommendation Score
                            </h4>

                            <span className="text-xl font-bold text-[#172A4B]">
                              {score}%
                            </span>

                          </div>

                          <div
                            role="progressbar"
                            aria-label="Recommendation score"
                            aria-valuenow={score}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="h-2.5 overflow-hidden rounded-full bg-gray-200"
                          >

                            <div
                              className="h-full rounded-full bg-[#8170C4]"
                              style={{
                                width: `${score}%`,
                              }}
                            />

                          </div>

                          <p className="mt-2 text-xs text-gray-500">
                            Based on the AI engine&apos;s
                            outfit compatibility score.
                          </p>

                        </div>

                      )}

                      <p className="mt-4 text-xs text-gray-500">
                        Recommended from your personal wardrobe.
                      </p>

                      {/* Save Outfit buttons */}
                      <div className="mt-5 flex flex-wrap gap-3">

                        <Button
                          type="button"
                          size="medium"
                          disabled={
                            savingOutfit !== null ||
                            savedLoading ||
                            Boolean(savedLoadError) ||
                            isSaved
                          }
                          onClick={() =>
                            void saveOutfit(
                              outfit,
                              index
                            )
                          }
                        >

                          <span className="inline-flex items-center gap-2">

                            {isSaving ||
                            savedLoading ? (

                              <Loader2
                                size={18}
                                className="animate-spin"
                              />

                            ) : isSaved ? (

                              <CheckCircle2
                                size={18}
                              />

                            ) : (

                              <Bookmark
                                size={18}
                              />

                            )}

                            {savedLoading
                              ? "Checking..."
                              : isSaved
                                ? "Outfit Saved"
                                : isSaving
                                  ? "Saving..."
                                  : "Save Outfit"}

                          </span>

                        </Button>

                        <Link
                          href="/user/saved-outfits"
                          className="inline-flex items-center gap-2 rounded-lg border border-[#172A4B] px-5 py-2.5 text-sm font-medium hover:bg-[#F3F0FA]"
                        >

                          <Bookmark size={16} />

                          View Saved Outfits

                        </Link>

                      </div>

                      {/* Save success message */}
                      {activeSaveKey === outfitKey &&
                        saveMessage && (

                          <div
                            role="status"
                            className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                          >

                            <CheckCircle2
                              size={18}
                              className="shrink-0"
                            />

                            {saveMessage}

                          </div>

                        )}

                      {/* Save error message */}
                      {activeSaveKey === outfitKey &&
                        saveError && (

                          <div
                            role="alert"
                            className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                          >

                            <AlertCircle
                              size={18}
                              className="shrink-0"
                            />

                            {saveError}

                          </div>

                        )}

                    </Card>

                  );
                })}

              </div>

            </section>

          )}

      </div>

    </main>
  );
}
