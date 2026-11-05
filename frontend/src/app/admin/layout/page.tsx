import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="w-full bg-slate-900 p-6 text-white md:min-h-screen md:w-64">
        <h2 className="mb-8 text-2xl font-bold">
          SmartWardrobe
        </h2>

        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/clothing">Wardrobe Items</Link>
          <Link href="/admin/consultations">Consultations</Link>
          <Link href="/admin/reports">Reports</Link>
        </nav>
      </aside>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}