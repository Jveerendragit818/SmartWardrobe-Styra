
"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

import { apiRequest } from "@/lib/api";

// Clothing item type
type ClothingItem = {
  id: string;
  name: string;
  category: string;
  color: string | null;
  season: string | null;
  occasion: string[];
  image_path?: string | null;
  confirmed_attributes?: Record<string, string>;
};

// API response type
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// Supported clothing categories
const categories = [
  { value: "tshirt", label: "T-Shirts" },
  { value: "shirt", label: "Shirts" },
  { value: "trousers", label: "Trousers" },
  { value: "jeans", label: "Jeans" },
  { value: "skirt", label: "Skirts" },
  { value: "dress", label: "Dresses" },
  { value: "jacket", label: "Jackets" },
  { value: "shoes", label: "Footwear" },
];

// Supported seasons
const seasons = [
  { value: "summer", label: "Summer" },
  { value: "winter", label: "Winter" },
  { value: "monsoon", label: "Rainy" },
  { value: "all_season", label: "All Seasons" },
];

// Occasion options
const occasions = [
  "Casual",
  "College",
  "Office",
  "Formal",
  "Party",
  "Festival",
  "Wedding",
  "Travel",
  "Sports",
  "Beach",
];

// Normalize older category values
function normalizeCategory(value: string) {
  const category = value.trim().toLowerCase();

  const aliases: Record<string, string> = {
    tops: "shirt",
    shirts: "shirt",
    "t-shirts": "tshirt",
    "t-shirt": "tshirt",
    tshirts: "tshirt",
    "t shirt": "tshirt",
    tee: "tshirt",
    pants: "trousers",
    pant: "trousers",
    trouser: "trousers",
    bottoms: "trousers",
    denims: "jeans",
    denim: "jeans",
    skirts: "skirt",
    dresses: "dress",
    jackets: "jacket",
    footwear: "shoes",
    sneakers: "shoes",
    sneaker: "shoes",
  };

  return aliases[category] || category;
}

// Normalize older season values
function normalizeSeason(value: string | null) {
  if (!value) return "";

  const season = value.trim().toLowerCase();

  const aliases: Record<string, string> = {
    "all seasons": "all_season",
    "all season": "all_season",
    "all-season": "all_season",
    all_seasons: "all_season",
    rainy: "monsoon",
    rain: "monsoon",
  };

  return aliases[season] || season;
}

