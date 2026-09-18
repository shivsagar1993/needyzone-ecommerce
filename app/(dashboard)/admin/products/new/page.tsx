"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly, formatCategoryName } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaPlus,
  FaCloudArrowUp,
  FaBoxOpen,
  FaCircleExclamation,
  FaCircleCheck,
  FaSpinner,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    merchantId?: string;
    title: string;
    price: number;
    manufacturer: string;
    inStock: number;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
    isVisible: boolean;
    isFeatured: boolean;
  }>({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
    isVisible: true,
    isFeatured: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<{
    id: string;
    slug: string;
    title: string;
    categoryName?: string;
    price?: number;
  } | null>(null);

  const addProduct = async () => {
    setFormError(null);

    const missingFields: string[] = [];
    if (!product.title?.trim()) missingFields.push("Product Title");
    if (!product.merchantId) missingFields.push("Merchant / Vendor");
    if (!product.categoryId) missingFields.push("Category Department");
    if (!product.manufacturer?.trim()) missingFields.push("Manufacturer / Brand");
    if (!product.slug?.trim()) missingFields.push("URL Slug");
    if (!product.price || Number(product.price) <= 0)
      missingFields.push("Price (must be greater than $0)");
    if (!product.description?.trim()) missingFields.push("Detailed Description");

    if (missingFields.length > 0) {
      const msg = `Please complete the following required fields: ${missingFields.join(", ")}`;
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    try {
      const sanitizedProduct = sanitizeFormData({
        ...product,
        price: Number(product.price),
        inStock: Number(product.inStock),
        mainImage: product.mainImage || "product_placeholder.jpg",
        isVisible: product.isVisible !== undefined ? Boolean(product.isVisible) : true,
        isFeatured: product.isFeatured !== undefined ? Boolean(product.isFeatured) : false,
      });
      const response = await apiClient.post(`/api/products`, sanitizedProduct);
      const data = await response.json();

      if (response.status === 201 || response.ok) {
        toast.success("Product created successfully!");
        setFormError(null);
        setUploadSuccessMsg(null);
        setUploadError(null);
        setPreviewUrl(null);

        const matchedCategory = categories.find((c) => c.id === data.categoryId || c.name === data.categoryId) || data.category;
        setCreatedProduct({
          id: data.id,
          slug: data.slug,
          title: data.title,
          categoryName: matchedCategory?.name || "General",
          price: data.price,
        });

        setProduct({
          merchantId: merchants[0]?.id || "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
          isVisible: true,
          isFeatured: false,
        });
      } else {
        const reason =
          data.error || data.message || `Server responded with status ${response.status}`;
        const msg = `Product creation rejected: ${reason}`;
        setFormError(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      console.error("Error adding product:", error);
      const msg = `Network error: ${error.message || "Failed to communicate with backend server"}`;
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await apiClient.get("/api/merchants");
      const data: Merchant[] = await res.json();
      setMerchants(data || []);
      setProduct((prev) => ({
        ...prev,
        merchantId: prev.merchantId || data?.[0]?.id || "",
      }));
    } catch (e) {
      toast.error("Failed to load merchants list");
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    setUploadError(null);
    setUploadSuccessMsg(null);

    // Client-side format validation
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      const msg = `Unsupported file format "${ext || file.name}". Please upload a JPG, PNG, WEBP, GIF, or SVG image.`;
      setUploadError(msg);
      toast.error(msg);
      return;
    }

    // Client-side size validation (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `File is too large (${sizeMB} MB). Maximum allowed image size is 5 MB.`;
      setUploadError(msg);
      toast.error(msg);
      return;
    }

    setUploadingImage(true);

    // Immediate local preview so the user sees their chosen image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.upload("/api/main-image", formData);
      const data = await response.json();

      if (response.ok) {
        const savedFileName = data.fileName || file.name;
        setProduct((prev) => ({ ...prev, mainImage: savedFileName }));
        setUploadSuccessMsg(`Saved image: ${savedFileName}`);
        setUploadError(null);
        toast.success("Image uploaded successfully!");
      } else {
        const reason =
          data.error ||
          data.message ||
          `Server returned error status ${response.status}`;
        const msg = `Image upload failed: ${reason}`;
        setUploadError(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const msg = `Network error during upload: ${error.message || "Failed to reach backend server"}`;
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories?mode=admin&t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setCategories(data || []);
      setProduct((prev) => ({
        ...prev,
        categoryId: prev.categoryId || data?.[0]?.id || "",
      }));
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMerchants();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-5xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/products"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm"
              >
                <FaArrowLeft className="text-xs" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Create New Product
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Add a new item to your store catalog with pricing and media specs.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={addProduct}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <FaPlus className="text-xs" />
              <span>{submitting ? "Creating..." : "Save & Publish"}</span>
            </button>
          </div>
        </div>

        {/* Live Preview & Success Notification Banner */}
        {createdProduct && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FaCircleCheck className="text-emerald-600 text-xl shrink-0" />
                  <span className="font-extrabold text-base text-emerald-900">
                    Product Added Successfully!
                  </span>
                </div>
                <p className="text-xs text-emerald-800">
                  <span className="font-semibold text-slate-900">&quot;{createdProduct.title}&quot;</span> was linked to category{" "}
                  <span className="inline-block px-2 py-0.5 rounded-md font-bold bg-white text-emerald-700 border border-emerald-200">
                    {createdProduct.categoryName}
                  </span>
                  {createdProduct.price !== undefined && (
                    <span> • Price: <strong className="text-slate-900">${createdProduct.price}</strong></span>
                  )}
                </p>
                <p className="text-[11px] text-emerald-700 font-mono">
                  Store URL: /product/{createdProduct.slug}
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                <Link
                  href={`/product/${createdProduct.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <FaArrowUpRightFromSquare className="text-xs" />
                  <span>Live Preview Product</span>
                </Link>
                <Link
                  href={`/admin/products/${createdProduct.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300 transition-colors"
                >
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => setCreatedProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top-level Form Error Banner with Reasons */}
        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
            <FaCircleExclamation className="text-rose-600 text-lg shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-rose-900 mb-1">
                Unable to Save Product
              </span>
              <p className="text-rose-700 leading-relaxed">{formError}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Section: Basic Information */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FaBoxOpen className="text-blue-600" />
              General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="e.g. Wireless Noise-Canceling Over-Ear Headphones"
                  value={product.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setProduct({
                      ...product,
                      title,
                      slug: convertSlugToURLFriendly(title),
                    });
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={convertSlugToURLFriendly(product.slug)}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      slug: convertSlugToURLFriendly(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Manufacturer / Brand *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="e.g. Sony, Apple, Samsung"
                  value={product.manufacturer}
                  onChange={(e) =>
                    setProduct({ ...product, manufacturer: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Merchant / Vendor *
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={product.merchantId}
                  onChange={(e) =>
                    setProduct({ ...product, merchantId: e.target.value })
                  }
                >
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {merchants.length === 0 && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    No merchants found. Create a merchant in Merchants menu first.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category Department *
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={product.categoryId}
                  onChange={(e) =>
                    setProduct({ ...product, categoryId: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {formatCategoryName(c.name) || c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Pricing & Stock */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Price ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={product.price || ""}
                    onChange={(e) =>
                      setProduct({ ...product, price: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Inventory Status
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={product.inStock}
                  onChange={(e) =>
                    setProduct({ ...product, inStock: Number(e.target.value) })
                  }
                >
                  <option value={1}>In Stock</option>
                  <option value={0}>Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={product.isVisible}
                  onChange={(e) =>
                    setProduct({ ...product, isVisible: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Storefront Visibility</span>
                  <span className="block text-[11px] text-slate-500">Uncheck to hide this product from customers</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={product.isFeatured}
                  onChange={(e) =>
                    setProduct({ ...product, isFeatured: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Featured Showcase</span>
                  <span className="block text-[11px] text-slate-500">Highlight in Home Page Featured Products</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Media */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Product Media
            </h2>

            {/* Inline Upload Error with Detailed Reason */}
            {uploadError && (
              <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                <FaCircleExclamation className="text-rose-600 text-base shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-rose-900 mb-0.5">Image Upload Failed</span>
                  <p className="text-rose-700">{uploadError}</p>
                </div>
              </div>
            )}

            {/* Inline Upload Success */}
            {uploadSuccessMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
                <FaCircleCheck className="text-emerald-600 text-base shrink-0" />
                <span className="font-medium">{uploadSuccessMsg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start gap-5">
              <label className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden">
                {uploadingImage ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <FaSpinner className="animate-spin text-3xl text-blue-600 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Uploading image to server...</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Please wait</span>
                  </div>
                ) : (
                  <>
                    <FaCloudArrowUp className="text-3xl text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      Select Product Main Image
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, WEBP, GIF, or SVG up to 5MB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  className="hidden"
                  onChange={(e: any) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      uploadFile(f);
                    }
                  }}
                />
              </label>

              {(previewUrl || product.mainImage) && (
                <div className="w-28 h-28 rounded-2xl border border-slate-200 bg-white p-2 flex items-center justify-center relative shrink-0 shadow-sm overflow-hidden">
                  <img
                    src={previewUrl || (product.mainImage ? `/${product.mainImage}` : "")}
                    alt={product.title || "Uploaded image"}
                    className="w-full h-full object-contain"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                      <FaSpinner className="animate-spin text-blue-600 text-lg" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section: Description */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Detailed Description
            </h2>
            <textarea
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              placeholder="Provide a comprehensive breakdown of product features, tech specs, dimensions, and included accessories..."
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={addProduct}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <FaPlus className="text-xs" />
              <span>{submitting ? "Saving Product..." : "Create Product"}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddNewProduct;
