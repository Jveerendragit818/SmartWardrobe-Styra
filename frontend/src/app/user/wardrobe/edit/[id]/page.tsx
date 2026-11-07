
"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

const clothingItems = [
  {
    id: "1",
    name: "White Shirt",
    category: "Tops",
    color: "White",
    season: "Summer",
    occasion: "Casual",
  },
  {
    id: "2",
    name: "Blue Jeans",
    category: "Bottoms",
    color: "Blue",
    season: "All Seasons",
    occasion: "Casual",
  },
  {
    id: "3",
    name: "Casual Dress",
    category: "Dresses",
    color: "Lavender",
    season: "Summer",
    occasion: "Party",
  },
];

const categories = [
  "Tops", "Shirts", "T-Shirts", "Denims",
  "Bottoms", "Dresses", "Ethnic Wear",
  "Active Wear", "Footwear", "Accessories",
];

function EditClothingForm() {
  const params = useParams<{ id: string }>();
  const item = clothingItems.find(
    (clothing) => clothing.id === params.id
  );

  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [color, setColor] = useState(item?.color ?? "");
  const [season, setSeason] = useState(item?.season ?? "");
  const [occasion, setOccasion] = useState(item?.occasion ?? "");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !category || !color.trim() || !season || !occasion) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setMessage(
      "Changes validated successfully! Database saving will be connected later."
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold">Clothing item not found</h1>
        <Link href="/user/wardrobe" className="text-blue-700 underline">
          Back to Wardrobe
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/user/wardrobe"
          className="mb-6 inline-block text-[#172A4B] hover:underline"
        >
          ← Back to Wardrobe
        </Link>

        <h1 className="mb-6 text-3xl font-bold text-[#172A4B]">
          Edit Clothing Item
        </h1>

        <Card shadow="small">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Clothing Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <div>
              <label htmlFor="edit-category" className="mb-2 block text-sm font-semibold">
                Category
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                {categories.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <Input
              label="Color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />

            <div>
              <label htmlFor="edit-season" className="mb-2 block text-sm font-semibold">
                Season
              </label>
              <select
                id="edit-season"
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                {["Summer", "Winter", "Rainy", "All Seasons"].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-occasion" className="mb-2 block text-sm font-semibold">
                Occasion
              </label>
              <select
                id="edit-occasion"
                value={occasion}
                onChange={(event) => setOccasion(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                {["Casual", "Office", "Party", "Wedding", "Festival", "Sports"].map(
                  (value) => (
                    <option key={value} value={value}>{value}</option>
                  )
                )}
              </select>
            </div>

            {message && (
              <p role="status" className="rounded-lg bg-[#EEE9FA] p-3 text-sm">
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <Button type="submit" size="medium">
                Save Changes
              </Button>

              <Link href="/user/wardrobe">
                <Button type="button" variant="outline" size="medium">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default function EditClothingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-6">
        Loading clothing details...
      </div>
    }>
      <EditClothingForm />
    </Suspense>
  );
}
