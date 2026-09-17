import {
  StockAvailabillity,
  ProductTabs,
  SingleProductDynamicFields,
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { FaHouse, FaChevronRight, FaStar, FaShieldHeart, FaTruckFast, FaRotateLeft, FaFileInvoice } from "react-icons/fa6";
import { FaSquareFacebook, FaSquareXTwitter, FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string; id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product = await data.json();

  const imagesData = await apiClient.get(
    `/api/images/${paramsAwaited?.id}`
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  const rating = product?.rating || 4;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-8">
          <Link href="/" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <FaHouse className="text-xs text-slate-400" />
            <span>Home</span>
          </Link>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <Link href="/shop" className="hover:text-slate-900 transition-colors">
            Shop
          </Link>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="text-blue-600 font-semibold truncate max-w-xs">
            {sanitize(product?.title)}
          </span>
        </nav>

        {/* Product Card Stage */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Gallery Column */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="w-full h-80 sm:h-96 md:h-[420px] bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-8 overflow-hidden relative group">
                <Image
                  src={
                    product?.mainImage
                      ? product.mainImage.startsWith("http")
                        ? product.mainImage
                        : product.mainImage.startsWith("/")
                        ? product.mainImage
                        : `/${product.mainImage}`
                      : "/product_placeholder.jpg"
                  }
                  width={420}
                  height={420}
                  alt={sanitize(product?.title) || "Main product"}
                  priority
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
              </div>

              {images && images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((imageItem: ImageItem, key: number) => (
                    <div
                      key={imageItem.imageID + key}
                      className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-200 p-2 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors shrink-0"
                    >
                      <Image
                        src={
                          imageItem.image
                            ? imageItem.image.startsWith("http")
                              ? imageItem.image
                              : imageItem.image.startsWith("/")
                              ? imageItem.image
                              : `/${imageItem.image}`
                            : "/product_placeholder.jpg"
                        }
                        width={64}
                        height={64}
                        alt="Product thumbnail"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Actions Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Brand & Stock Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {sanitize(product?.manufacturer) || "Electronics"}
                  </span>
                  <StockAvailabillity stock={94} inStock={product?.inStock} />
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                  {sanitize(product?.title)}
                </h1>

                {/* Star Ratings */}
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < rating ? "text-amber-400" : "text-slate-200"}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-1">
                    {rating}.0
                  </span>
                  <span className="text-xs text-slate-400">
                    • Verified Purchase Reviews
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline gap-3 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    ${product?.price}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Price Includes Taxes
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mb-6">
                  <SingleProductDynamicFields product={product} />
                </div>
              </div>

              {/* Guarantees Strip */}
              <div className="pt-6 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                    <FaTruckFast className="text-blue-600 shrink-0" />
                    <span>Free Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                    <FaRotateLeft className="text-emerald-600 shrink-0" />
                    <span>30-Day Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                    <FaShieldHeart className="text-indigo-600 shrink-0" />
                    <span>2-Year Full Coverage</span>
                  </div>
                </div>

                {/* Invoice Generation Badge & Share */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <FaFileInvoice className="text-emerald-600 text-sm" />
                    <span className="font-semibold">Instant Pro-Forma Invoice • No Pre-Payment Needed</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Share:</span>
                    <div className="flex items-center gap-2 text-slate-400 text-base">
                      <FaSquareFacebook className="hover:text-blue-600 cursor-pointer transition-colors" />
                      <FaSquareXTwitter className="hover:text-slate-900 cursor-pointer transition-colors" />
                      <FaSquarePinterest className="hover:text-rose-600 cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs (Description & Reviews) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
