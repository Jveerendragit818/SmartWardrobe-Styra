
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
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

type UploadResponse = {
  data: {
    image_path: string;
    bucket: string;
  } | null;
  error: string | null;
};

type ClothingResponse = {
  data: {
    id: string;
    name: string;
    confirmed_attributes?: Record<string, string>;
  } | null;
  error: string | null;
};

export default function AddClothingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("all_season");
  const [occasion, setOccasion] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setPhoto(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

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

    setLoading(true);

    try {
      let uploadedImagePath: string | null = null;

      // Upload clothing image if selected
      if (photo) {
        const formData = new FormData();

        formData.append("file", photo);

        const uploadResponse =
          await apiRequest<UploadResponse>(
            "/wardrobe/images",
            {
              method: "POST",
              body: formData,
            }
          );

        if (
          uploadResponse.error ||
          !uploadResponse.data?.image_path
        ) {
          throw new Error(
            uploadResponse.error ||
              "Could not upload the clothing image."
          );
        }

        uploadedImagePath =
          uploadResponse.data.image_path;
      }

      // Save clothing with confirmed attributes
      const clothingData = {
        name: name.trim(),
        category: category,
        color: color.trim().toLowerCase(),
        season: season,
        occasion: occasion
          ? [occasion.toLowerCase()]
          : [],
        image_path: uploadedImagePath,

        confirmed_attributes: {
          category: category,
          color: color.trim().toLowerCase(),
        },
      };

      const response =
        await apiRequest<ClothingResponse>(
          "/wardrobe",
          {
            method: "POST",
            body: JSON.stringify(clothingData),
          }
        );

      if (response.error || !response.data) {
        throw new Error(
          response.error ||
            "Could not save the clothing item."
        );
      }

      setSuccess(
        "Clothing item saved successfully!"
      );

      router.push("/user/wardrobe");

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-[#172A4B] sm:p-6">

      <div className="mx-auto max-w-3xl">

        <Link
          href="/user/wardrobe"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Wardrobe
        </Link>

        <h1 className="text-3xl font-bold text-[#172A4B]">
          Add Clothing Item
        </h1>

        <p className="mt-2 text-gray-600">
          Add a new clothing item to your digital wardrobe.
        </p>

        <div className="mt-8">

          <Card>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Clothing photo */}
              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Clothing Photo (Optional)
                </label>

                <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#C9B9E8] bg-[#F3F0FA] p-4">

                  {preview ? (

                    <img
                      src={preview}
                      alt="Clothing preview"
                      className="h-48 w-full object-contain"
                    />

                  ) : (

                    <>
                      <ImagePlus
                        size={42}
                        className="text-[#8170C4]"
                      />

                      <span className="mt-3 text-sm font-medium">
                        Click to upload a photo
                      </span>

                      <span className="mt-1 text-xs text-gray-500">
                        JPG, PNG or WebP · Maximum 5 MB
                      </span>
                    </>

                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    disabled={loading}
                    className="hidden"
                  />

                </label>

                {photo && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPreview("");
                    }}
                    disabled={loading}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Remove Photo
                  </button>
                )}

              </div>

              {/* Clothing name */}
              <Input
                label="Clothing Name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: White Shirt"
                maxLength={120}
                required
                disabled={loading}
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
                  disabled={loading}
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
                placeholder="Example: White"
                required
                disabled={loading}
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
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4]"
                >

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
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4]"
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

                </select>

              </div>

              {/* Confirm attributes */}
              <div className="rounded-xl border border-[#DCD3EF] bg-[#F3F0FA] p-4">

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) =>
                      setConfirmed(event.target.checked)
                    }
                    disabled={loading}
                    className="mt-1 h-4 w-4 accent-[#172A4B]"
                  />

                  <div>

                    <p className="text-sm font-semibold">
                      Confirm Clothing Details
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      I confirm that the selected category
                      and color are correct. These details
                      can be used by Styra for personalized
                      outfit suggestions.
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

              {/* Form buttons */}
              <div className="flex flex-wrap gap-3">

                <Button
                  type="submit"
                  size="medium"
                  disabled={loading}
                >

                  <span className="inline-flex items-center gap-2">

                    {loading && (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    )}

                    {loading
                      ? "Saving..."
                      : "Save Clothing Item"}

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

      </div>

    </main>
  );
}
