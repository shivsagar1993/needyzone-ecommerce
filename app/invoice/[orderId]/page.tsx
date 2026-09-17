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

  useEffect(() => {
    if (order) {
      document.title = `NeedyZone-Invoice-${order.id.slice(0, 8).toUpperCase()}`;
    }
  }, [order]);

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
    <div className="min-h-screen bg-slate-100/70 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white text-slate-800">
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
            title="Save as PDF or Print Invoice"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaPrint className="text-sm" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="invoice-container max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10 print:p-0 print:m-0 print:shadow-none print:border-none print:rounded-none print:max-w-none print:w-full">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start gap-6 pb-6 print:pb-4 border-b border-slate-200 print-avoid-break">
          <div className="flex flex-col sm:flex-row print:flex-row items-start sm:items-center print:items-center gap-4">
            <Link href="/" className="shrink-0">
              <Image
                src="/needyzone-logo.png"
                width={160}
                height={45}
                alt="NeedyZone"
                className="h-10 sm:h-11 print:h-10 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>
            <div className="sm:border-l print:border-l sm:border-slate-200 print:border-slate-200 sm:pl-4 print:pl-4">
              <h1 className="text-xl print:text-lg font-black tracking-tight text-slate-900">
                NEEDY<span className="text-red-600">ZONE</span>
              </h1>
              <p className="text-[10px] print:text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                Electronics & Surveillance Systems
              </p>
              <div className="mt-1 text-[11px] print:text-[10px] text-slate-500 space-y-0.5">
                <p>NeedyZone Technology HQ, New Delhi, India</p>
                <p>GSTIN / Tax ID: 07AAACN1234D1Z5 | Reg: NZ-2026-IN</p>
                <p>support@needyzone.com | +91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="sm:text-right print:text-right shrink-0">
            <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest mb-1.5 print:mb-1">
              Pro-Forma Invoice
            </div>
            <div className="text-xl print:text-lg font-black text-slate-900 tracking-tight font-mono">
              {invoiceNumber}
            </div>
            <div className="mt-1.5 print:mt-1 text-xs print:text-[10.5px] text-slate-500 space-y-0.5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 sm:gap-8 py-5 sm:py-6 print:py-3 border-b border-slate-200 print-avoid-break">
          <div>
            <h3 className="text-[10px] print:text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 print:mb-1">
              Billed & Invoiced To:
            </h3>
            <div className="text-sm print:text-xs font-bold text-slate-900 mb-0.5">
              {order.name} {order.lastname}
            </div>
            {order.company && (
              <div className="text-xs print:text-[11px] font-semibold text-blue-600 mb-1">
                {order.company}
              </div>
            )}
            <div className="text-xs print:text-[10.5px] text-slate-600 space-y-0.5 mt-1">
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
            <h3 className="text-[10px] print:text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 print:mb-1">
              Delivery Destination:
            </h3>
            <div className="text-xs print:text-[10.5px] text-slate-700 space-y-0.5">
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
          <div className="py-3 px-4 my-4 print:my-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs print:text-[10.5px] print-avoid-break">
            <span className="font-bold text-slate-700 uppercase tracking-wide text-[9.5px] block mb-0.5">
              Customer Enquiry Note:
            </span>
            <p className="text-slate-600 italic leading-relaxed">{order.orderNotice}</p>
          </div>
        )}

        {/* Line Items Table */}
        <div className="py-5 sm:py-6 print:py-3 print-avoid-break">
          <table className="w-full text-left border-collapse text-xs print:text-[11px]">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50/70 print:bg-slate-100/90 text-slate-600 font-bold uppercase tracking-wider text-[10px] print:text-[9.5px]">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Item Description</th>
                <th className="py-2.5 px-2 text-center">Qty</th>
                <th className="py-2.5 px-2 text-right">Unit Price</th>
                <th className="py-2.5 px-2 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const lineTotal = (item.product?.price || 0) * (item.quantity || 1);
                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors print-avoid-break">
                      <td className="py-2.5 px-2 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2.5">
                          {item.product?.mainImage && (
                            <div className="w-8 h-8 rounded-md bg-slate-100 p-0.5 shrink-0 flex items-center justify-center border border-slate-200 print:border-slate-300">
                              <Image
                                src={
                                  item.product.mainImage.startsWith("http")
                                    ? item.product.mainImage
                                    : item.product.mainImage.startsWith("/")
                                    ? item.product.mainImage
                                    : `/${item.product.mainImage}`
                                }
                                alt={item.product.title}
                                width={32}
                                height={32}
                                className="object-contain max-h-full max-w-full"
                                unoptimized
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 leading-snug">{item.product?.title || "Product"}</div>
                            {item.product?.manufacturer && (
                              <div className="text-[9.5px] text-slate-400 font-medium uppercase tracking-wider">
                                {item.product.manufacturer}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-700">{item.quantity}</td>
                      <td className="py-2.5 px-2 text-right text-slate-600 font-mono">
                        ${(item.product?.price || 0).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-900 font-mono">
                        ${lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="print-avoid-break">
                  <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                    Single order package - Total ${order.total.toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="pt-4 print:pt-3 border-t border-slate-200 flex flex-col sm:flex-row print:flex-row justify-between items-start gap-6 sm:gap-8 print:gap-4 print-avoid-break">
          {/* Direct Settlement / Wire Instructions */}
          <div className="w-full sm:max-w-sm print:max-w-[340px] rounded-2xl print:rounded-xl bg-blue-50/70 print:bg-blue-50/80 border border-blue-200/80 p-3.5 print:p-3 text-xs print:text-[10px]">
            <div className="flex items-center gap-2 font-bold text-blue-900 mb-1.5">
              <FaBuildingColumns className="text-blue-600 text-xs" />
              <span>Direct Bank Settlement Instructions</span>
            </div>
            <div className="space-y-0.5 text-slate-600 leading-relaxed">
              <p>
                <span className="font-semibold text-slate-800">Bank:</span> State Bank of India / HDFC Commercial
              </p>
              <p>
                <span className="font-semibold text-slate-800">Beneficiary:</span> NeedyZone Electronics Direct
              </p>
              <p>
                <span className="font-semibold text-slate-800">Account No:</span> 50200012345678
              </p>
              <p>
                <span className="font-semibold text-slate-800">IFSC / SWIFT:</span> HDFC0001234
              </p>
              <p>
                <span className="font-semibold text-slate-800">Reference:</span>{" "}
                <span className="font-mono font-bold text-blue-700">{invoiceNumber}</span>
              </p>
              <p className="pt-1 text-[9.5px] text-slate-500 italic border-t border-blue-200/60 mt-1.5">
                * Please quote the reference number with your payment. Dispatch proceeds upon payment credit.
              </p>
            </div>
          </div>

          {/* Subtotals & Grand Total */}
          <div className="w-full sm:w-72 print:w-64 space-y-1.5 text-xs print:text-[11px] shrink-0">
            <div className="flex justify-between py-0.5 text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-0.5 text-slate-600">
              <span>Standard Logistics / Delivery</span>
              <span className="font-mono font-semibold">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-0.5 text-slate-600">
              <span>Estimated VAT / Taxes (20%)</span>
              <span className="font-mono font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline">
              <span className="text-sm print:text-xs font-black text-slate-900 uppercase tracking-tight">Total Due</span>
              <span className="text-xl print:text-lg font-black text-slate-900 font-mono tracking-tight text-blue-600">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer & Signature Row */}
        <div className="mt-8 sm:mt-10 print:mt-5 pt-6 sm:pt-6 print:pt-3 border-t border-slate-200 flex flex-col sm:flex-row print:flex-row justify-between items-end gap-4 text-xs text-slate-400 print-avoid-break">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px] print:text-[10px]">
              <FaShieldHalved className="text-xs" />
              <span>Official NeedyZone Pro-Forma Invoice Document</span>
            </div>
            <p className="text-[10px] print:text-[9.5px]">Thank you for your business. For queries, contact billing@needyzone.com.</p>
          </div>

          <div className="text-right shrink-0">
            <div className="font-serif italic text-slate-800 text-sm print:text-xs font-semibold border-b border-slate-300 pb-1 px-4">
              NeedyZone Commercial Operations
            </div>
            <div className="text-[9.5px] uppercase tracking-wider text-slate-400 mt-1">Authorized Issuer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
