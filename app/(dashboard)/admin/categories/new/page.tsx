"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import { FaArrowLeft, FaPlus, FaFolderPlus } from "react-icons/fa6";

const DashboardNewCategoryPage = () => {
  const router = useRouter();
  const [categoryInput, setCategoryInput] = useState({
    name: "",
    isVisible: true,
    showOnHome: true,
    showInNav: true,
    orderIndex: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const addNewCategory = async () => {
    if (categoryInput.name.trim().length === 0) {
      toast.error("Please enter a category department name");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.post(`/api/categories`, {
        name: convertCategoryNameToURLFriendly(categoryInput.name),
        isVisible: categoryInput.isVisible,
        showOnHome: categoryInput.showOnHome,
        showInNav: categoryInput.showInNav,
        orderIndex: Number(categoryInput.orderIndex) || 0,
      });

      if (response.status === 201 || response.status === 200 || response.ok) {
        toast.success("Category added successfully! Redirecting to list...");
        setCategoryInput({
          name: "",
          isVisible: true,
          showOnHome: true,
          showInNav: true,
          orderIndex: 0,
        });
        setTimeout(() => {
          router.push("/admin/categories");
          router.refresh();
        }, 600);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Network error while creating category");
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
                href="/admin/categories"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaArrowLeft className="text-xs" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Add New Category
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Create a new department taxonomy for product classification and storefront navigation.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Link
              href="/admin/categories"
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
                <FaFolderPlus className="text-base" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Department Information</h2>
                <p className="text-xs text-slate-400">Specify department label and URL format</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="e.g. Smart Watches & Wearables"
                value={categoryInput.name}
                onChange={(e) =>
                  setCategoryInput({ ...categoryInput, name: e.target.value })
                }
              />
            </div>

            {categoryInput.name && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-slate-400">Generated URL slug: </span>
                <code className="font-mono text-blue-600 font-bold">
                  {convertCategoryNameToURLFriendly(categoryInput.name)}
                </code>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={categoryInput.isVisible}
                  onChange={(e) =>
                    setCategoryInput({ ...categoryInput, isVisible: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Storefront Status</span>
                  <span className="block text-[11px] text-slate-500">Active / Hidden on entire store</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={categoryInput.showOnHome}
                  onChange={(e) =>
                    setCategoryInput({ ...categoryInput, showOnHome: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Home Page Grid</span>
                  <span className="block text-[11px] text-slate-500">Display in Browse by Category grid</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={categoryInput.showInNav}
                  onChange={(e) =>
                    setCategoryInput({ ...categoryInput, showInNav: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Top Navigation</span>
                  <span className="block text-[11px] text-slate-500">Display in top navbar link bar</span>
                </div>
              </label>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={addNewCategory}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
                <span>{submitting ? "Creating..." : "Create Category"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardNewCategoryPage;
