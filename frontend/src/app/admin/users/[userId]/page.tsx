"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminUserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();

  const details = [
    { label: "Name", value: "—" },
    { label: "Email", value: "—" },
    { label: "Registration date", value: "—" },
    { label: "Account status", value: "—" },
  ];

  return (
    <section className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex text-sm font-medium text-blue-700 hover:text-blue-900"
      >
        ← Back to users
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-slate-900">User Details</h1>
        <p className="mt-2 text-sm text-slate-600">
          Account information for this user.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">User ID</dt>
            <dd className="mt-1 break-all text-sm text-slate-900">{userId}</dd>
          </div>

          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-sm font-medium text-slate-500">
                {detail.label}
              </dt>
              <dd className="mt-1 text-sm text-slate-900">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}