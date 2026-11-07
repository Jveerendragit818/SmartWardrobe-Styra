"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "AI Monitoring", href: "/admin/ai-monitoring" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Clothing", href: "/admin/clothing" },
    { name: "Consultations", href: "/admin/consultations" },
    { name: "Events", href: "/admin/events" },
    { name: "Feedback", href: "/admin/feedback" },
    { name: "Notifications", href: "/admin/notifications" },
    { name: "Recommendations", href: "/admin/recommendations" },
    { name: "Reports", href: "/admin/reports" },
    { name: "Services", href: "/admin/services" },
  ];

  // Hide sidebar on admin login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">

      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-8">
          SmartWardrobe
        </h1>

        <p className="text-slate-400 text-sm mb-4">
          ADMIN MENU
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>

    </div>
  );
}