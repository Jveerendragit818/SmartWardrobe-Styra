
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    setMessage("");

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Connect to Supabase Auth or the agreed backend.
      // Do not navigate to the dashboard until authentication succeeds.
      setMessage(
        "Login form is ready. Authentication connection is pending."
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-[#17233F]"
          >
            SmartWardrobe
          </Link>

          <p className="mt-3 text-sm text-gray-600">
            Your AI-Powered Fashion Companion
          </p>
        </div>

        <Card padding="large" shadow="medium">
          <h1 className="text-center text-2xl font-bold text-[#17233F]">
            Welcome Back
          </h1>

          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your wardrobe.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  email: undefined,
                }));
              }}
              error={errors.email}
              required
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  password: undefined,
                }));
              }}
              error={errors.password}
              required
            />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#17233F] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {message && (
              <p
                role="status"
                className="rounded-lg bg-[#F3F0FA] p-3 text-sm text-[#17233F]"
              >
                {message}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#17233F] hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-500">
          © SmartWardrobe
        </p>
      </div>
    </main>
  );
}
