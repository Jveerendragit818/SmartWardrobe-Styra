
import Link from "next/link";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";

const features = [
  {
    icon: "👗",
    title: "Digital Wardrobe",
    description:
      "Organize your clothes and manage your wardrobe in one place.",
  },
  {
    icon: "✨",
    title: "AI Outfit Recommendations",
    description:
      "Explore personalized outfit suggestions for different occasions.",
  },
  {
    icon: "🧳",
    title: "Trip Planner",
    description:
      "Plan outfits and create packing lists for your trips.",
  },
  {
    icon: "📅",
    title: "Outfit Planner",
    description:
      "Plan your daily outfits and organize your weekly looks.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#17233F]">
      {/* Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            SmartWardrobe
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/user/dashboard"
              className="text-sm font-medium hover:text-[#77649B]"
            >
              Dashboard
            </Link>

            <Link href="/user/wardrobe">
              <Button size="small">My Wardrobe</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 md:py-28">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block rounded-full bg-[#E9E2F5] px-4 py-2 text-sm font-medium">
              Your AI-Powered Fashion Companion
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Your Wardrobe,
              <span className="block text-[#8872B3]">
                Smarter Every Day
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Organize your clothing, discover outfit ideas,
              plan your looks, and make everyday styling easier
              with SmartWardrobe.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/user/dashboard">
                <Button size="large">Get Started</Button>
              </Link>

              <Link href="/user/wardrobe">
                <Button variant="outline" size="large">
                  Explore Wardrobe
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">
                Explore SmartWardrobe Features
              </h2>
              <p className="mt-3 text-gray-600">
                Everything you need to manage your style.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} shadow="small">
                  <div className="mb-5 text-4xl" aria-hidden="true">
                    {feature.icon}
                  </div>

                  <h3 className="mb-3 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-5 py-6 text-center text-sm text-gray-500">
        © 2026 SmartWardrobe. All rights reserved.
      </footer>
    </div>
  );
}
