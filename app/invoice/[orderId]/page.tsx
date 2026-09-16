"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/api";
import {
  FaPrint,
  FaArrowLeft,
  FaStore,
  FaFileInvoiceDollar,
  FaBuildingColumns,
  FaCircleCheck,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaShieldHalved,
} from "react-icons/fa6";

interface OrderProductItem {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug?: string;
    title: string;
    mainImage: string;
    price: number;
    manufacturer?: string;
  };
}

const InvoicePage = () => {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const orderId = params?.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Order details
        const orderRes = await apiClient.get(`/api/orders/${orderId}`);
        if (!orderRes.ok) {
          throw new Error("Order not found or could not be loaded");
        }
        const orderData = await orderRes.json();
        setOrder(orderData);

        // Fetch Order Items
        const itemsRes = await apiClient.get(`/api/order-product/${orderId}`);
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setItems(Array.isArray(itemsData) ? itemsData : []);
        }
      } catch (err: any) {
        console.error("Failed to load invoice:", err);
        setError(err.message || "Unable to retrieve invoice data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Generating official invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Invoice Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">{error || "The requested invoice could not be located."}</p>
          <div className="flex justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 1), 0) || order.total;
  const tax = Math.round((subtotal / 5) * 100) / 100;
  const shipping = 5.0;
  const grandTotal = Math.round((subtotal + tax + shipping) * 100) / 100;

  const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
  const orderDate = order.dateTime
    ? new Date(order.dateTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white text-slate-800">
      {/* Top Controls Strip - Screen Only */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Storefront</span>
          </button>
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <FaStore className="text-xs" />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <FaCircleCheck className="text-emerald-600 text-xs" />
            <span>Order Registered Successfully</span>
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaPrint className="text-sm" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-12 print:p-0 print:shadow-none print:border-0 print:rounded-none print:max-w-none">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
              S
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                SINGI<span className="text-blue-600">TRONIC</span>
              </h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Electronics & Computing Hardware
              </p>
              <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                <p>1200 Innovation Parkway, Suite 400</p>
                <p>Belgrade, Tech District 11000</p>
                <p>VAT ID: RS-892019482 | Reg No: 20491823</p>
                <p>support@singitronic.com | +381 61 123 321</p>
              </div>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">
              Pro-Forma Invoice
            </div>
            <div className="text-xl font-black text-slate-900 tracking-tight font-mono">
              {invoiceNumber}
            </div>
            <div className="mt-2 text-xs text-slate-500 space-y-0.5">
              <p>
                <span className="font-semibold text-slate-700">Date:</span> {orderDate}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Terms:</span> Due Upon Direct Wire / Receipt
              </p>
              <p>
                <span className="font-semibold text-slate-700">Status:</span>{" "}
                <span className="capitalize font-bold text-amber-600">{order.status || "Pending Verification"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-200">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Billed & Invoiced To:
            </h3>
            <div className="text-sm font-bold text-slate-900 mb-0.5">
              {order.name} {order.lastname}
            </div>
            {order.company && (
              <div className="text-xs font-semibold text-blue-600 mb-1">
                {order.company}
              </div>
            )}
            <div className="text-xs text-slate-600 space-y-0.5 mt-1">
              <p className="flex items-center gap-1.5">
                <FaEnvelope className="text-slate-400 text-[10px]" />
                <span>{order.email}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <FaPhone className="text-slate-400 text-[10px]" />
                <span>{order.phone}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Delivery Destination:
            </h3>
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-medium text-slate-900">{order.adress}</p>
              {order.apartment && <p>Suite / Apt: {order.apartment}</p>}
              <p>
                {order.city}, {order.country} {order.postalCode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Notice / Enquiry Instructions (if provided) */}
        {order.orderNotice && (
          <div className="py-4 px-5 my-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px] block mb-1">
              Customer Enquiry Note:
            </span>
            <p className="text-slate-600 italic leading-relaxed">{order.orderNotice}</p>
          </div>
        )}

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">Item Description</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Unit Price</th>
                <th className="py-3 px-2 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const lineTotal = (item.product?.price || 0) * (item.quantity || 1);
                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          {item.product?.mainImage && (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 p-1 shrink-0 flex items-center justify-center border border-slate-200">
                              <Image
                                src={`/${item.product.mainImage}`}
                                alt={item.product.title}
                                width={36}
                                height={36}
                                className="object-contain max-h-full max-w-full"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{item.product?.title || "Product"}</div>
                            {item.product?.manufacturer && (
                              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                {item.product.manufacturer}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold text-slate-700">{item.quantity}</td>
                      <td className="py-3.5 px-2 text-right text-slate-600 font-mono">
                        ${(item.product?.price || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-2 text-right font-bold text-slate-900 font-mono">
                        ${lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                    Single order package - Total ${order.total.toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-8">
          {/* Direct Settlement / Wire Instructions */}
          <div className="sm:max-w-sm rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 mb-2">
              <FaBuildingColumns className="text-blue-600" />
              <span>Direct Bank Settlement Instructions</span>
            </div>
            <div className="space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <p>
                <span className="font-semibold text-slate-800">Bank:</span> First Global Commercial Bank
              </p>
              <p>
                <span className="font-semibold text-slate-800">Beneficiary:</span> Singitronic Electronics Corp.
              </p>
              <p>
                <span className="font-semibold text-slate-800">IBAN:</span> RS35 1600 0001 2345 6789 12
              </p>
              <p>
                <span className="font-semibold text-slate-800">SWIFT/BIC:</span> FGCBRSBG
              </p>
              <p>
                <span className="font-semibold text-slate-800">Reference:</span>{" "}
                <span className="font-mono font-bold text-blue-700">{invoiceNumber}</span>
              </p>
              <p className="pt-1.5 text-[10px] text-slate-500 italic border-t border-blue-200/60 mt-2">
                * Please quote the reference number with your payment. Goods are prepared for dispatch upon confirmation.
              </p>
            </div>
          </div>

          {/* Subtotals & Grand Total */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Standard Logistics / Delivery</span>
              <span className="font-mono font-semibold">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Estimated VAT / Taxes (20%)</span>
              <span className="font-mono font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Total Due</span>
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight text-blue-600">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer & Signature Row */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-400">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
              <FaShieldHalved className="text-xs" />
              <span>Official Singitronic Pro-Forma Invoice Document</span>
            </div>
            <p className="text-[10px]">Thank you for your business enquiry. For queries, contact billing@singitronic.com.</p>
          </div>

          <div className="text-right">
            <div className="font-serif italic text-slate-800 text-base font-semibold border-b border-slate-300 pb-1 px-4">
              Singitronic Commercial Operations
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Authorized Issuer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
