"use client";
import React, { useEffect, useState, use } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaFloppyDisk,
  FaTrashCan,
  FaShop,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaBoxOpen,
  FaEye,
} from "react-icons/fa6";

interface Product {
  id: string;
  title: string;
  price: number;
  inStock: number;
  slug?: string;
  mainImage?: string;
}

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: Product[];
}

interface MerchantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MerchantDetailPage({
  params,
}: MerchantDetailPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });

  const router = useRouter();

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/merchants/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/admin/merchant");
          return;
        }
        throw new Error("Failed to fetch merchant");
      }

      const data = await response.json();
      setMerchant(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        status: data.status || "ACTIVE",
      });
    } catch (error) {
      console.error("Error fetching merchant:", error);
      toast.error("Failed to load merchant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await apiClient.put(`/api/merchants/${id}`, formData);

      if (!response.ok) {
        throw new Error("Failed to update merchant");
      }

      toast.success("Merchant updated successfully");
      fetchMerchant();
    } catch (error) {
      console.error("Error updating merchant:", error);
      toast.error("Failed to update merchant");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this merchant?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await apiClient.delete(`/api/merchants/${id}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete merchant");
      }

      toast.success("Merchant deleted successfully");
      router.push("/admin/merchant");
    } catch (error) {
      console.error("Error deleting merchant:", error);
      toast.error("Failed to delete merchant");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-10 text-center">
          <p className="text-slate-400 text-sm">Merchant account not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/merchant"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaArrowLeft className="text-xs" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {merchant.name}
              </h1>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  merchant.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {merchant.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Merchant profile, supply contracts, and linked catalog items.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200/60 transition-colors"
            >
              <FaTrashCan className="text-xs" />
              <span>{deleting ? "Deleting..." : "Delete"}</span>
            </button>
          </div>
        </div>

        {/* Merchant Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FaShop className="text-base" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Merchant Settings</h2>
                <p className="text-xs font-mono text-slate-400">ID: {id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Merchant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Operating Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                >
                  <option value="ACTIVE">Active Vendor</option>
                  <option value="INACTIVE">Inactive / Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Business Address
                </label>
                <div className="relative">
                  <FaLocationDot className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description & Operational Notes
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <FaFloppyDisk className="text-xs" />
                <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Linked Products Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                <FaBoxOpen />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Products Supplied ({merchant.products?.length || 0})
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Product Title</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Inventory</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {merchant.products && merchant.products.length > 0 ? (
                  merchant.products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {product.title}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            product.inStock > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {product.inStock > 0 ? `${product.inStock} In Stock` : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors"
                        >
                          <FaEye className="text-[10px]" />
                          <span>View Item</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400">
                      No products associated with this merchant yet.
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
}