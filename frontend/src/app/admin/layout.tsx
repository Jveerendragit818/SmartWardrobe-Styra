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
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/wardrobe">Wardrobe Items</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/requests">Requests</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}