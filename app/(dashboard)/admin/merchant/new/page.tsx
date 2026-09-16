"use client";
import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaPlus,
  FaShop,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
} from "react-icons/fa6";

export default function NewMerchantPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

    if (!formData.name.trim()) {
      toast.error("Merchant name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/api/merchants", formData);

      if (!response.ok) {
        throw new Error("Failed to create merchant");
      }

      const data = await response.json();
      toast.success("Merchant created successfully");
      router.push(`/admin/merchant/${data.id}`);
    } catch (error) {
      console.error("Error creating merchant:", error);
      toast.error("Failed to create merchant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/merchant"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaArrowLeft className="text-xs" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Register New Merchant
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Add a partner brand or seller organization to the marketplace.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Link
              href="/admin/merchant"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FaShop className="text-base" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Merchant Information</h2>
                <p className="text-xs text-slate-400">Company and operational contact details</p>
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
                  placeholder="e.g. Acme Tech Solutions"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Account Status
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
                  Business Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="contact@brand.com"
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
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Headquarters Address
                </label>
                <div className="relative">
                  <FaLocationDot className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="123 Tech Blvd, Suite 400, San Francisco, CA"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Merchant Description & Notes
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="Overview of products supplied, business terms, and merchant profile..."
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/admin/merchant"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
                <span>{isSubmitting ? "Registering..." : "Create Merchant"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}