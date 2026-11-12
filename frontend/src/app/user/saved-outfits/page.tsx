
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Bookmark,
  Trash2,
  Shirt,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { apiRequest } from "@/lib/api";
import { getSupabase } from "@/lib/supabase";

// Clothing details returned by backend
type ClothingItem = {
  id: string;
  name: string | null;
  category: string | null;
  color: string | null;
  season: string | null;
  image_path: string | null;
};

// Saved outfit returned by backend
type SavedOutfit = {
  id: string;
  title: string | null;
  created_at: string | null;
  items: ClothingItem[];
};

// GET API response
type SavedOutfitsResponse = {
  data: SavedOutfit[];
  error: string | null;
};

// DELETE API response
type DeleteResponse = {
  data: {
    deleted: boolean;
    id: string;
  } | null;
  error: string | null;
};

// User-friendly category labels
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

// User-friendly season labels
const seasonLabels: Record<string, string> = {
  summer: "Summer",
  winter: "Winter",
  monsoon: "Rainy",
  all_season: "All Seasons",
};

function formatText(value: string | null) {
  if (!value) return "Not specified";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatCategory(value: string | null) {
  if (!value) return "Not specified";

  return (
    categoryLabels[value.toLowerCase()] ||
    formatText(value)
  );
}

function formatSeason(value: string | null) {
  if (!value) return "Not specified";

  return (
    seasonLabels[value.toLowerCase()] ||
    formatText(value)
  );
}

function formatDate(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Display clothing images from Supabase
function ClothingImage({
  imagePath,
  name,
}: {
  imagePath: string | null;
  name: string;
}) {
  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadImage() {
      setImageUrl(null);

      if (!imagePath) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Direct image URL
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

        // Private Supabase storage image
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
          "Unable to load image:",
          error
        );

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadImage();

    return () => {
      active = false;
    };

  }, [imagePath]);

  return (
    <div className="flex h-40 items-center justify-center overflow-hidden bg-[#EEE9FA]">

      {loading ? (
        <Loader2
          size={28}
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
          size={42}
          className="text-[#8170C4]"
        />
      )}

    </div>
  );
}

export default function SavedOutfitsPage() {
  const [outfits, setOutfits] =
    useState<SavedOutfit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // Load saved outfits from database
  async function loadOutfits() {
    setLoading(true);
    setLoadError("");
    setError("");
    setMessage("");

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

      setOutfits(response.data);

    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load saved outfits."
      );

    } finally {
      setLoading(false);
    }
  }

  // Load outfits when page opens
  useEffect(() => {
    void loadOutfits();
  }, []);

  // Delete saved outfit from database
  async function removeOutfit(id: string) {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Remove this saved outfit?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setMessage("");

    try {
      const response =
        await apiRequest<DeleteResponse>(
          `/saved-outfits/${encodeURIComponent(id)}`,
          {
            method: "DELETE",
          }
        );

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data?.deleted) {
        throw new Error(
          "Unable to remove saved outfit."
        );
      }

      // Remove only after backend confirms deletion
      setOutfits((previous) =>
        previous.filter(
          (outfit) => outfit.id !== id
        )
      );

      setMessage(
        "Saved outfit removed successfully."
      );

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove outfit."
      );

    } finally {
      setDeletingId(null);
    }
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
              <Bookmark className="text-[#8170C4]" />

              My Saved Outfits
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage your favorite
              outfit combinations.
            </p>

          </div>

          <Link
            href="/user/recommendation"
            className="inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65]"
          >
            <Sparkles size={18} />
            Explore Outfits
          </Link>

        </div>

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="rounded-xl bg-white p-10 text-center shadow-sm"
          >

            <Loader2
              size={36}
              className="mx-auto mb-4 animate-spin text-[#8170C4]"
            />

            <p className="text-gray-600">
              Loading your saved outfits...
            </p>

          </div>
        )}

        {/* Loading error */}
        {!loading && loadError && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 p-5 text-red-700"
          >

            <div className="flex items-center gap-2">

              <AlertCircle size={20} />

              <h2 className="font-semibold">
                Unable to load saved outfits
              </h2>

            </div>

            <p className="mt-2 text-sm">
              {loadError}
            </p>

            <div className="mt-4">

              <Button
                type="button"
                size="medium"
                onClick={() => void loadOutfits()}
              >
                Try Again
              </Button>

            </div>

          </div>
        )}

        {/* Delete success message */}
        {message && (
          <p
            role="status"
            className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        {/* Delete error message */}
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {/* Empty state */}
        {!loading &&
          !loadError &&
          outfits.length === 0 && (

            <div className="rounded-xl bg-white p-10 text-center shadow-sm">

              <Bookmark
                size={48}
                className="mx-auto text-[#8170C4]"
              />

              <h2 className="mt-4 text-xl font-semibold">
                No saved outfits
              </h2>

              <p className="mt-2 text-gray-500">
                Generate outfit recommendations
                and save your favorite combinations.
              </p>

              <Link
                href="/user/recommendation"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65]"
              >
                <Sparkles size={18} />
                Explore Outfits
              </Link>

            </div>
          )}

        {/* Saved outfits collection */}
        {!loading &&
          !loadError &&
          outfits.length > 0 && (

            <section>

              <div className="mb-5">

                <h2 className="text-2xl font-semibold">
                  My Outfit Collection
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {outfits.length} saved outfit
                  {outfits.length === 1 ? "" : "s"}
                </p>

              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {outfits.map((outfit, index) => (

                  <Card
                    key={outfit.id}
                    shadow="small"
                  >

                    {/* Outfit title */}
                    <div className="mb-5">

                      <div className="flex items-center gap-2">

                        <Bookmark
                          size={20}
                          className="text-[#8170C4]"
                        />

                        <h3 className="text-xl font-semibold">
                          {outfit.title ||
                            `Saved Outfit ${index + 1}`}
                        </h3>

                      </div>

                      {formatDate(outfit.created_at) && (
                        <p className="mt-2 text-xs text-gray-500">
                          Saved on{" "}
                          {formatDate(outfit.created_at)}
                        </p>
                      )}

                    </div>

                    {/* Outfit clothing items */}
                    {outfit.items?.length > 0 ? (

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {outfit.items.map((item) => (

                          <div
                            key={item.id}
                            className="overflow-hidden rounded-xl border border-gray-100"
                          >

                            <ClothingImage
                              imagePath={item.image_path}
                              name={
                                item.name ||
                                "Clothing item"
                              }
                            />

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
                                {formatSeason(item.season)}
                              </p>

                            </div>

                          </div>

                        ))}

                      </div>

                    ) : (

                      <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                        No clothing items are currently
                        available for this outfit.
                      </p>

                    )}

                    {/* Remove outfit button */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                      <span className="text-sm text-gray-500">
                        {outfit.items?.length || 0}{" "}
                        clothing items
                      </span>

                      <button
                        type="button"
                        disabled={deletingId !== null}
                        onClick={() =>
                          void removeOutfit(outfit.id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >

                        {deletingId === outfit.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        {deletingId === outfit.id
                          ? "Removing..."
                          : "Remove Outfit"}

                      </button>

                    </div>

                  </Card>

                ))}

              </div>

            </section>
          )}

      </div>

    </main>
  );
}
