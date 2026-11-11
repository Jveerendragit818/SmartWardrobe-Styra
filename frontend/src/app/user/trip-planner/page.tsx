
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Plane,
  Sparkles,
} from "lucide-react";

type PackingItem = {
  id: number;
  name: string;
  packed: boolean;
};

export default function TripPlannerPage() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [tripType, setTripType] = useState("Casual");
  const [season, setSeason] = useState("Summer");
  const [packingList, setPackingList] = useState<PackingItem[]>([]);
  const [generated, setGenerated] = useState(false);

  function generatePackingList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = Math.max(1, Math.min(30, days));

    const suggestions = [
      `${quantity} comfortable tops or T-shirts`,
      `${Math.max(1, Math.ceil(quantity / 2))} bottoms`,
      "Underwear and socks",
      "Comfortable walking shoes",
      "Toiletries and personal essentials",
      "Travel documents and chargers",
    ];

    if (season === "Winter") {
      suggestions.push("Warm jacket or sweater");
    }

    if (season === "Rainy") {
      suggestions.push("Raincoat or umbrella");
    }

    if (season === "Summer") {
      suggestions.push("Sun hat and sunscreen");
    }

    if (tripType === "Formal") {
      suggestions.push("Formal outfit and suitable shoes");
    }

    if (tripType === "Beach") {
      suggestions.push("Beachwear and sandals");
    }

    if (tripType === "Adventure") {
      suggestions.push("Comfortable outdoor clothing");
    }

    setPackingList(
      suggestions.map((name, index) => ({
        id: index + 1,
        name,
        packed: false,
      }))
    );

    setGenerated(true);
  }

  function togglePacked(id: number) {
    setPackingList((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  const packedCount = packingList.filter((item) => item.packed).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#172A4B] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#172A4B]">
          <Plane className="text-[#8170C4]" />
          Trip Planner & Packing Assistant
        </h1>

        <p className="mt-2 text-gray-600">
          Create a packing checklist for your next trip.
        </p>

        <form
          onSubmit={generatePackingList}
          className="mt-8 rounded-xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#172A4B]">
            <Sparkles size={20} />
            Plan Your Trip
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="destination" className="mb-2 block text-sm font-medium">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="e.g. Goa"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#172A4B]"
              />
            </div>

            <div>
              <label htmlFor="days" className="mb-2 block text-sm font-medium">
                Trip Duration (Days)
              </label>
              <input
                id="days"
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#172A4B]"
              />
            </div>

            <div>
              <label htmlFor="tripType" className="mb-2 block text-sm font-medium">
                Trip Type
              </label>
              <select
                id="tripType"
                value={tripType}
                onChange={(event) => setTripType(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#172A4B]"
              >
                <option>Casual</option>
                <option>Formal</option>
                <option>Beach</option>
                <option>Adventure</option>
              </select>
            </div>

            <div>
              <label htmlFor="season" className="mb-2 block text-sm font-medium">
                Season
              </label>
              <select
                id="season"
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#172A4B]"
              >
                <option>Summer</option>
                <option>Winter</option>
                <option>Rainy</option>
                <option>All Seasons</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-6 py-3 font-medium text-white hover:bg-[#283F65]"
          >
            <ClipboardList size={19} />
            Generate Packing List
          </button>
        </form>

        {generated && (
          <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#172A4B]">
              <CheckCircle2 className="text-[#8170C4]" size={22} />
              Packing Checklist
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {destination} • {days} days • {tripType} • {season}
            </p>

            <p className="mt-4 text-sm font-medium text-[#172A4B]">
              Packed {packedCount} of {packingList.length} items
            </p>

            <div className="mt-5 space-y-3">
              {packingList.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={() => togglePacked(item.id)}
                    className="h-4 w-4 accent-[#172A4B]"
                  />

                  <span
                    className={
                      item.packed
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    }
                  >
                    {item.name}
                  </span>
                </label>
              ))}
            </div>

            <p className="mt-5 text-xs text-gray-500">
              This is a sample packing list based on your selections.
              It does not yet use AI or live destination weather.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
