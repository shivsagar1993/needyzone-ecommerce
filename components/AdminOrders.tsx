"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import {
  FaEye,
  FaMagnifyingGlass,
  FaTrashCan,
  FaFileInvoice,
  FaClock,
  FaTruckFast,
  FaCheck,
  FaBan,
} from "react-icons/fa6";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/orders");
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setOrders(data?.orders || []);
        } else {
          if (isMounted) setOrders([]);
        }
      } catch (err) {
        console.warn("Orders fetch deferred:", err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const previousOrders = [...orders];

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const response = await apiClient.put(`/api/orders/${orderId}`, {
        status: newStatus,
      });

      if (response.ok) {
        toast.success(`Order status updated to "${newStatus}"`);
      } else {
        setOrders(previousOrders);
        let errorMsg = "Failed to update status";
        try {
          const data = await response.json();
          errorMsg = data.message || data.error || errorMsg;
        } catch (_) {}
        toast.error(errorMsg);
      }
    } catch (err) {
      setOrders(previousOrders);
      toast.error("Network error while updating order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string, customerName: string) => {
    const shortId = orderId.slice(0, 8);
    if (
      !confirm(
        `Are you sure you want to permanently delete order #${shortId} (${customerName})? This will also remove its itemized records.`
      )
    ) {
      return;
    }

    setDeletingId(orderId);
    try {
      const response = await apiClient.delete(`/api/orders/${orderId}`);
      if (response.status === 204 || response.ok) {
        toast.success(`Order #${shortId} deleted successfully`);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        let errorMsg = "Failed to delete order";
        try {
          const data = await response.json();
          errorMsg = data.message || data.error || errorMsg;
        } catch (_) {}
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("Network error while deleting order");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400";
      case "processing":
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400";
      case "canceled":
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-400";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400";
    }
  };

  const filteredOrders = orders.filter(
    (order: any) =>
      order?.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Orders
            </h1>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track customer checkouts, update fulfillment statuses, and manage records.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Search Bar Row */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer, email, status..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Order Reference</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Update Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => {
                  const isUpdating = updatingId === order.id;
                  const isDeleting = deletingId === order.id;

                  return (
                    <tr
                      key={order?.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Order Reference */}
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-slate-900 block">
                          #{order?.id?.slice(0, 8)}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {order?.dateTime
                            ? new Date(order.dateTime).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 block text-sm">
                          {order?.name} {order?.lastname}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {order?.email}
                        </span>
                        {order?.phone && (
                          <span className="text-[10px] text-slate-400 block">
                            {order?.phone}
                          </span>
                        )}
                      </td>

                      {/* Destination */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-slate-700 block">
                          {order?.city || "—"}, {order?.country || "—"}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                          {order?.adress}
                          {order?.apartment ? `, ${order?.apartment}` : ""}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-black text-slate-900 font-mono">
                          ${order?.total}
                        </span>
                      </td>

                      {/* Quick Status Update Selector */}
                      <td className="py-4 px-4">
                        <div className="relative inline-block">
                          <select
                            disabled={isUpdating}
                            value={order?.status?.toLowerCase() || "pending"}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer outline-none focus:ring-2 disabled:opacity-50 capitalize shadow-sm ${getStatusBadgeStyle(
                              order?.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                          </select>
                          {isUpdating && (
                            <span className="absolute right-2 top-2 text-[10px] animate-spin text-slate-400">
                              ⌛
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect / Edit */}
                          <Link
                            href={`/admin/orders/${order?.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors"
                            title="Inspect & Edit Order Details"
                          >
                            <FaEye className="text-[10px]" />
                            <span>Inspect</span>
                          </Link>

                          {/* View Invoice */}
                          <Link
                            href={`/invoice/${order?.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold text-xs transition-colors"
                            title="View Official Pro-Forma Invoice"
                          >
                            <FaFileInvoice className="text-[10px]" />
                            <span className="hidden sm:inline">Invoice</span>
                          </Link>

                          {/* Delete Order */}
                          <button
                            onClick={() =>
                              handleDeleteOrder(
                                order.id,
                                `${order.name} ${order.lastname}`
                              )
                            }
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors disabled:opacity-50"
                            title="Delete Order Permanently"
                          >
                            <FaTrashCan className="text-[10px]" />
                            <span className="hidden sm:inline">
                              {isDeleting ? "Deleting..." : "Delete"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No orders found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
