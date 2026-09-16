"use client";
import { DashboardSidebar } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";
import apiClient from "@/lib/api";
import {
  FaArrowLeft,
  FaFloppyDisk,
  FaTrashCan,
  FaArrowUpRightFromSquare,
  FaCloudArrowUp,
  FaBoxOpen,
  FaCircleExclamation,
  FaCircleCheck,
  FaSpinner,
} from "react-icons/fa6";

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardProductDetails = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await apiClient.delete(`/api/products/${id}`);
      if (response.ok || response.status === 204) {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
      } else {
        const errorData = await response.json().catch(() => ({}));
        const reason =
          errorData.error || errorData.message || `Server responded with status ${response.status}`;
        toast.error(`Cannot delete product: ${reason}`);
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(`Network error while deleting product: ${error.message || ""}`);
    } finally {
      setDeleting(false);
    }
  };

  const updateProduct = async () => {
    setFormError(null);
    if (!product) return;

    if (!product.title?.trim()) {
      const msg = "Product Title cannot be empty";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (product.price === undefined || Number(product.price) <= 0) {
      const msg = "Price must be a valid number greater than 0";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.put(`/api/products/${id}`, {
        ...product,
        price: Number(product.price),
        inStock: Number(product.inStock),
      });

      if (response.ok) {
        toast.success("Product updated successfully");
        setFormError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const reason =
          errorData.error || errorData.message || `Server returned error ${response.status}`;
        const msg = `Failed to update product: ${reason}`;
        setFormError(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      const msg = `Network error: ${error.message || "Unable to reach server"}`;
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
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
      const msg = `Unsupported file format "${ext || file.name}". Allowed image formats: JPG, PNG, WEBP, GIF, SVG.`;
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

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.upload("/api/main-image", formData);
      const data = await response.json();

      if (response.ok) {
        const savedFileName = data.fileName || file.name;
        if (product) {
          setProduct({ ...product, mainImage: savedFileName });
        }
        setUploadSuccessMsg(`Saved image: ${savedFileName}`);
        setUploadError(null);
        toast.success("Image uploaded successfully");
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
      console.error("Error uploading file:", error);
      const msg = `Network error during upload: ${error.message || "Failed to reach backend server"}`;
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchProductData = async () => {
    try {
      const res = await apiClient.get(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      const imagesData = await apiClient.get(`/api/images/${id}`, {
        cache: "no-store",
      });
      const images = await imagesData.json();
      setOtherImages(images || []);
    } catch (error) {
      console.error("Failed to load product data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  if (!product) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

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
                Edit Product
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:ml-11">
              Modify product specifications, pricing, stock levels, and media assets.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-sm"
            >
              <FaArrowUpRightFromSquare className="text-xs text-slate-400" />
              <span>Preview Live</span>
            </Link>
            <button
              onClick={deleteProduct}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200/60 transition-colors"
            >
              <FaTrashCan className="text-xs" />
              <span>{deleting ? "Deleting..." : "Delete"}</span>
            </button>
            <button
              onClick={updateProduct}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <FaFloppyDisk className="text-xs" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Form Error Banner with Reasons */}
        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
            <FaCircleExclamation className="text-rose-600 text-lg shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-rose-900 mb-1">
                Unable to Update Product
              </span>
              <p className="text-rose-700 leading-relaxed">{formError}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-8">
          {/* General Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FaBoxOpen className="text-blue-600" />
              General Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={product.title || ""}
                  onChange={(e) =>
                    setProduct({ ...product, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Slug Identifier *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={product.slug ? convertSlugToURLFriendly(product.slug) : ""}
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
                  value={product.manufacturer || ""}
                  onChange={(e) =>
                    setProduct({ ...product, manufacturer: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category Department *
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={product.categoryId || ""}
                  onChange={(e) =>
                    setProduct({ ...product, categoryId: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {formatCategoryName(cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Stock Status
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  value={product.inStock ?? 1}
                  onChange={(e) =>
                    setProduct({ ...product, inStock: Number(e.target.value) })
                  }
                >
                  <option value={1}>In Stock</option>
                  <option value={0}>Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Pricing Configuration
            </h2>
            <div className="max-w-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Unit Price ($ USD) *
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
          </div>

          {/* Media Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Product Images
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

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {(previewUrl || product.mainImage) && (
                <div className="w-32 h-32 rounded-2xl border border-slate-200 bg-white p-2 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                  <img
                    src={previewUrl || (product.mainImage ? `/${product.mainImage}` : "")}
                    alt={product.title || "Product image"}
                    className="w-full h-full object-contain"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                      <FaSpinner className="animate-spin text-blue-600 text-lg" />
                    </div>
                  )}
                </div>
              )}

              <label className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden">
                {uploadingImage ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <FaSpinner className="animate-spin text-3xl text-blue-600 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Uploading new image to server...</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Please wait</span>
                  </div>
                ) : (
                  <>
                    <FaCloudArrowUp className="text-3xl text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      Replace Main Product Image
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
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      uploadFile(selectedFile);
                    }
                  }}
                />
              </label>
            </div>

            {otherImages && otherImages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Additional Gallery Assets
                </p>
                <div className="flex gap-2 flex-wrap">
                  {otherImages.map((image) => (
                    <div
                      key={nanoid()}
                      className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center"
                    >
                      <Image
                        src={`/${image.image}`}
                        alt="Product gallery image"
                        width={60}
                        height={60}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Product Overview & Details
            </h2>
            <textarea
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              value={product.description || ""}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-rose-600">Danger Zone</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Deleting a product requires removing associated records in customer orders first.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={deleteProduct}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition-colors active:scale-95 disabled:opacity-50"
              >
                Delete Product
              </button>
              <button
                type="button"
                onClick={updateProduct}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <FaFloppyDisk className="text-xs" />
                <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardProductDetails;
