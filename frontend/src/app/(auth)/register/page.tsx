
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setMessage("");

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Connect to Supabase Auth or the agreed backend.
      // Do not create a fake account or redirect before success.
      setMessage(
        "Signup form is ready. Authentication connection is pending."
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
            Create Account
          </h1>

          <p className="mt-2 text-center text-sm text-gray-600">
            Join SmartWardrobe and organize your style.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-5"
          >
            <Input
              id="register-email"
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
              id="register-password"
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
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

            <Input
              id="confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  confirmPassword: undefined,
                }));
              }}
              error={errors.confirmPassword}
              required
            />

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
              {loading ? "Please wait..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#17233F] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
