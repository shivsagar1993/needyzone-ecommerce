"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaRegUser, FaMagnifyingGlass, FaShieldHalved } from "react-icons/fa6";

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient.get("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((u) =>
    u?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u?.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                User Accounts
              </h1>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {users.length} Users
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage registered store members, role permissions, and administrative access.
            </p>
          </div>

          <div>
            <Link
              href="/admin/users/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <FaPlus className="text-xs" />
              <span>Add New User</span>
            </Link>
          </div>
        </div>

        {/* Card Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Search */}
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <div className="relative w-full max-w-sm">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by email or role..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">User Account</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">User ID</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const isAdmin = user?.role === "admin";
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                              <FaRegUser className="text-sm" />
                            </div>
                            <span className="font-bold text-slate-900 text-sm">
                              {user?.email}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <FaShieldHalved className="text-[10px]" />
                              Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                              {user?.role || "Customer"}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 font-mono text-slate-400 text-xs">
                          #{user?.id?.slice(0, 8)}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/admin/users/${user?.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors"
                          >
                            <FaEye className="text-[10px]" />
                            <span>Edit</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      No users found matching &quot;{searchQuery}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardUsers;
