import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h2 className="text-xl font-bold mb-8">
        SmartWardrobe Admin
      </h2>

      <nav className="space-y-4">

        <Link href="/admin/dashboard" className="block hover:text-blue-400">
          Dashboard
        </Link>

        <Link href="/admin/categories" className="block hover:text-blue-400">
          Categories
        </Link>

        <Link href="/admin/clothing" className="block hover:text-blue-400">
          Clothing
        </Link>

        <Link href="/admin/consultations" className="block hover:text-blue-400">
          Consultations
        </Link>

        <Link href="/admin/orders" className="block hover:text-blue-400">
          Orders
        </Link>

        <Link href="/admin/users" className="block hover:text-blue-400">
          Users
        </Link>

        <Link href="/admin/reports" className="block hover:text-blue-400">
          Reports
        </Link>

      </nav>
    </aside>
  );
}