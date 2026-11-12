
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import {
  LockKeyhole,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import { getSupabase } from "@/lib/supabase";

export default function ResetPasswordPage() {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [recoveryReady, setRecoveryReady] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check the password recovery session
  useEffect(() => {

    let active = true;

    const recoveryLink =
      new URLSearchParams(
        window.location.hash.substring(1)
      ).get("type") === "recovery";

    const supabase = getSupabase();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {

        if (!active) return;

        if (
          event === "PASSWORD_RECOVERY" &&
          session
        ) {
          setRecoveryReady(true);
          setChecking(false);
          setError("");
        }
      }
    );

    async function checkSession() {

      try {

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          throw error;
        }

        if (session && recoveryLink) {
          setRecoveryReady(true);
        }

      } catch (error) {

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to verify reset link."
          );
        }

      } finally {

        if (active) {
          setChecking(false);
        }

      }
    }

    checkSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };

  }, []);

  // Update password in Supabase
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();
    setError("");

    if (!recoveryReady) {
      setError(
        "Please open a valid password reset link."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {

      const supabase = getSupabase();

      const { error } =
        await supabase.auth.updateUser({
          password: password,
        });

      if (error) {
        throw error;
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      // End the recovery session
      await supabase.auth.signOut({
        scope: "local",
      });

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Unable to reset password."
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-[#172A4B]">

      <div className="w-full max-w-md">

        <Card shadow="small">

          {/* Page heading */}
          <div className="mb-6 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEE9FA]">

              <LockKeyhole
                size={30}
                className="text-[#8170C4]"
              />

            </div>

            <h1 className="text-2xl font-bold">
              Reset Password
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Create a new password for your
              SmartWardrobe account.
            </p>

          </div>

          {/* Checking recovery session */}
          {checking && (

            <div
              role="status"
              className="py-6 text-center"
            >

              <Loader2
                size={32}
                className="mx-auto mb-3 animate-spin text-[#8170C4]"
              />

              <p className="text-sm text-gray-600">
                Verifying password reset link...
              </p>

            </div>

          )}

          {/* Password successfully updated */}
          {success && (

            <div className="space-y-5 text-center">

              <div className="rounded-lg bg-green-50 p-5 text-green-700">

                <CheckCircle2
                  size={36}
                  className="mx-auto mb-3"
                />

                <h2 className="font-semibold">
                  Password Reset Successful!
                </h2>

                <p className="mt-2 text-sm">
                  Your password has been updated.
                  You can now sign in with your
                  new password.
                </p>

              </div>

              <Link
                href="/login"
                className="block rounded-lg bg-[#172A4B] px-5 py-3 text-white hover:bg-[#283F65]"
              >
                Back to Login
              </Link>

            </div>

          )}

          {/* Invalid or expired link */}
          {!checking &&
            !recoveryReady &&
            !success && (

              <div className="space-y-5">

                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-4 text-sm text-red-600"
                >
                  {error ||
                    "Your password reset link is invalid or expired. Please request a new link."}
                </p>

                <Link
                  href="/forgot-password"
                  className="block rounded-lg bg-[#172A4B] px-5 py-3 text-center text-white"
                >
                  Request New Reset Link
                </Link>

                <Link
                  href="/login"
                  className="block text-center text-sm font-medium hover:underline"
                >
                  Back to Login
                </Link>

              </div>

            )}

          {/* Reset password form */}
          {!checking &&
            recoveryReady &&
            !success && (

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <p className="text-xs text-gray-500">
                  Use at least 8 characters.
                </p>

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
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
                      ? "Updating..."
                      : "Reset Password"}

                  </span>

                </Button>

              </form>

            )}

        </Card>

      </div>

    </main>

  );
}
