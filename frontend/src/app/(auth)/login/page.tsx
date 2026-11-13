
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      newErrors.email =
        "Enter a valid email address";
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
      const supabase = getSupabase();

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        setMessage(
          "Unable to create a login session."
        );
        return;
      }

      setMessage("Login successful!");

      router.replace("/user/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full min-w-0 items-center justify-center bg-[#F3F4F6] px-4 py-8 sm:py-12">

      <div className="mx-auto w-full min-w-0 max-w-md">

        {/* SmartWardrobe branding */}
        <div className="mb-6 text-center sm:mb-8">

          <Link
            href="/"
            className="inline-block max-w-full break-words text-2xl font-bold tracking-tight text-[#17233F] sm:text-3xl"
          >
            SmartWardrobe
          </Link>

          <p className="mt-3 text-sm text-gray-600">
            Your AI-Powered Fashion Companion
          </p>

        </div>

        {/* Login card */}
        <Card
          padding="small"
          shadow="medium"
          className="w-full min-w-0 max-w-full"
        >

          <div className="min-w-0 px-2 py-4 sm:p-4">

            <h1 className="text-center text-xl font-bold text-[#17233F] sm:text-2xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to manage your wardrobe.
            </p>

            {/* Login form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 w-full min-w-0 space-y-5 sm:mt-8"
            >

              {/* Email */}
              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                className="min-w-0 max-w-full"
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

              {/* Password */}
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                className="min-w-0 max-w-full"
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

              {/* Forgot password */}
              <div className="text-right">

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#17233F] hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Login status */}
              {message && (
                <p
                  role="status"
                  className="break-words rounded-lg bg-[#F3F0FA] p-3 text-sm text-[#17233F]"
                >
                  {message}
                </p>
              )}

              {/* Sign in button */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full min-w-0 max-w-full"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </Button>

            </form>

            {/* Registration link */}
            <p className="mt-6 text-center text-sm leading-relaxed text-gray-600">
              Don&apos;t have an account?{" "}

              <Link
                href="/register"
                className="font-semibold text-[#17233F] hover:underline"
              >
                Sign Up
              </Link>
            </p>

          </div>

        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          &copy; SmartWardrobe
        </p>

      </div>

    </main>
  );
}
