"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isValidEmailAddressFormat } from "@/lib/utils";
import apiClient from "@/lib/api";
import {
  FaArrowLeft,
  FaFloppyDisk,
  FaTrashCan,
  FaUserGear,
  FaEnvelope,
  FaLock,
  FaShieldHalved,
} from "react-icons/fa6";

interface DashboardUserDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleUserPage = ({ params }: DashboardUserDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [userInput, setUserInput] = useState<{
    email: string;
    newPassword: string;
    role: string;
  }>({
    email: "",
    newPassword: "",
    role: "user",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const deleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user account?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await apiClient.delete(`/api/users/${id}`);
      if (response.status === 204) {
        toast.success("User deleted successfully");
        router.push("/admin/users");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Network error while deleting user");
    } finally {
      setDeleting(false);
    }
  };

  const updateUser = async () => {
    if (!userInput.email) {
      toast.error("Please provide an email address");
      return;
    }

    if (!isValidEmailAddressFormat(userInput.email)) {
      toast.error("Invalid email address format");
      return;
    }

    if (userInput.newPassword && userInput.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        email: userInput.email,
        role: userInput.role,
      };
      if (userInput.newPassword) {
        payload.password = userInput.newPassword;
      }

      const response = await apiClient.put(`/api/users/${id}`, payload);

      if (response.status === 200) {
        toast.success("User updated successfully");
        setUserInput((prev) => ({ ...prev, newPassword: "" }));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error while updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Network error while updating user");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    apiClient
      .get(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserInput({
          email: data?.email || "",
          newPassword: "",
          role: data?.role || "user",
        });
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, [id]);

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
                Edit User Account
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Modify account credentials, roles, and administrative privileges.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              onClick={deleteUser}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200/60 transition-colors"
            >
              <FaTrashCan className="text-xs" />
              <span>{deleting ? "Deleting..." : "Delete User"}</span>
            </button>
            <button
              onClick={updateUser}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <FaFloppyDisk className="text-xs" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <FaUserGear className="text-base" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">User Profile Settings</h2>
              <p className="text-xs font-mono text-slate-400">ID: {id}</p>
            </div>
          </div>

          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="email"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={userInput.email}
                  onChange={(e) =>
                    setUserInput({ ...userInput, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                New Password (leave empty to keep current)
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="password"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="Enter new password if changing"
                  value={userInput.newPassword}
                  onChange={(e) =>
                    setUserInput({ ...userInput, newPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Role & Permissions
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
          </div>

          {/* Danger Area */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-rose-600">Delete Account</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Permanently revoke user access and credentials.
              </p>
            </div>

            <button
              type="button"
              onClick={deleteUser}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition-colors active:scale-95 disabled:opacity-50"
            >
              Delete User
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSingleUserPage;
