import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">

        <h1 className="text-2xl font-bold text-[#172A4B]">
          Verify Email
        </h1>

        <p className="mt-4 text-gray-600">
          This feature is currently under development.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-[#172A4B] px-6 py-3 text-white"
        >
          Back to Login
        </Link>

      </div>
    </main>
  );
}
