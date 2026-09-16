"use client";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import { FaPlus, FaEye, FaStore, FaMagnifyingGlass } from "react-icons/fa6";

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: any[];
}

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/merchants");
      if (!response.ok) {
        throw new Error("Failed to fetch merchants");
      }
      const data = await response.json();
      setMerchants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter((m) =>
    m?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m?.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
                Vendor Merchants
              </h1>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {merchants.length} Merchants
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage multi-vendor supply partners, storefront contacts, and catalog allocations.
            </p>
          </div>

          <div>
            <Link
              href="/admin/merchant/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <FaPlus className="text-xs" />
              <span>Add Merchant</span>
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
                placeholder="Search merchant name or email..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Merchant Name</th>
                  <th className="py-3.5 px-6">Contact Email</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Active Products</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Loading merchants...
                    </td>
                  </tr>
                ) : filteredMerchants.length > 0 ? (
                  filteredMerchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <FaStore className="text-sm" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">
                              {merchant.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              #{merchant.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        {merchant.email || "—"}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            merchant.status?.toLowerCase() === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {merchant.status || "ACTIVE"}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {merchant.products?.length || 0} items
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/merchant/${merchant.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors"
                        >
                          <FaEye className="text-[10px]" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No merchants found matching &quot;{searchQuery}&quot;
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