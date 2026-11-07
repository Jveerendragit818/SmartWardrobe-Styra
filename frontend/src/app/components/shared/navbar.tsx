
import Link from "next/link";
import Button from "@/components/shared/Button";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-[#17233F]"
        >
          SmartWardrobe
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-[#17233F] hover:text-[#77649B]"
          >
            Home
          </Link>

          <Link
            href="/login"
            className="text-sm font-medium text-[#17233F] hover:text-[#77649B]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="text-sm font-medium text-[#17233F] hover:text-[#77649B]"
          >
            Sign Up
          </Link>

          <Link
            href="/user/dashboard"
            className="text-sm font-medium text-[#17233F] hover:text-[#77649B]"
          >
            Dashboard
          </Link>

          <Link href="/user/wardrobe">
            <Button size="small">My Wardrobe</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
