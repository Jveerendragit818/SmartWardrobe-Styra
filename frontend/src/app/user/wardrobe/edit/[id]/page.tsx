
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import { apiRequest } from "@/lib/api";

const categories = [
  { label: "T-Shirts", value: "tshirt" },
  { label: "Shirts", value: "shirt" },
  { label: "Trousers", value: "trousers" },
  { label: "Jeans", value: "jeans" },
  { label: "Skirts", value: "skirt" },
  { label: "Dresses", value: "dress" },
  { label: "Jackets", value: "jacket" },
  { label: "Footwear", value: "shoes" },
];

const seasons = [
  { label: "Summer", value: "summer" },
  { label: "Winter", value: "winter" },
  { label: "Rainy", value: "monsoon" },
  { label: "All Seasons", value: "all_season" },
];

const occasions = [
  "Casual",
  "College",
  "Office",
  "Party",
  "Festival",
  "Wedding",
  "Travel",
];

type ClothingItem = {
  id: string;
  name: string;
  category: string;
  color: string | null;
  season: string | null;
  occasion: string[] | string | null;
  image_path: string | null;
  confirmed_attributes?: Record<string, string>;
};

type WardrobeResponse = {
  data: ClothingItem[] | null;
  error: string | null;
};

type UpdateResponse = {
  data: ClothingItem | null;
  error: string | null;
};

// Convert old category labels into supported values
function normalizeCategory(value: string) {
  const category = value.trim().toLowerCase();

  const aliases: Record<string, string> = {
    "t-shirt": "tshirt",
    "t-shirts": "tshirt",
    "t shirt": "tshirt",
    "t shirts": "tshirt",
    tshirts: "tshirt",
    tee: "tshirt",
    shirts: "shirt",
    pants: "trousers",
    pant: "trousers",
    trouser: "trousers",
    denims: "jeans",
    denim: "jeans",
    skirts: "skirt",
    dresses: "dress",
    jackets: "jacket",
    footwear: "shoes",
    sneakers: "shoes",
    sneaker: "shoes",
    shoe: "shoes",
  };

  const normalized =
    aliases[category] || category;

  return categories.some(
    (item) => item.value === normalized
  )
    ? normalized
    : "";
}

// Convert old season labels into supported values
function normalizeSeason(value: string | null) {
  const season =
    (value || "").trim().toLowerCase();

  const aliases: Record<string, string> = {
    "all seasons": "all_season",
    "all season": "all_season",
    "all-season": "all_season",
    rainy: "monsoon",
  };

  const normalized =
    aliases[season] || season;

  return seasons.some(
    (item) => item.value === normalized
  )
    ? normalized
    : "";
}

