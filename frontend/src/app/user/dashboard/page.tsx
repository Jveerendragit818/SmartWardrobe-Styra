
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Shirt,
  Sparkles,
  CalendarDays,
  Plane,
  Heart,
  MessageCircle,
  UserRound,
  Camera,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { apiRequest } from "@/lib/api";

// Dashboard feature cards
const dashboardFeatures = [
  {
    icon: Shirt,
    title: "My Wardrobe",
    description:
      "View and organize your clothing collection.",
    href: "/user/wardrobe",
  },
  {
    icon: Sparkles,
    title: "AI Stylist",
    description:
      "Discover personalized outfit recommendations.",
    href: "/user/recommendation",
  },
  {
    icon: Camera,
    title: "AI Clothing Recognition",
    description:
      "Upload clothing photos and identify clothing details.",
    href: "/user/wardrobe/recognition",
  },
  {
    icon: Heart,
    title: "Saved Outfits",
    description:
      "View and manage your favorite saved outfits.",
    href: "/user/saved-outfits",
  },
  {
    icon: CalendarDays,
    title: "Outfit Planner",
    description:
      "Plan your outfits for upcoming days.",
    href: "/user/outfit-planner",
  },
  {
    icon: Plane,
    title: "Trip Planner",
    description:
      "Organize outfits and packing ideas for trips.",
    href: "/user/trip-planner",
  },
  {
    icon: MessageCircle,
    title: "AI Fashion Chatbot",
    description:
      "Chat with Styra for personalized fashion suggestions.",
    href: "/user/chatbot",
  },
  {
    icon: UserRound,
    title: "Style Preferences",
    description:
      "Customize your favorite colors and fashion styles.",
    href: "/user/preferences",
  },
];

// API response types
type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  color?: string | null;
};

type SavedOutfit = {
  id: string;
  title?: string | null;
};

type Profile = {
  user_id: string;
  display_name: string | null;
};

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// Helper for displaying errors
function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to load data. Please try again.";
}

