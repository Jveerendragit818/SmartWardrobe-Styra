
import Link from "next/link";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";

const dashboardFeatures = [
  {
    icon: "👗",
    title: "My Wardrobe",
    description: "View and organize your clothing collection.",
    href: "/user/wardrobe",
  },
  {
    icon: "✨",
    title: "AI Stylist",
    description: "Discover personalized outfit recommendations.",
    href: "/user/ai-stylist",
  },
  {
    icon: "📅",
    title: "Outfit Planner",
    description: "Plan your outfits for upcoming days.",
    href: "/user/outfit-planner",
  },
  {
    icon: "🧳",
    title: "Trip Planner",
    description: "Organize outfits and packing ideas for trips.",
    href: "/user/trip-planner",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#17233F]">
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <section className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">
            My Dashboard
          </h1>
          <p className="mt-3 text-gray-600">
            Welcome to SmartWardrobe! Manage your style
            and explore your wardrobe features.
          </p>
        </section>

        <section className="mb-10 grid gap-5 sm:grid-cols-3">
          <Card shadow="small">
            <p className="text-sm text-gray-500">Wardrobe Items</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
            <p className="mt-2 text-sm text-gray-500">
              No items added yet
            </p>
          </Card>

          <Card shadow="small">
            <p className="text-sm text-gray-500">Saved Outfits</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
            <p className="mt-2 text-sm text-gray-500">
              No saved outfits yet
            </p>
          </Card>

          <Card shadow="small">
            <p className="text-sm text-gray-500">Planned Outfits</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
            <p className="mt-2 text-sm text-gray-500">
              No outfits planned yet
            </p>
          </Card>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold">
            Explore Your Features
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardFeatures.map((feature) => (
              <Card key={feature.title} shadow="small">
                <div className="mb-4 text-4xl" aria-hidden="true">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mb-6 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>

                <Link href={feature.href}>
                  <Button variant="outline" size="small">
                    Explore
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
