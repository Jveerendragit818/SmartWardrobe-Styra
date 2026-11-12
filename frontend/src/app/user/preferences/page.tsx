
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Save,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { apiRequest } from "@/lib/api";

// Available preference options
const colors = [
  "Black",
  "White",
  "Navy",
  "Blue",
  "Lavender",
  "Green",
  "Pink",
  "Beige",
];

const styles = [
  "Casual",
  "Formal",
  "Traditional",
  "Sporty",
  "Streetwear",
  "Minimal",
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

// Match backend schema
type Preferences = {
  preferred_colors: string[];
  preferred_styles: string[];
  usual_occasions: string[];
  disliked_colors: string[];
};

type PreferencesResponse = {
  data: Preferences | null;
  error: string | null;
};

const initialPreferences: Preferences = {
  preferred_colors: [],
  preferred_styles: [],
  usual_occasions: [],
  disliked_colors: [],
};

// Normalize values returned by backend
function normalizeValues(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .filter(
          (value): value is string =>
            typeof value === "string"
        )
        .map((value) =>
          value.trim().toLowerCase()
        )
        .filter(Boolean)
    )
  );
}

function normalizePreferences(
  data: Preferences
): Preferences {
  return {
    preferred_colors: normalizeValues(
      data.preferred_colors
    ),
    preferred_styles: normalizeValues(
      data.preferred_styles
    ),
    usual_occasions: normalizeValues(
      data.usual_occasions
    ),
    disliked_colors: normalizeValues(
      data.disliked_colors
    ),
  };
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function PreferencesPage() {
  const [preferences, setPreferences] =
    useState<Preferences>(initialPreferences);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  const [error, setError] =
    useState("");

  const [saved, setSaved] =
    useState(false);

  // Load preferences from backend
  async function loadPreferences() {
    setLoading(true);
    setLoadError("");
    setError("");
    setSaved(false);

    try {
      const response =
        await apiRequest<PreferencesResponse>(
          "/preferences"
        );

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error(
          "Unable to load your preferences."
        );
      }

      setPreferences(
        normalizePreferences(response.data)
      );

    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load preferences."
      );

    } finally {
      setLoading(false);
    }
  }

  // Load preferences when page opens
  useEffect(() => {
    void loadPreferences();
  }, []);

  // Select or deselect a preference
  function toggleOption(
    group: keyof Preferences,
    option: string
  ) {
    if (saving) return;

    const value = option.trim().toLowerCase();

    setPreferences((previous) => {
      const current = previous[group];

      const alreadySelected =
        current.includes(value);

      const updated: Preferences = {
        ...previous,
        [group]: alreadySelected
          ? current.filter(
              (item) => item !== value
            )
          : [...current, value],
      };

      // Prevent the same color from being
      // preferred and disliked at the same time
      if (!alreadySelected) {
        if (group === "preferred_colors") {
          updated.disliked_colors =
            updated.disliked_colors.filter(
              (item) => item !== value
            );
        }

        if (group === "disliked_colors") {
          updated.preferred_colors =
            updated.preferred_colors.filter(
              (item) => item !== value
            );
        }
      }

      return updated;
    });

    setSaved(false);
    setError("");
  }

  // Save preferences to backend
  async function savePreferences() {
    if (saving || loading || loadError) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      // Backend accepts a maximum of
      // 20 values in each preference group
      for (const values of Object.values(
        preferences
      )) {
        if (values.length > 20) {
          throw new Error(
            "Please select no more than 20 options in each section."
          );
        }
      }

      const response =
        await apiRequest<PreferencesResponse>(
          "/preferences",
          {
            method: "PUT",
            body: JSON.stringify(preferences),
          }
        );

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error(
          "Preferences could not be saved."
        );
      }

      setPreferences(
        normalizePreferences(response.data)
      );

      setSaved(true);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save preferences."
      );

    } finally {
      setSaving(false);
    }
  }

  // Clear selected preferences
  function clearPreferences() {
    if (saving) return;

    setPreferences({
      preferred_colors: [],
      preferred_styles: [],
      usual_occasions: [],
      disliked_colors: [],
    });

    setSaved(false);
    setError("");
  }

  const sections: {
    title: string;
    description: string;
    group: keyof Preferences;
    options: string[];
  }[] = [
    {
      title: "Preferred Colors",
      description:
        "Choose the colors you enjoy wearing.",
      group: "preferred_colors",
      options: colors,
    },
    {
      title: "Preferred Styles",
      description:
        "Select your favorite fashion styles.",
      group: "preferred_styles",
      options: styles,
    },
    {
      title: "Preferred Occasions",
      description:
        "Choose occasions you usually dress for.",
      group: "usual_occasions",
      options: occasions,
    },
    {
      title: "Disliked Colors",
      description:
        "Choose colors you prefer to avoid.",
      group: "disliked_colors",
      options: colors,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-[#172A4B]">

      <div className="mx-auto max-w-5xl">

        {/* Back navigation */}
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Page heading */}
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <SlidersHorizontal
            className="text-[#8170C4]"
          />

          My Style Preferences
        </h1>

        <p className="mt-2 text-gray-600">
          Choose your favorite colors, styles
          and occasions to personalize your
          outfit recommendations.
        </p>

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm"
          >
            <Loader2
              size={36}
              className="mx-auto mb-4 animate-spin text-[#8170C4]"
            />

            <p className="text-gray-600">
              Loading your preferences...
            </p>
          </div>
        )}

        {/* Loading error */}
        {!loading && loadError && (
          <div
            role="alert"
            className="mt-8 rounded-xl bg-red-50 p-5 text-red-700"
          >
            <div className="flex items-center gap-2">

              <AlertCircle size={20} />

              <h2 className="font-semibold">
                Unable to load preferences
              </h2>

            </div>

            <p className="mt-2 text-sm">
              {loadError}
            </p>

            <div className="mt-4">
              <Button
                type="button"
                size="medium"
                onClick={() =>
                  void loadPreferences()
                }
              >
                Try Again
              </Button>
            </div>

          </div>
        )}

        {/* Preference sections */}
        {!loading && !loadError && (
          <>

            <div className="mt-8 space-y-6">

              {sections.map((section) => {

                // Include any previously saved
                // options returned by backend
                const options = Array.from(
                  new Set([
                    ...section.options.map(
                      (option) =>
                        option.toLowerCase()
                    ),
                    ...preferences[section.group],
                  ])
                );

                return (
                  <Card
                    key={section.group}
                    shadow="small"
                  >

                    <div className="mb-5">

                      <h2 className="text-xl font-semibold">
                        {section.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        {section.description}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                      {options.map((option) => {

                        const selected =
                          preferences[
                            section.group
                          ].includes(option);

                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              toggleOption(
                                section.group,
                                option
                              )
                            }
                            aria-pressed={selected}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition disabled:opacity-60 ${
                              selected
                                ? "border-[#172A4B] bg-[#EEE9FA] font-medium text-[#172A4B]"
                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >

                            {selected && (
                              <Check size={15} />
                            )}

                            {formatLabel(option)}

                          </button>
                        );
                      })}

                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                      {
                        preferences[
                          section.group
                        ].length
                      } selected
                    </p>

                  </Card>
                );
              })}

            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">

              <Button
                type="button"
                size="medium"
                disabled={saving}
                onClick={savePreferences}
              >

                <span className="inline-flex items-center gap-2">

                  {saving ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={18} />
                  )}

                  {saving
                    ? "Saving Preferences..."
                    : "Save Preferences"}

                </span>

              </Button>

              <Button
                type="button"
                variant="outline"
                size="medium"
                disabled={saving}
                onClick={clearPreferences}
              >
                Clear All
              </Button>

            </div>

            {/* Save success */}
            {saved && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-lg bg-green-50 p-4 text-green-700"
              >

                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>

                  <p className="font-medium">
                    Preferences saved successfully!
                  </p>

                  <p className="mt-1 text-sm">
                    Your preferences are saved to
                    your account and can be used
                    for personalized outfit
                    recommendations.
                  </p>

                </div>

              </div>
            )}

            {/* Save error */}
            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-700"
              >

                <AlertCircle
                  size={20}
                  className="shrink-0"
                />

                <p className="text-sm">
                  {error}
                </p>

              </div>
            )}

            {/* Recommendation navigation */}
            <div className="mt-8 rounded-xl border border-[#E5DDF5] bg-[#F3F0FA] p-5">

              <h3 className="font-semibold">
                Discover personalized outfits
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Save your preferences and generate
                outfits based on your wardrobe
                and personal style.
              </p>

              <Link
                href="/user/recommendation"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-5 py-3 text-sm font-medium text-white hover:bg-[#283F65]"
              >
                Get Outfit Recommendations
              </Link>

            </div>

          </>
        )}

      </div>

    </main>
  );
}