export default function EditClothingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("");
  const [occasion, setOccasion] = useState("");

  const [existingOccasions, setExistingOccasions] =
    useState<string[]>([]);

  const [originalOccasion, setOriginalOccasion] =
    useState("");

  const [confirmed, setConfirmed] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [itemFound, setItemFound] =
    useState(false);

  // Load existing clothing item
  useEffect(() => {
    let cancelled = false;

    async function loadClothingItem() {
      setLoading(true);
      setError("");
      setItemFound(false);

      try {
        const response =
          await apiRequest<WardrobeResponse>(
            "/wardrobe",
            {
              method: "GET",
            }
          );

        if (response.error) {
          throw new Error(response.error);
        }

        if (!Array.isArray(response.data)) {
          throw new Error(
            "Could not load your wardrobe."
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

        if (cancelled) return;

        setName(item.name || "");

        setCategory(
          normalizeCategory(item.category)
        );

        setColor(item.color || "");

        setSeason(
          normalizeSeason(item.season)
        );

        const savedOccasions = Array.isArray(
          item.occasion
        )
          ? item.occasion
          : typeof item.occasion === "string"
            ? [item.occasion]
            : [];

        const firstOccasion =
          savedOccasions[0]?.toLowerCase() || "";

        setExistingOccasions(savedOccasions);
        setOriginalOccasion(firstOccasion);
        setOccasion(firstOccasion);

        setConfirmed(false);
        setItemFound(true);

      } catch (error) {
        if (cancelled) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load the clothing item."
        );

      } finally {
        if (!cancelled) {
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
      cancelled = true;
    };

  }, [id]);

  // Update existing clothing item
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving || !itemFound) return;

    setError("");
    setSuccess("");

    if (!name.trim() || !category || !color.trim()) {
      setError(
        "Please enter the clothing name, category and color."
      );
      return;
    }

    if (!confirmed) {
      setError(
        "Please confirm that the category and color are correct."
      );
      return;
    }

    setSaving(true);

    try {
      const clothingData = {
        name: name.trim(),

        category: category,

        color: color.trim().toLowerCase(),

        season: season || null,

        occasion:
          occasion === originalOccasion
            ? existingOccasions
            : occasion
              ? [occasion.toLowerCase()]
              : [],

        // Confirmed attributes used by Styra
        confirmed_attributes: {
          category: category,
          color: color.trim().toLowerCase(),
        },
      };

      const response =
        await apiRequest<UpdateResponse>(
          `/wardrobe/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify(clothingData),
          }
        );

      if (response.error || !response.data) {
        throw new Error(
          response.error ||
            "Could not update the clothing item."
        );
      }

      setSuccess(
        "Clothing details updated successfully!"
      );

      router.push("/user/wardrobe");

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-[#172A4B] sm:p-6">

      <div className="mx-auto max-w-3xl">

        {/* Back link */}
        <Link
          href="/user/wardrobe"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Wardrobe
        </Link>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#172A4B]">
          Edit Clothing Item
        </h1>

        <p className="mt-2 text-gray-600">
          Update and confirm your clothing details.
        </p>

        {/* Loading state */}
        {loading ? (

          <div className="mt-8">

            <Card>

              <div
                role="status"
                className="flex flex-col items-center justify-center py-12"
              >

                <Loader2
                  size={36}
                  className="animate-spin text-[#8170C4]"
                />

                <p className="mt-4 text-sm text-gray-600">
                  Loading clothing details...
                </p>

              </div>

            </Card>

          </div>

        ) : !itemFound ? (

          /* Item loading error */
          <div className="mt-8">

            <Card>

              <div className="py-8 text-center">

                <AlertCircle
                  size={40}
                  className="mx-auto text-red-500"
                />

                <h2 className="mt-4 text-xl font-semibold">
                  Unable to load clothing item
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {error}
                </p>

                <Link
                  href="/user/wardrobe"
                  className="mt-5 inline-block rounded-lg bg-[#172A4B] px-5 py-3 text-sm text-white"
                >
                  Return to Wardrobe
                </Link>

              </div>

            </Card>

          </div>

        ) : (

          /* Edit form */
          <div className="mt-8">

            <Card>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* Clothing name */}
                <Input
                  label="Clothing Name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  maxLength={120}
                  required
                  disabled={saving}
                />

                {/* Category */}
                <div>

                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold"
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
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4]"
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
                  value={color}
                  onChange={(event) => {
                    setColor(event.target.value);
                    setConfirmed(false);
                  }}
                  required
                  disabled={saving}
                />

                {/* Season */}
                <div>

                  <label
                    htmlFor="season"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Season
                  </label>

                  <select
                    id="season"
                    value={season}
                    onChange={(event) =>
                      setSeason(event.target.value)
                    }
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4]"
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
                    className="mb-2 block text-sm font-semibold"
                  >
                    Occasion (Optional)
                  </label>

                  <select
                    id="occasion"
                    value={occasion}
                    onChange={(event) =>
                      setOccasion(event.target.value)
                    }
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4]"
                  >

                    <option value="">
                      Select occasion
                    </option>

                    {occasion &&
                      !occasions.some(
                        (item) =>
                          item.toLowerCase() === occasion
                      ) && (
                        <option value={occasion}>
                          {occasion}
                        </option>
                      )}

                    {occasions.map((item) => (
                      <option
                        key={item}
                        value={item.toLowerCase()}
                      >
                        {item}
                      </option>
                    ))}

                  </select>

                </div>

                {/* User confirmation */}
                <div className="rounded-xl border border-[#DCD3EF] bg-[#F3F0FA] p-4">

                  <label className="flex cursor-pointer items-start gap-3">

                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(event) =>
                        setConfirmed(event.target.checked)
                      }
                      disabled={saving}
                      className="mt-1 h-4 w-4 accent-[#172A4B]"
                    />

                    <div>

                      <p className="text-sm font-semibold">
                        Confirm Clothing Details
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        I confirm that the category and
                        color are correct. Styra can use
                        these confirmed details for
                        personalized outfit suggestions.
                      </p>

                    </div>

                  </label>

                </div>

                {/* Error message */}
                {error && (

                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700"
                  >

                    <AlertCircle
                      size={18}
                      className="shrink-0"
                    />

                    {error}

                  </div>

                )}

                {/* Success message */}
                {success && (

                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700"
                  >

                    <CheckCircle2 size={18} />

                    {success}

                  </div>

                )}

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">

                  <Button
                    type="submit"
                    size="medium"
                    disabled={saving}
                  >

                    <span className="inline-flex items-center gap-2">

                      {saving && (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      )}

                      {saving
                        ? "Saving..."
                        : "Save Changes"}

                    </span>

                  </Button>

                  <Link
                    href="/user/wardrobe"
                    className="inline-flex items-center justify-center rounded-lg border border-[#172A4B] px-5 py-2.5 text-sm font-medium hover:bg-[#F3F0FA]"
                  >
                    Cancel
                  </Link>

                </div>

              </form>

            </Card>

          </div>

        )}

      </div>

    </main>
  );
}