export default function DashboardPage() {
  const [wardrobeCount, setWardrobeCount] =
    useState<number | null>(null);

  const [savedOutfitCount, setSavedOutfitCount] =
    useState<number | null>(null);

  const [displayName, setDisplayName] =
    useState("");

  const [recentItems, setRecentItems] =
    useState<WardrobeItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [wardrobeError, setWardrobeError] =
    useState("");

  const [outfitError, setOutfitError] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  // Fetch real dashboard information
  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      setWardrobeError("");
      setOutfitError("");

      // Load all available APIs independently
      const results = await Promise.allSettled([
        apiRequest<ApiResponse<WardrobeItem[]>>(
          "/wardrobe",
          {
            method: "GET",
          }
        ),

        apiRequest<ApiResponse<SavedOutfit[]>>(
          "/saved-outfits",
          {
            method: "GET",
          }
        ),

        apiRequest<ApiResponse<Profile>>(
          "/profile",
          {
            method: "GET",
          }
        ),
      ]);

      if (!active) return;

      const [
        wardrobeResult,
        outfitResult,
        profileResult,
      ] = results;

      // Wardrobe information
      if (wardrobeResult.status === "fulfilled") {
        const response = wardrobeResult.value;

        if (
          !response.error &&
          Array.isArray(response.data)
        ) {
          setWardrobeCount(response.data.length);

          // Backend returns newest items first
          setRecentItems(
            response.data.slice(0, 4)
          );
        } else {
          setWardrobeCount(null);
          setRecentItems([]);

          setWardrobeError(
            response.error ||
              "Unable to load wardrobe items."
          );
        }
      } else {
        setWardrobeCount(null);
        setRecentItems([]);

        setWardrobeError(
          getErrorMessage(wardrobeResult.reason)
        );
      }

      // Saved outfit information
      if (outfitResult.status === "fulfilled") {
        const response = outfitResult.value;

        if (
          !response.error &&
          Array.isArray(response.data)
        ) {
          setSavedOutfitCount(
            response.data.length
          );
        } else {
          setSavedOutfitCount(null);

          setOutfitError(
            response.error ||
              "Unable to load saved outfits."
          );
        }
      } else {
        setSavedOutfitCount(null);

        setOutfitError(
          getErrorMessage(outfitResult.reason)
        );
      }

      // Profile information
      if (profileResult.status === "fulfilled") {
        const response = profileResult.value;

        if (!response.error && response.data) {
          setDisplayName(
            response.data.display_name?.trim() || ""
          );
        } else {
          setDisplayName("");
        }
      } else {
        // A missing profile should not stop
        // the rest of the dashboard from working.
        setDisplayName("");
      }

      setLoading(false);
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  function refreshDashboard() {
    if (!loading) {
      setRefreshKey((previous) => previous + 1);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#17233F]">

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        {/* Dashboard heading */}
        <section className="mb-10 flex flex-wrap items-start justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              My Dashboard
            </h1>

            <p className="mt-3 text-gray-600">
              {displayName
                ? `Welcome, ${displayName}!`
                : "Welcome to SmartWardrobe!"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Manage your style and explore your
              wardrobe features.
            </p>

          </div>

          <Button
            variant="outline"
            size="small"
            onClick={refreshDashboard}
            disabled={loading}
          >
            <span className="inline-flex items-center gap-2">

              <RefreshCw
                size={16}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh Dashboard"}

            </span>
          </Button>

        </section>

        {/* API error messages */}
        {(wardrobeError || outfitError) && (
          <section
            role="alert"
            className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >

            <div className="flex items-start gap-3">

              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>

                <p className="font-semibold">
                  Some dashboard information could
                  not be loaded.
                </p>

                {wardrobeError && (
                  <p className="mt-2">
                    Wardrobe: {wardrobeError}
                  </p>
                )}

                {outfitError && (
                  <p className="mt-2">
                    Saved outfits: {outfitError}
                  </p>
                )}

                <p className="mt-2">
                  Check your backend connection and
                  click Refresh Dashboard.
                </p>

              </div>

            </div>

          </section>
        )}

        {/* Dashboard summary cards */}
        <section className="mb-10 grid gap-5 sm:grid-cols-3">

          {/* Wardrobe count */}
          <Card shadow="small">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Wardrobe Items
              </p>

              <div className="rounded-xl bg-[#EEE9FA] p-3">
                <Shirt
                  size={23}
                  className="text-[#8170C4]"
                />
              </div>

            </div>

            <h2 className="mt-3 text-3xl font-bold">

              {loading ? (
                <Loader2
                  size={28}
                  className="animate-spin text-[#8170C4]"
                />
              ) : (
                wardrobeCount ?? "—"
              )}

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              {loading
                ? "Loading wardrobe..."
                : wardrobeCount === null
                  ? "Unable to load count"
                  : wardrobeCount === 0
                    ? "No items added yet"
                    : "Clothing items in your wardrobe"}

            </p>

            <Link
              href="/user/wardrobe"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#17233F] hover:underline"
            >
              View Wardrobe
              <ArrowRight size={15} />
            </Link>

          </Card>

          {/* Saved outfit count */}
          <Card shadow="small">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Saved Outfits
              </p>

              <div className="rounded-xl bg-[#EEE9FA] p-3">
                <Heart
                  size={23}
                  className="text-[#8170C4]"
                />
              </div>

            </div>

            <h2 className="mt-3 text-3xl font-bold">

              {loading ? (
                <Loader2
                  size={28}
                  className="animate-spin text-[#8170C4]"
                />
              ) : (
                savedOutfitCount ?? "—"
              )}

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              {loading
                ? "Loading saved outfits..."
                : savedOutfitCount === null
                  ? "Unable to load count"
                  : savedOutfitCount === 0
                    ? "No saved outfits yet"
                    : "Your saved outfit combinations"}

            </p>

            <Link
              href="/user/saved-outfits"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#17233F] hover:underline"
            >
              View Saved Outfits
              <ArrowRight size={15} />
            </Link>

          </Card>

          {/* Planned outfits */}
          <Card shadow="small">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Planned Outfits
              </p>

              <div className="rounded-xl bg-[#EEE9FA] p-3">
                <CalendarDays
                  size={23}
                  className="text-[#8170C4]"
                />
              </div>

            </div>

            <h2 className="mt-3 text-3xl font-bold">
              —
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Live outfit count not available yet
            </p>

            <Link
              href="/user/outfit-planner"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#17233F] hover:underline"
            >
              Open Outfit Planner
              <ArrowRight size={15} />
            </Link>

          </Card>

        </section>

        {/* Recent wardrobe items */}
        <section className="mb-10">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <h2 className="text-2xl font-bold">
              Recent Clothing Items
            </h2>

            <Link
              href="/user/wardrobe"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#17233F] hover:underline"
            >
              View All
              <ArrowRight size={16} />
            </Link>

          </div>

          {loading ? (

            <Card shadow="small">

              <div className="flex items-center justify-center gap-3 py-8">

                <Loader2
                  size={24}
                  className="animate-spin text-[#8170C4]"
                />

                <p className="text-sm text-gray-500">
                  Loading your clothing items...
                </p>

              </div>

            </Card>

          ) : wardrobeError ? (

            <Card shadow="small">

              <p className="py-6 text-center text-sm text-red-600">
                Unable to load recent clothing items.
              </p>

            </Card>

          ) : recentItems.length === 0 ? (

            <Card shadow="small">

              <div className="py-8 text-center">

                <Shirt
                  size={42}
                  className="mx-auto text-[#8170C4]"
                />

                <h3 className="mt-4 font-semibold">
                  Your wardrobe is empty
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first clothing item to
                  get started.
                </p>

                <Link
                  href="/user/wardrobe/add"
                  className="mt-5 inline-block rounded-lg bg-[#17233F] px-5 py-3 text-sm font-medium text-white hover:bg-[#26385F]"
                >
                  Add Clothing
                </Link>

              </div>

            </Card>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {recentItems.map((item) => (

                <Card
                  key={item.id}
                  shadow="small"
                >

                  <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-[#EEE9FA]">

                    <Shirt
                      size={40}
                      className="text-[#8170C4]"
                    />

                  </div>

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm capitalize text-gray-500">
                    Category: {item.category}
                  </p>

                  {item.color && (
                    <p className="mt-1 text-sm capitalize text-gray-500">
                      Color: {item.color}
                    </p>
                  )}

                  <Link
                    href={`/user/wardrobe/edit/${encodeURIComponent(item.id)}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#17233F] hover:underline"
                  >
                    Edit Clothing
                    <ArrowRight size={15} />
                  </Link>

                </Card>

              ))}

            </div>

          )}

        </section>

        {/* Dashboard features */}
        <section>

          <h2 className="mb-6 text-2xl font-bold">
            Explore Your Features
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {dashboardFeatures.map((feature) => {

              const FeatureIcon = feature.icon;

              return (

                <Card
                  key={feature.title}
                  shadow="small"
                >

                  <div className="flex h-full flex-col">

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#EEE9FA]">

                      <FeatureIcon
                        size={28}
                        className="text-[#8170C4]"
                      />

                    </div>

                    <h3 className="mb-3 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mb-6 flex-1 text-sm leading-6 text-gray-600">
                      {feature.description}
                    </p>

                    <Link
                      href={feature.href}
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#17233F] px-4 py-2 text-sm font-medium text-[#17233F] transition hover:bg-[#F3F0FA]"
                    >
                      Explore
                      <ArrowRight size={15} />
                    </Link>

                  </div>

                </Card>

              );
            })}

          </div>

        </section>

      </main>

    </div>
  );
}