// Main Edit Clothing component
function EditClothingContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("all_season");
  const [occasion, setOccasion] = useState("");

  const [existingOccasions, setExistingOccasions] =
    useState<string[]>([]);

  const [originalOccasion, setOriginalOccasion] =
    useState("");

  const [confirmed, setConfirmed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [itemFound, setItemFound] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing clothing details
  useEffect(() => {
    let active = true;

    async function loadClothingItem() {
      setLoading(true);
      setError("");
      setSuccess("");
      setItemFound(false);
      setConfirmed(false);

      try {
        const response =
          await apiRequest<ApiResponse<ClothingItem[]>>(
            "/wardrobe",
            {
              method: "GET",
            }
          );

        if (!active) return;

        if (response.error) {
          throw new Error(response.error);
        }

        if (!Array.isArray(response.data)) {
          throw new Error(
            "Unable to load wardrobe items."
          );
        }

        const item = response.data.find(
          (clothing) => clothing.id === id
        );

        if (!item) {
          throw new Error(
            "Clothing item not found."
          );
        }

        setName(item.name || "");

        setCategory(
          normalizeCategory(item.category || "")
        );

        setColor(item.color || "");

        setSeason(
          normalizeSeason(item.season)
        );

        const savedOccasions =
          Array.isArray(item.occasion)
            ? item.occasion
            : [];

        const firstOccasion =
          savedOccasions[0]?.toLowerCase() || "";

        setExistingOccasions(savedOccasions);
        setOriginalOccasion(firstOccasion);
        setOccasion(firstOccasion);

        setItemFound(true);

      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load clothing details."
        );

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      void loadClothingItem();
    } else {
      setError("Invalid clothing item ID.");
      setLoading(false);
    }

    return () => {
      active = false;
    };

  }, [id]);

  // Save updated clothing details
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving || !itemFound) return;

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanColor = color.trim().toLowerCase();

    if (!cleanName) {
      setError("Please enter a clothing name.");
      return;
    }

    if (
      !categories.some(
        (item) => item.value === category
      )
    ) {
      setError(
        "Please select a valid clothing category."
      );
      return;
    }

    if (!cleanColor) {
      setError("Please enter the clothing color.");
      return;
    }

    if (
      season &&
      !seasons.some(
        (item) => item.value === season
      )
    ) {
      setError("Please select a valid season.");
      return;
    }

    if (!confirmed) {
      setError(
        "Please confirm the clothing category and color before saving."
      );
      return;
    }

    setSaving(true);

    try {
      // Preserve existing occasions when unchanged
      const updatedOccasions =
        occasion === originalOccasion
          ? existingOccasions
          : occasion
            ? [occasion.toLowerCase()]
            : [];

      const payload = {
        name: cleanName,
        category,
        color: cleanColor,
        season: season || null,
        occasion: updatedOccasions,

        confirmed_attributes: {
          category,
          color: cleanColor,
        },
      };

      const response =
        await apiRequest<ApiResponse<ClothingItem>>(
          `/wardrobe/${encodeURIComponent(id)}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );

      if (response.error || !response.data) {
        throw new Error(
          response.error ||
            "Unable to update clothing item."
        );
      }

      setSuccess(
        "Clothing item updated successfully!"
      );

      router.push("/user/wardrobe");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update clothing item."
      );

    } finally {
      setSaving(false);
    }
  }

  // Loading screen
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">

        <div className="flex items-center gap-3 text-[#172A4B]">

          <Loader2
            size={26}
            className="animate-spin text-[#8170C4]"
          />

          <p>Loading clothing details...</p>

        </div>

      </main>
    );
  }

  // Clothing item not found or API error
  if (!itemFound) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 text-[#172A4B] sm:p-6">

        <div className="mx-auto max-w-2xl">

          <Link
            href="/user/wardrobe"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Wardrobe
          </Link>

          <Card shadow="small">

            <div className="py-8 text-center">

              <AlertCircle
                size={40}
                className="mx-auto text-red-500"
              />

              <h1 className="mt-4 text-xl font-semibold">
                Unable to Load Clothing
              </h1>

              <p className="mt-3 text-sm text-gray-600">
                {error ||
                  "Clothing item not found."}
              </p>

              <Link
                href="/user/wardrobe"
                className="mt-5 inline-block rounded-lg bg-[#17233F] px-5 py-3 text-sm font-medium text-white hover:bg-[#26385F]"
              >
                Return to Wardrobe
              </Link>

            </div>

          </Card>

        </div>

      </main>
    );
  }

  // Edit Clothing form
  return (
    <main className="min-h-screen bg-gray-50 p-4 text-[#172A4B] sm:p-6">

      <div className="mx-auto max-w-2xl">

        {/* Back link */}
        <Link
          href="/user/wardrobe"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Wardrobe
        </Link>

        {/* Page heading */}
        <h1 className="text-2xl font-bold sm:text-3xl">
          Edit Clothing Item
        </h1>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Update and confirm your clothing details.
        </p>

        {/* Edit form */}
        <div className="mt-6">

          <Card shadow="small">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Clothing name */}
              <Input
                label="Clothing Name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: White Shirt"
                maxLength={120}
                required
              />

              {/* Category */}
              <div>

                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setConfirmed(false);
                  }}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4] focus:ring-2 focus:ring-[#C9B9E8]"
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}

                </select>

              </div>

              {/* Color */}
              <Input
                label="Color"
                type="text"
                value={color}
                onChange={(event) => {
                  setColor(event.target.value);
                  setConfirmed(false);
                }}
                placeholder="Example: White"
                required
              />

              {/* Season */}
              <div>

                <label
                  htmlFor="season"
                  className="mb-2 block text-sm font-medium"
                >
                  Season
                </label>

                <select
                  id="season"
                  value={season}
                  onChange={(event) =>
                    setSeason(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4] focus:ring-2 focus:ring-[#C9B9E8]"
                >

                  <option value="">
                    Select season
                  </option>

                  {seasons.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}

                </select>

              </div>

              {/* Occasion */}
              <div>

                <label
                  htmlFor="occasion"
                  className="mb-2 block text-sm font-medium"
                >
                  Occasion (Optional)
                </label>

                <select
                  id="occasion"
                  value={occasion}
                  onChange={(event) =>
                    setOccasion(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4] focus:ring-2 focus:ring-[#C9B9E8]"
                >

                  <option value="">
                    Select occasion
                  </option>

                  {occasions.map((item) => (
                    <option
                      key={item}
                      value={item.toLowerCase()}
                    >
                      {item}
                    </option>
                  ))}

                  {occasion &&
                    !occasions.some(
                      (item) =>
                        item.toLowerCase() === occasion
                    ) && (
                      <option value={occasion}>
                        {occasion}
                      </option>
                    )}

                </select>

              </div>

              {/* Confirm clothing details */}
              <div className="rounded-xl border border-[#DDD4F0] bg-[#F3F0FA] p-4">

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) =>
                      setConfirmed(
                        event.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-[#17233F]"
                  />

                  <div>

                    <p className="text-sm font-semibold">
                      Confirm Clothing Details
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      I confirm that the selected
                      category and color are correct.
                      Styra can use these confirmed
                      details for personalized outfit
                      suggestions.
                    </p>

                  </div>

                </label>

              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{error}</p>

                </div>
              )}

              {/* Success message */}
              {success && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                >

                  <CheckCircle2
                    size={18}
                    className="shrink-0"
                  />

                  <p>{success}</p>

                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">

                <Button
                  type="submit"
                  size="medium"
                  disabled={saving}
                >

                  <span className="inline-flex items-center justify-center gap-2">

                    {saving ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={18} />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save Changes"}

                  </span>

                </Button>

                <Link
                  href="/user/wardrobe"
                  className="inline-flex items-center justify-center rounded-lg border border-[#17233F] px-5 py-2.5 text-sm font-medium text-[#17233F] hover:bg-[#F3F0FA]"
                >
                  Cancel
                </Link>

              </div>

            </form>

          </Card>

        </div>

      </div>

    </main>
  );
}

// IMPORTANT: Suspense wrapper fixes the useParams issue
export default function EditClothingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">

          <div className="flex items-center gap-3 text-[#172A4B]">

            <Loader2
              size={26}
              className="animate-spin text-[#8170C4]"
            />

            <p>Loading clothing details...</p>

          </div>

        </main>
      }
    >

      <EditClothingContent />

    </Suspense>
  );
}
