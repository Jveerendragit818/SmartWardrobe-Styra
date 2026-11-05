const stats = [
  { title: "Total Users", value: "—" },
  { title: "Wardrobe Items", value: "—" },
  { title: "Total Bookings", value: "—" },
  { title: "Pending Requests", value: "—" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-slate-500">
        Welcome to SmartWardrobe administration.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-medium text-slate-600">
              {stat.title}
            </h2>
            <p className="mt-4 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Activity
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          No recent activity available.
        </p>
      </section>
    </div>
  );
}