"use client";
import { DashboardSidebar } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { sanitizeFormData } from "@/lib/form-sanitize";
import apiClient from "@/lib/api";
import { FaArrowLeft, FaPlus, FaUserPlus, FaEnvelope, FaLock, FaShieldHalved } from "react-icons/fa6";

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
    role: string;
  }>({
    email: "",
    password: "",
    role: "user",
  });
  const [submitting, setSubmitting] = useState(false);

  const addNewUser = async () => {
    if (!userInput.email || !userInput.password) {
      toast.error("Please fill in email and password");
      return;
    }

    if (!isValidEmailAddressFormat(userInput.email)) {
      toast.error("Invalid email address format");
      return;
    }

    if (userInput.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      const sanitizedUserInput = sanitizeFormData(userInput);
      const response = await apiClient.post(`/api/users`, sanitizedUserInput);

      if (response.status === 201) {
        toast.success("User account created successfully");
        setUserInput({
          email: "",
          password: "",
          role: "user",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error while creating user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Network error while creating user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/users"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaArrowLeft className="text-xs" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Create User Account
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Add an administrative staff member or customer account to the platform.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Link
              href="/admin/users"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FaUserPlus className="text-base" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">User Credentials</h2>
                <p className="text-xs text-slate-400">Set sign-in credentials and access permissions</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="email"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="user@example.com"
                  value={userInput.email}
                  onChange={(e) =>
                    setUserInput({ ...userInput, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password * (min. 8 characters)
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="password"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="••••••••"
                  value={userInput.password}
                  onChange={(e) =>
                    setUserInput({ ...userInput, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Platform Role & Access
              </label>
              <div className="relative">
                <FaShieldHalved className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <select
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={userInput.role}
                  onChange={(e) =>
                    setUserInput({ ...userInput, role: e.target.value })
                  }
                >
                  <option value="user">Customer (user)</option>
                  <option value="admin">Administrator (admin)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={addNewUser}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
                <span>{submitting ? "Creating..." : "Create User Account"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardCreateNewUser;
