"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaFloppyDisk,
  FaTrashCan,
  FaReceipt,
  FaUser,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa6";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!params?.id) return;

    const fetchOrderData = async () => {
      try {
        const response = await apiClient.get(`/api/orders/${params.id}`);
        const data: Order = await response.json();
        setOrder(data);
      } catch (e) {
        console.error("Failed to load order data:", e);
      }
    };

    const fetchOrderProducts = async () => {
      try {
        const response = await apiClient.get(`/api/order-product/${params.id}`);
        const data: OrderProduct[] = await response.json();
        setOrderProducts(data || []);
      } catch (e) {
        console.error("Failed to load order products:", e);
      }
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      !order?.name ||
      !order?.lastname ||
      !order?.phone ||
      !order?.email ||
      !order?.adress ||
      !order?.city ||
      !order?.country ||
      !order?.postalCode
    ) {
      toast.error("Please fill in all required customer details");
      return;
    }

    if (!isValidNameOrLastname(order.name)) {
      toast.error("Invalid first name format");
      return;
    }

    if (!isValidNameOrLastname(order.lastname)) {
      toast.error("Invalid last name format");
      return;
    }

    if (!isValidEmailAddressFormat(order.email)) {
      toast.error("Invalid email address format");
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.put(`/api/orders/${order.id}`, order);

      if (response.ok) {
        toast.success("Order updated successfully");
      } else {
        let errorMsg = "Failed to update order";
        try {
          const data = await response.json();
          errorMsg = data.message || data.error || (data.details && data.details[0]?.message) || errorMsg;
        } catch (_) {}
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Network error while updating order");
    } finally {
      setSaving(false);
    }
  };

  const deleteOrder = async () => {
    if (!confirm("Are you sure you want to permanently delete this order?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await apiClient.delete(`/api/orders/${order.id}`);
      if (response.status === 204 || response.ok) {
        toast.success("Order deleted successfully");
        router.push("/admin/orders");
      } else {
        let errorMsg = "Failed to delete order";
        try {
          const data = await response.json();
          errorMsg = data.message || data.error || errorMsg;
        } catch (_) {}
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Network error while deleting order");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "canceled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/orders"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaArrowLeft className="text-xs" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Order #{order?.id ? order.id.slice(0, 8) : "..."}
              </h1>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase ${getStatusBadgeClass(
                  order?.status
                )}`}
              >
                {order?.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Customer order details, fulfillment status, and items breakdown.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              onClick={deleteOrder}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200/60 transition-colors"
            >
              <FaTrashCan className="text-xs" />
              <span>{deleting ? "Deleting..." : "Delete Order"}</span>
            </button>
            <button
              onClick={updateOrder}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <FaFloppyDisk className="text-xs" />
              <span>{saving ? "Updating..." : "Save Order"}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Customer & Shipping */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Customer Contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.name || ""}
                    onChange={(e) => setOrder({ ...order, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.lastname || ""}
                    onChange={(e) =>
                      setOrder({ ...order, lastname: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.email || ""}
                    onChange={(e) =>
                      setOrder({ ...order, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.phone || ""}
                    onChange={(e) =>
                      setOrder({ ...order, phone: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.company || ""}
                    onChange={(e) =>
                      setOrder({ ...order, company: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FaTruck className="text-blue-600" />
                Shipping Destination
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.adress || ""}
                    onChange={(e) =>
                      setOrder({ ...order, adress: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Apartment / Suite / Unit
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.apartment || ""}
                    onChange={(e) =>
                      setOrder({ ...order, apartment: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.city || ""}
                    onChange={(e) =>
                      setOrder({ ...order, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Country *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.country || ""}
                    onChange={(e) =>
                      setOrder({ ...order, country: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={order.postalCode || ""}
                    onChange={(e) =>
                      setOrder({ ...order, postalCode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Order Note */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Customer Delivery Notice
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="No special delivery instructions provided."
                value={order.orderNotice || ""}
                onChange={(e) =>
                  setOrder({ ...order, orderNotice: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          {/* Right Column: Order Items & Totals */}
          <div className="space-y-6">
            {/* Status Control Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Fulfillment Status
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                value={order.status}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    status: e.target.value as "processing" | "delivered" | "canceled",
                  })
                }
              >
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FaBoxOpen className="text-blue-600" />
                Purchased Items ({orderProducts.length})
              </h2>

              <div className="divide-y divide-slate-100">
                {orderProducts.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                      <Image
                        src={
                          item.product?.mainImage
                            ? `/${item.product.mainImage}`
                            : "/product_placeholder.jpg"
                        }
                        alt={item.product?.title || "Product"}
                        width={44}
                        height={44}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product?.slug}`}
                        className="font-bold text-slate-900 text-xs hover:text-blue-600 truncate block transition-colors"
                      >
                        {item.product?.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ${item.product?.price} × {item.quantity} units
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 text-xs">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${Number(order.total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Tax (20%)</span>
                  <span className="font-semibold text-slate-800">${(Number(order.total || 0) * 0.2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-slate-800">$5.00</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-blue-600">
                    ${(Number(order.total || 0) * 1.2 + 5).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={updateOrder}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <FaFloppyDisk className="text-xs" />
                  <span>{saving ? "Saving Changes..." : "Update Order"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSingleOrder;
