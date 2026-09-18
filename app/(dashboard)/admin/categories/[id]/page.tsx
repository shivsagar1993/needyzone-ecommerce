"use client";
import { DashboardSidebar } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { formatCategoryName, convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import { FaArrowLeft, FaFloppyDisk, FaTrashCan, FaFolderOpen } from "react-icons/fa6";

interface DashboardSingleCategoryProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleCategory = ({ params }: DashboardSingleCategoryProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [categoryInput, setCategoryInput] = useState<{
    name: string;
    isVisible: boolean;
    showOnHome: boolean;
    showInNav: boolean;
  }>({
    name: "",
    isVisible: true,
    showOnHome: true,
    showInNav: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const deleteCategory = async () => {
    if (!confirm("Are you sure you want to delete this category? All associated products may be affected.")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await apiClient.delete(`/api/categories/${id}`);
      if (response.status === 204) {
        toast.success("Category deleted successfully");
        router.push("/admin/categories");
        router.refresh();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("There was an error deleting category");
    } finally {
      setDeleting(false);
    }
  };

  const updateCategory = async () => {
    if (categoryInput.name.trim().length === 0) {
      toast.error("Please enter a category name");
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.put(`/api/categories/${id}`, {
        name: convertCategoryNameToURLFriendly(categoryInput.name),
        isVisible: categoryInput.isVisible,
        showOnHome: categoryInput.showOnHome,
        showInNav: categoryInput.showInNav,
      });

      if (response.status === 200) {
        toast.success("Category updated successfully");
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error updating category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("There was an error while updating category");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    apiClient
      .get(`/api/categories/${id}?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setCategoryInput({
          name: data?.name || "",
          isVisible: data?.isVisible !== undefined ? Boolean(data.isVisible) : true,
          showOnHome: data?.showOnHome !== undefined ? Boolean(data.showOnHome) : true,
          showInNav: data?.showInNav !== undefined ? Boolean(data.showInNav) : true,
        });
      })
      .catch((err) => console.error("Failed to load category:", err));
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
                href="/admin/categories"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaArrowLeft className="text-xs" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Edit Category
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Update department naming and taxonomy configuration.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={deleteCategory}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200/60 transition-colors"
            >
              <FaTrashCan className="text-xs" />
              <span>{deleting ? "Deleting..." : "Delete"}</span>
            </button>
            <button
              type="button"
              onClick={updateCategory}
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
              <FaFolderOpen className="text-base" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Category Settings</h2>
              <p className="text-xs font-mono text-slate-400">ID: {id}</p>
            </div>
          </div>

          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Department Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={formatCategoryName(categoryInput.name)}
                onChange={(e) =>
                  setCategoryInput({ ...categoryInput, name: e.target.value })
                }
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-400">Normalized URL slug: </span>
              <code className="font-mono text-blue-600 font-bold">
                {convertCategoryNameToURLFriendly(categoryInput.name)}
              </code>
            </div>

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
                  <span className="block text-[11px] text-slate-500">Active / Hidden on store</span>
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
          </div>

          {/* Danger Warning */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-rose-600">Department Deletion</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Deleting this category may impact products currently categorized under it.
              </p>
            </div>

            <button
              type="button"
              onClick={deleteCategory}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition-colors active:scale-95 disabled:opacity-50"
            >
              Delete Category
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSingleCategory;
