
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

const categories = [
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

export default function AddClothingPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("Please select a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
        setMessage("");
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !category || !color.trim() || !season) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setMessage(
      "Form validated successfully! Saving clothing items will be available after backend integration."
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-5 py-10 text-[#17233F] sm:px-8">
      <main className="mx-auto max-w-3xl">
        <Link
          href="/user/wardrobe"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Wardrobe
        </Link>

        <h1 className="text-3xl font-bold">Add Clothing Item</h1>
        <p className="mb-8 mt-3 text-gray-600">
          Add a new item to your digital wardrobe.
        </p>

        <Card shadow="small">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-semibold">
                Clothing Photo
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9B9E8] bg-[#F8F5FC] p-8 text-center">
                {photo ? (
                  <img
                    src={photo}
                    alt="Selected clothing preview"
                    className="max-h-56 rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={42}
                      className="mb-3 text-[#77649B]"
                    />
                    <span className="font-medium">
                      Click to upload clothing photo
                    </span>
                    <span className="mt-2 text-xs text-gray-500">
                      JPG or PNG, maximum 5 MB
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhoto}
                  className="sr-only"
                />
              </label>
            </div>

            <Input
              label="Clothing Name"
              placeholder="e.g. Blue Denim Jacket"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <div>
              <label
                htmlFor="clothing-category"
                className="mb-2 block text-sm font-semibold"
              >
                Category
              </label>
              <select
                id="clothing-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-[#8872B3] focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Color"
              placeholder="e.g. Navy Blue"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />

            <div>
              <label
                htmlFor="clothing-season"
                className="mb-2 block text-sm font-semibold"
              >
                Season
              </label>
              <select
                id="clothing-season"
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-[#8872B3] focus:outline-none"
              >
                <option value="">Select season</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
                <option value="Rainy">Rainy</option>
                <option value="All Seasons">All Seasons</option>
              </select>
            </div>

            {message && (
              <p
                role="status"
                className="rounded-lg bg-[#E9E2F5] px-4 py-3 text-sm"
              >
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <Button size="medium" type="submit">
                Save Clothing Item
              </Button>

              <Link href="/user/wardrobe">
                <Button variant="outline" size="medium" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
