
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Shirt,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import { getSupabase } from "@/lib/supabase";

type ClothingItem = {
  id: string;
  name: string;
  category: string;
  color: string | null;
  season: string | null;
  image_path: string | null;
};

type WardrobeResponse = {
  data: ClothingItem[];
  error: string | null;
};

// Display clothing image from Supabase
function ClothingImage({
  imagePath,
  name,
}: {
  imagePath: string | null;
  name: string;
}) {
  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadImage() {
      setImageUrl(null);

      if (!imagePath) return;

      try {
        const supabase = getSupabase();

        const { data, error } = await supabase.storage
          .from("wardrobe-images")
          .createSignedUrl(imagePath, 3600);

        if (error) {
          console.error("Image loading error:", error.message);
          return;
        }

        if (active && data?.signedUrl) {
          setImageUrl(data.signedUrl);
        }
      } catch (error) {
        console.error("Unable to load image:", error);
      }
    }

    void loadImage();

    return () => {
      active = false;
    };
  }, [imagePath]);

  return (
    <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-[#EEE9FA]">
      {imageUrl ? (
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

export default function WardrobePage() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [items, setItems] =
    useState<ClothingItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // Load clothing items
  async function loadWardrobe() {
    setLoading(true);
    setError("");

    try {
      const response =
        await apiRequest<WardrobeResponse>(
          "/wardrobe"
        );

      setItems(response.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load wardrobe."
      );
    } finally {
      setLoading(false);
    }
  }

  // Load wardrobe when page opens
  useEffect(() => {
    void loadWardrobe();
  }, []);

  // Delete clothing item
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this clothing item?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setMessage("");

    try {
      await apiRequest(
        `/wardrobe/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      setItems((previousItems) =>
        previousItems.filter(
          (item) => item.id !== id
        )
      );

      setMessage(
        "Clothing item deleted successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete clothing item."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Generate category filters
  const categories = [
    "All",
    ...Array.from(
      new Set(items.map((item) => item.category))
    ).filter((category) => category !== "All"),
  ];

  // Filter clothing items
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter(
          (item) =>
            item.category === selectedCategory
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

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg bg-red-50 p-4 text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => void loadWardrobe()}
              disabled={loading}
              className="mt-3 rounded-lg bg-[#172A4B] px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success message */}
        {message && (
          <p
            role="status"
            className="mt-6 rounded-lg bg-green-50 p-4 text-green-700"
          >
            {message}
          </p>
        )}

        <section className="mt-8">

          <h2 className="text-xl font-semibold text-[#172A4B]">
            My Clothing Collection
          </h2>

          {/* Loading state */}
          {loading && (
            <div
              role="status"
              className="mt-6 rounded-xl bg-white p-8 text-center text-gray-600 shadow-sm"
            >
              Loading your wardrobe...
            </div>
          )}

          {/* Category filters */}
          {!loading && (
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
          )}

          {/* Clothing cards */}
          {!loading && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >

                  {/* Actual clothing image */}
                  <ClothingImage
                    imagePath={item.image_path}
                    name={item.name}
                  />

                  {/* Clothing details */}
                  <h3 className="text-lg font-semibold text-[#172A4B]">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Category: {item.category}
                  </p>

                  <p className="text-sm text-gray-500">
                    Color: {item.color || "Not specified"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Season: {item.season || "Not specified"}
                  </p>

                  {/* Edit and Delete */}
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
                      disabled={deletingId !== null}
                      onClick={() =>
                        void handleDelete(item.id)
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingId === item.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Empty wardrobe */}
          {!loading &&
            !error &&
            filteredItems.length === 0 && (
              <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">

                <Shirt
                  size={48}
                  className="mx-auto text-[#8170C4]"
                />

                <h3 className="mt-4 text-lg font-semibold text-[#172A4B]">
                  No clothing items found
                </h3>

                <p className="mt-2 text-gray-500">
                  {items.length === 0
                    ? "Add your first clothing item to get started."
                    : "Try selecting another category."}
                </p>

                {items.length === 0 && (
                  <Link
                    href="/user/wardrobe/add"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-white"
                  >
                    <Plus size={18} />
                    Add Clothing
                  </Link>
                )}

              </div>
            )}

        </section>
      </div>
    </main>
  );
}
