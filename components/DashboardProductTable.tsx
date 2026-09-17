"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { FaPlus, FaMagnifyingGlass, FaEye, FaTable, FaTrashCan, FaArrowUpRightFromSquare, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import toast from "react-hot-toast";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient.get("/api/products?mode=admin", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to load products:", err);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((p) =>
    p?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p?.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice((activePage - 1) * pageSize, activePage * pageSize);
  const startItem = filteredProducts.length > 0 ? (activePage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(activePage * pageSize, filteredProducts.length);

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also unlink it from orders.`)) {
      return;
    }
    try {
      const res = await apiClient.delete(`/api/products/${id}`);
      if (res.status === 204) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        let errMsg = "Failed to delete product";
        try {
          const data = await res.json();
          errMsg = data.message || data.error || errMsg;
        } catch (_) {}
        toast.error(errMsg);
      }
    } catch (err) {
      toast.error("Network error while deleting product");
    }
  };

  return (
    <div className="w-full flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Product Inventory
            </h1>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your store catalog, edit pricing, and update stock availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
          >
            <FaPlus className="text-xs" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Card Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Search Bar Row */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title or manufacturer..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-4">Category / Brand</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading catalog products...
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const inStock = product?.inStock > 0;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Product Main Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            <Image
                              width={44}
                              height={44}
                              src={
                                product?.mainImage
                                  ? product.mainImage.startsWith("http")
                                    ? product.mainImage
                                    : product.mainImage.startsWith("/")
                                    ? product.mainImage
                                    : `/${product.mainImage}`
                                  : "/product_placeholder.jpg"
                              }
                              alt={sanitize(product?.title) || "Product"}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm line-clamp-1"
                            >
                              {sanitize(product?.title)}
                            </Link>
                            <span className="text-[11px] text-slate-400">
                              SKU: #{product?.id?.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Manufacturer */}
                      <td className="py-4 px-4">
                        <span className="inline-block font-bold text-slate-900 text-xs">
                          {sanitize(product?.manufacturer) || "—"}
                        </span>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                            {product?.category?.name || product?.categoryId || "General"}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-900 text-sm">
                          ${product?.price}
                        </span>
                      </td>

                      {/* Stock Status */}
                      <td className="py-4 px-4">
                        {inStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors border border-emerald-200/60"
                            title="Live Preview on Storefront"
                          >
                            <FaArrowUpRightFromSquare className="text-[10px]" />
                            <span>Live Preview</span>
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors border border-slate-200/60"
                          >
                            <FaEye className="text-[10px]" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.title)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors"
                            title="Delete product"
                          >
                            <FaTrashCan className="text-[10px]" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No products found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        {!loading && filteredProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{startItem}</span> to{" "}
              <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
              <span className="font-semibold text-slate-800">{filteredProducts.length}</span> products
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={activePage <= 1}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                    activePage <= 1
                      ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                      : "border-slate-200 text-slate-700 bg-white hover:border-blue-500 hover:text-blue-600 shadow-sm"
                  }`}
                >
                  <FaChevronLeft className="text-[10px]" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                      p === activePage
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={activePage >= totalPages}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                    activePage >= totalPages
                      ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                      : "border-slate-200 text-slate-700 bg-white hover:border-blue-500 hover:text-blue-600 shadow-sm"
                  }`}
                >
                  <span>Next</span>
                  <FaChevronRight className="text-[10px]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProductTable;
