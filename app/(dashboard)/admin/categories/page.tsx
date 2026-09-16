"use client";
import { DashboardSidebar } from "@/components";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import { FaPlus, FaEye, FaFolderOpen, FaMagnifyingGlass } from "react-icons/fa6";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient.get("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
                Store Categories
              </h1>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {categories.length} Departments
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Organize product departments, navigation hierarchies, and filter taxonomies.
            </p>
          </div>

          <div>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <FaPlus className="text-xs" />
              <span>Add New Category</span>
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
                placeholder="Search category name..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Department Name</th>
                  <th className="py-3.5 px-6">Category ID</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400">
                      Loading categories...
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <FaFolderOpen className="text-sm" />
                          </div>
                          <span className="font-bold text-slate-900 text-sm">
                            {formatCategoryName(category?.name)}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-400 text-xs">
                        {category?.id}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/categories/${category?.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors"
                        >
                          <FaEye className="text-[10px]" />
                          <span>Edit</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400">
                      No categories found matching &quot;{searchQuery}&quot;
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

export default DashboardCategory;
