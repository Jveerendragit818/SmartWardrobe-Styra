"use client";

import { useState } from "react";

const sections = [
  {
    title: "Dashboard",
    icon: "⌂",
  },
  {
    title: "My Wardrobe",
    icon: "👕",
    children: [
      "Tops",
      "Bottoms",
      "Dresses",
      "Shoes",
      "Accessories",
      "Other",
    ],
  },
  { title: "Outfit Generator", icon: "✨" },
  { title: "AI Stylist", icon: "🤖" },
  { title: "Trip Planner", icon: "🧳" },
  { title: "Packing List", icon: "🎒" },
  { title: "Wardrobe Analytics", icon: "📊" },
  { title: "Laundry", icon: "🧺" },
  { title: "Fashion Influencer", icon: "📸" },
  { title: "Profile", icon: "👤" },
];

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="min-h-screen bg-[#100f17] text-white">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-white/10 bg-[#171620] p-5">
          <h1 className="mb-2 text-xl font-bold">
            ✨ SmartWardrobe
          </h1>
          <p className="mb-8 text-xs text-gray-400">
            Your personal AI fashion assistant
          </p>

          <button
            onClick={() => {
              setActive("Dashboard");
              setShowLogin(false);
            }}
            className="mb-2 w-full rounded-xl bg-purple-600 p-3 text-left font-semibold"
          >
            ⌂ Dashboard
          </button>

          <p className="mb-3 mt-6 text-xs uppercase tracking-widest text-gray-500">
            Your closet
          </p>

          {sections.slice(1).map((section) => (
            <div key={section.title}>
              <button
                onClick={() => {
                  setActive(section.title);
                  setShowLogin(false);
                }}
                className={`mb-1 w-full rounded-xl p-3 text-left text-sm transition ${
                  active === section.title
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <span className="mr-3">{section.icon}</span>
                {section.title}
              </button>

              {section.children && (
                <div className="mb-3 ml-7 border-l border-white/10 pl-3">
                  {section.children.map((child) => (
                    <button
                      key={child}
                      onClick={() => {
                        setActive(child);
                        setShowLogin(false);
                      }}
                      className={`block w-full rounded-lg px-2 py-2 text-left text-sm ${
                        active === child
                          ? "text-purple-300"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => setShowLogin(true)}
            className="mt-6 w-full rounded-xl border border-white/10 p-3 text-sm hover:bg-white/5"
          >
            Login / Signup
          </button>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5 md:px-10">
            <div>
              <p className="text-sm text-gray-400">
                SmartWardrobe / {active}
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                {active}
              </h2>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold hover:bg-purple-500"
            >
              Get Started
            </button>
          </header>

          <div className="p-6 md:p-10">
            {showLogin ? (
              <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#1b1a26] p-8">
                <h3 className="text-2xl font-bold">
                  Welcome to SmartWardrobe
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Enter your email to get started.
                </p>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    alert(
                      "Login is a UI demo. Authentication still needs to be connected."
                    );
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-[#100f17] p-3 outline-none focus:border-purple-500"
                  />
                  <button className="w-full rounded-xl bg-purple-600 p-3 font-semibold">
                    Continue
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="rounded-3xl bg-gradient-to-r from-purple-800 to-indigo-900 p-8 md:p-12">
                  <p className="text-sm font-medium text-purple-200">
                    YOUR STYLE, SIMPLIFIED
                  </p>
                  <h3 className="mt-4 max-w-2xl text-3xl font-bold md:text-5xl">
                    Dress smarter. Every day.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-gray-200 md:text-base">
                    Organize your clothes, discover outfit combinations,
                    and plan what to wear for every occasion.
                  </p>
                  <button
                    onClick={() => setActive("My Wardrobe")}
                    className="mt-7 rounded-xl bg-white px-5 py-3 font-semibold text-purple-900 hover:bg-gray-100"
                  >
                    Explore My Wardrobe →
                  </button>
                </div>

                <div className="mt-10 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">
                    Explore your wardrobe
                  </h3>
                  <span className="text-sm text-gray-400">
                    10 features
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {sections.slice(1).map((section) => (
                    <button
                      key={section.title}
                      onClick={() => setActive(section.title)}
                      className="rounded-2xl border border-white/10 bg-[#1b1a26] p-6 text-left transition hover:-translate-y-1 hover:border-purple-500"
                    >
                      <span className="text-3xl">
                        {section.icon}
                      </span>
                      <h4 className="mt-4 font-semibold">
                        {section.title}
                      </h4>
                      <p className="mt-2 text-sm text-gray-400">
                        {section.title === "My Wardrobe"
                          ? "Manage clothes, shoes and accessories."
                          : section.title === "Outfit Generator"
                          ? "Discover combinations for every occasion."
                          : section.title === "AI Stylist"
                          ? "Explore personalized style suggestions."
                          : section.title === "Trip Planner"
                          ? "Plan outfits for your next adventure."
                          : section.title === "Packing List"
                          ? "Prepare your travel essentials."
                          : `Explore your ${section.title.toLowerCase()} tools.`}
                      </p>
                    </button>
                  ))}
                </div>

                {active !== "Dashboard" && (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-[#1b1a26] p-6">
                    <h3 className="text-xl font-semibold">
                      {active}
                    </h3>
                    <p className="mt-2 text-gray-400">
                      This section is ready for its next development
                      step. Select another feature from the sidebar
                      to explore the layout.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}