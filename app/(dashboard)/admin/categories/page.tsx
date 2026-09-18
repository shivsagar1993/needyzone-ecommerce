"use client";
import { DashboardSidebar } from "@/components";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaFolderOpen,
  FaMagnifyingGlass,
  FaArrowsRotate,
  FaTrashCan,
  FaPenToSquare,
  FaHouse,
  FaCompass,
} from "react-icons/fa6";

interface CategoryItemType {
  id: string;
  name: string;
  isVisible?: boolean;
  showOnHome?: boolean;
  showInNav?: boolean;
  orderIndex?: number;
}

const DashboardCategory = () => {
  const [categories, setCategories] = useState<CategoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    apiClient
      .get(`/api/categories?mode=admin&t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleVisibility = async (cat: CategoryItemType) => {
    const nextVal = cat.isVisible === false ? true : false;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, isVisible: nextVal } : c))
    );
    try {
      await apiClient.put(`/api/categories/${cat.id}`, { isVisible: nextVal });
      toast.success(
        `"${cat.name}" is now ${nextVal ? "Visible on Store" : "Hidden from Store"}`
      );
    } catch (e) {
      toast.error("Failed to update visibility");
      fetchCategories();
    }
  };

  const toggleShowOnHome = async (cat: CategoryItemType) => {
    const nextVal = cat.showOnHome === false ? true : false;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, showOnHome: nextVal } : c))
    );
    try {
      await apiClient.put(`/api/categories/${cat.id}`, { showOnHome: nextVal });
      toast.success(
        `"${cat.name}" ${nextVal ? "will now show" : "hidden"} on Home Page`
      );
    } catch (e) {
      toast.error("Failed to update home visibility");
      fetchCategories();
    }
  };

  const toggleShowInNav = async (cat: CategoryItemType) => {
    const nextVal = cat.showInNav === false ? true : false;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, showInNav: nextVal } : c))
    );
    try {
      await apiClient.put(`/api/categories/${cat.id}`, { showInNav: nextVal });
      toast.success(
        `"${cat.name}" ${nextVal ? "will now show" : "hidden"} in Top Navigation`
      );
    } catch (e) {
      toast.error("Failed to update navigation visibility");
      fetchCategories();
    }
  };

  const deleteCategory = async (cat: CategoryItemType) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${cat.name}"? Products under this category may be affected.`
      )
    ) {
      return;
    }
    try {
      const res = await apiClient.delete(`/api/categories/${cat.id}`);
      if (res.ok || res.status === 204) {
        toast.success(`Category "${cat.name}" deleted successfully`);
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      } else {
        toast.error("Failed to delete category");
      }
    } catch (e) {
      toast.error("Error deleting category");
      fetchCategories();
    }
  };

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
              Organize product departments, toggle live visibility, and manage storefront taxonomy.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all active:scale-95 shadow-xs disabled:opacity-60"
              title="Refresh Category List"
            >
              <FaArrowsRotate className={`text-xs ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
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
                  <th className="py-3.5 px-4">Category ID</th>
                  <th className="py-3.5 px-4 text-center">Home Page</th>
                  <th className="py-3.5 px-4 text-center">Top Nav</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Quick Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading categories...
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const isVisible = category.isVisible !== false;
                    const showOnHome = category.showOnHome !== false;
                    const showInNav = category.showInNav !== false;

                    return (
                      <tr key={category.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                              <FaFolderOpen className="text-sm" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-sm capitalize block">
                                {formatCategoryName(category?.name) || category?.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                /shop/{category.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-400 text-xs">
                          {category?.id}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleShowOnHome(category)}
                            title={showOnHome ? "Click to remove from Home page" : "Click to feature on Home page"}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                              showOnHome
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <FaHouse className="text-[10px]" />
                            <span>{showOnHome ? "Home Grid" : "Hidden"}</span>
                          </button>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleShowInNav(category)}
                            title={showInNav ? "Click to remove from Top Navigation" : "Click to show in Top Navigation"}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                              showInNav
                                ? "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <FaCompass className="text-[10px]" />
                            <span>{showInNav ? "In Nav" : "Hidden"}</span>
                          </button>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => toggleVisibility(category)}
                            title={isVisible ? "Click to hide from store" : "Click to make visible on store"}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                              isVisible
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            {isVisible ? <FaEye className="text-[10px]" /> : <FaEyeSlash className="text-[10px]" />}
                            <span>{isVisible ? "Active" : "Hidden"}</span>
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Link
                              href={`/admin/categories/${category?.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors"
                              title="Edit Category Name & Settings"
                            >
                              <FaPenToSquare className="text-[11px]" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => deleteCategory(category)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <FaTrashCan className="text-[11px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
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
