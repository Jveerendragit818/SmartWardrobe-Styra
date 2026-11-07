const stats = [
  { label: "Total Users", value: "125" },
  { label: "Wardrobe Items", value: "245" },
  { label: "Total Bookings", value: "36" },
  { label: "Pending Requests", value: "8" },
];

const users = [
  { name: "Rahul", email: "rahul@gmail.com" },
  { name: "Priya", email: "priya@gmail.com" },
  { name: "Anjali", email: "anjali@gmail.com" },
];

const activities = [
  {
    user: "Rahul",
    action: "Added a clothing item",
    time: "10 minutes ago",
  },
  {
    user: "Priya",
    action: "Booked a consultation",
    time: "30 minutes ago",
  },
  {
    user: "Anjali",
    action: "Updated her wardrobe",
    time: "1 hour ago",
  },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">

      {/* Dashboard Heading */}
      <h1 className="text-3xl font-bold text-slate-900">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-slate-500">
        Welcome to SmartWardrobe administration.
      </p>

      {/* Statistics Cards */}
      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-6 shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {stat.value}
            </h2>
          </div>
        ))}
      </section>

      {/* Recent Users and Recent Activity */}
      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent Users */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Users
          </h2>

          <div className="mt-4 space-y-4">
            {users.map((user) => (
              <div
                key={user.email}
                className="flex items-center justify-between border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {user.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Activity
          </h2>

          <div className="mt-4 space-y-5">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex gap-4 border-b border-slate-100 pb-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {activity.user.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {activity.user}
                  </p>

                  <p className="text-sm text-slate-600">
                    {activity.action}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}