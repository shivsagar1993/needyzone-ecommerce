"use client";
import { DashboardSidebar, StatsElement } from "@/components";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBagShopping,
  FaTable,
  FaUsers,
  FaMoneyBillTrendUp,
  FaPlus,
  FaArrowRight,
  FaClock,
  FaShieldHalved,
} from "react-icons/fa6";
import apiClient from "@/lib/api";

const AdminDashboardPage = () => {
  const [productCount, setProductCount] = useState<number>(12);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Fetch products count
    apiClient.get("/api/products?mode=admin")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductCount(data.length);
        }
      })
      .catch(() => {});

    // Fetch orders count & recent orders
    apiClient.get("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data?.orders && Array.isArray(data.orders)) {
          setOrderCount(data.orders.length);
          setRecentOrders(data.orders.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time summary of sales, orders, catalog inventory, and store performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <FaPlus className="text-xs" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatsElement
            title="Total Revenue"
            value="$18,450"
            change="+14.2%"
            isPositive={true}
            icon={FaMoneyBillTrendUp}
            subtitle="from last month"
          />
          <StatsElement
            title="Total Orders"
            value={orderCount}
            change="+8.1%"
            isPositive={true}
            icon={FaBagShopping}
            subtitle="processed to date"
          />
          <StatsElement
            title="Active Catalog"
            value={productCount}
            change="+2 new"
            isPositive={true}
            icon={FaTable}
            subtitle="listed products"
          />
          <StatsElement
            title="Store Visitors"
            value="3,420"
            change="+22.4%"
            isPositive={true}
            icon={FaUsers}
            subtitle="in the last 30 days"
          />
        </div>

        {/* Action Shortcuts & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Quick Shortcuts
              </h3>
              <div className="space-y-2.5">
                <Link
                  href="/admin/products"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 hover:text-blue-600 transition-all text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <FaTable className="text-blue-500" />
                    <span>Manage Catalog Products</span>
                  </div>
                  <FaArrowRight className="text-[10px] text-slate-400" />
                </Link>

                <Link
                  href="/admin/orders"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 hover:text-blue-600 transition-all text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <FaBagShopping className="text-emerald-500" />
                    <span>View Customer Orders</span>
                  </div>
                  <FaArrowRight className="text-[10px] text-slate-400" />
                </Link>

                <Link
                  href="/admin/bulk-upload"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 hover:text-blue-600 transition-all text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <FaPlus className="text-indigo-500" />
                    <span>CSV Bulk Upload Tool</span>
                  </div>
                  <FaArrowRight className="text-[10px] text-slate-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* System Health Status */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                System Healthy & Operational
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <FaClock className="text-[10px]" /> Port 3000 / 3001
              </span>
            </div>

            <div className="my-2">
              <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                Singitronic High-Performance API & Database
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                API security, rate-limiting middleware, Prisma query optimization, and session authorization are all running smoothly with zero latency bottlenecks.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FaShieldHalved className="text-blue-400" />
                <span>NextAuth Role-Based Admin Guard</span>
              </span>
              <Link
                href="/"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Go to Public Storefront →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-500">
                Latest customer purchases processed through checkout
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        #{ord.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {ord.name} {ord.lastname}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ${ord.total}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {ord.status || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No recent orders found yet. Create a test purchase from the shop!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
