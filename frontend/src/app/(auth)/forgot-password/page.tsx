
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import { getSupabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (error) {
        throw error;
      }

      setMessage(
        "If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder."
      );

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to send reset email."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-[#172A4B]">

      <div className="w-full max-w-md">

        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        <Card shadow="small">

          <div className="mb-6 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEE9FA]">

              <Mail
                size={30}
                className="text-[#8170C4]"
              />

            </div>

            <h1 className="text-2xl font-bold">
              Forgot Password
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Enter your registered email address
              to receive a password reset link.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-4 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-lg bg-green-50 p-4 text-sm text-green-700"
              >
                {message}
              </p>
            )}

            <Button
              type="submit"
              size="medium"
              disabled={loading}
              className="w-full"
            >

              <span className="inline-flex items-center gap-2">

                {loading && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {loading
                  ? "Sending..."
                  : "Send Reset Link"}

              </span>

            </Button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}

            <Link
              href="/login"
              className="font-semibold text-[#172A4B] hover:underline"
            >
              Sign In
            </Link>

          </p>

        </Card>

      </div>

    </main>
  );
}
