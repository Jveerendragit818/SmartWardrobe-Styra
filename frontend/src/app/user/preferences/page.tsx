
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Save, SlidersHorizontal } from "lucide-react";

const colors = ["Black", "White", "Navy", "Blue", "Lavender", "Green", "Pink", "Beige"];
const styles = ["Casual", "Formal", "Traditional", "Sporty", "Streetwear", "Minimal"];
const occasions = ["Casual", "Office", "Party", "Festival", "Wedding", "Travel"];

type Preferences = {
  colors: string[];
  styles: string[];
  occasions: string[];
};

const initialPreferences: Preferences = {
  colors: [],
  styles: [],
  occasions: [],
};

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [saved, setSaved] = useState(false);

  function toggleOption(group: keyof Preferences, value: string) {
    setPreferences((previous) => {
      const current = previous[group];
      return {
        ...previous,
        [group]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
    setSaved(false);
  }

  function savePreferences() {
    localStorage.setItem("smartwardrobe-preferences", JSON.stringify(preferences));
    setSaved(true);
  }

  function loadPreferences() {
    try {
      const stored = localStorage.getItem("smartwardrobe-preferences");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed.colors) &&
          Array.isArray(parsed.styles) &&
          Array.isArray(parsed.occasions)
        ) {
          setPreferences(parsed);
        }
      }
    } catch {
      console.error("Could not load saved preferences.");
    }
  }

  // Load saved preferences once after the page mounts.
  useState(() => {
    if (typeof window !== "undefined") {
      loadPreferences();
    }
  });

  const sections: {
    title: string;
    group: keyof Preferences;
    options: string[];
  }[] = [
    { title: "Preferred Colors", group: "colors", options: colors },
    { title: "Preferred Styles", group: "styles", options: styles },
    { title: "Preferred Occasions", group: "occasions", options: occasions },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/user/dashboard" className="mb-6 inline-flex items-center gap-2 text-[#172A4B]">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#172A4B]">
          <SlidersHorizontal className="text-[#8170C4]" />
          My Style Preferences
        </h1>
        <p className="mt-2 text-gray-600">
          Choose your favorite colors, styles and occasions.
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.group} className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-[#172A4B]">
                {section.title}
              </h2>

              <div className="flex flex-wrap gap-3">
                {section.options.map((option) => {
                  const selected = preferences[section.group].includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleOption(section.group, option)}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                        selected
                          ? "border-[#172A4B] bg-[#EEE9FA] text-[#172A4B]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {selected && <Check size={15} />}
                      {option}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <button
          type="button"
          onClick={savePreferences}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#172A4B] px-6 py-3 font-medium text-white hover:bg-[#283F65]"
        >
          <Save size={18} />
          Save Preferences
        </button>

        {saved && (
          <p role="status" className="mt-4 text-sm font-medium text-green-700">
            Preferences saved successfully in this browser!
          </p>
        )}
      </div>
    </main>
  );
}
