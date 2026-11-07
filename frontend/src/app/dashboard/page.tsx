
import {
  Shirt,
  Layers,
  Grid2X2,
  Heart,
} from "lucide-react";

const summaryCards = [
  {
    title: "Total Clothes",
    count: 24,
    icon: Shirt,
  },
  {
    title: "Total Outfits",
    count: 12,
    icon: Layers,
  },
  {
    title: "Categories",
    count: 6,
    icon: Grid2X2,
  },
  {
    title: "Favorites",
    count: 8,
    icon: Heart,
  },
];

const recentClothing = [
  { id: 1, name: "White Shirt", category: "Tops", color: "White" },
  { id: 2, name: "Blue Jeans", category: "Bottoms", color: "Blue" },
  { id: 3, name: "Casual Dress", category: "Dresses", color: "Lavender" },
];

const recentOutfits = [
  { id: 1, name: "Casual Outfit", occasion: "Everyday" },
  { id: 2, name: "Office Outfit", occasion: "Work" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-[#172A4B]">
          My Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to your SmartWardrobe!
        </p>

        <section className="mt-8">
          <h2 className="mb-5 text-xl font-semibold text-[#172A4B]">
            Wardrobe Overview
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEE9FA]">
                    <Icon
                      className="text-[#8170C4]"
                      size={24}
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#172A4B]">
                    {card.count}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>
<section className="mt-10">
  <h2 className="mb-5 text-xl font-semibold text-[#172A4B]">
    Recent Clothing
  </h2>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {recentClothing.map((item) => (
      <div
        key={item.id}
        className="rounded-xl bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-[#EEE9FA]">
          <Shirt size={44} className="text-[#8170C4]" />
        </div>

        <h3 className="font-semibold text-[#172A4B]">
          {item.name}
        </h3>

        <p className="text-sm text-gray-500">
          Category: {item.category}
        </p>

        <p className="text-sm text-gray-500">
          Color: {item.color}
        </p>
      </div>
    ))}
  </div>
</section>

<section className="mt-10">
  <h2 className="mb-5 text-xl font-semibold text-[#172A4B]">
    Recent Outfits
  </h2>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    {recentOutfits.map((outfit) => (
      <div
        key={outfit.id}
        className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#EEE9FA]">
          <Layers size={28} className="text-[#8170C4]" />
        </div>

        <div>
          <h3 className="font-semibold text-[#172A4B]">
            {outfit.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Occasion: {outfit.occasion}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>
 </div>
    </main>
  );
}

