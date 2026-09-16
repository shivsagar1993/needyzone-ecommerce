"use client";
import { CustomButton, SectionTitle } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaShieldHalved, FaLock, FaStore } from "react-icons/fa6";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // Check if session expired
    const expired = searchParams.get("expired");
    if (expired === "true") {
      setError("Your administrative session has expired. Please log in again.");
      toast.error("Your administrative session has expired.");
    }

    // If admin is already authenticated, redirect straight to the admin dashboard
    if (sessionStatus === "authenticated") {
      router.replace("/admin");
    }
  }, [sessionStatus, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!isValidEmailAddressFormat(email)) {
      setError("Please enter a valid administrator email address.");
      toast.error("Invalid email format");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password is invalid");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        const errorMsg =
          res.error === "Access denied. Only administrators are permitted to log in."
            ? res.error
            : "Invalid administrator credentials or unauthorized account.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        toast.success("Welcome, Administrator!");
        router.replace("/admin");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      toast.error("Authentication error");
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SectionTitle title="Admin Portal" path="Home | Admin Portal" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <FaShieldHalved className="text-2xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Admin Portal Sign In
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Restricted access. This gateway is strictly reserved for store managers and authorized administrators.
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-10 shadow-lg border border-slate-200/80 rounded-3xl sm:px-10">
            <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-800">
              <FaLock className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Notice: </span>
                Customer accounts are not required. Ordering and quote requests are open to all visitors via instant pro-forma invoice generation.
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Admin Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@singitronic.com"
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 text-center">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  <FaShieldHalved className="text-xs" />
                  <span>{loading ? "Verifying..." : "Sign In to Admin Dashboard"}</span>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <FaStore className="text-xs" />
                <span>Return to Storefront Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
