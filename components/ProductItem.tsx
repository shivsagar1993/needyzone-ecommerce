import Image from "next/image";
import React from "react";
import Link from "next/link";
import { sanitize } from "@/lib/sanitize";
import { FaStar, FaArrowRight, FaCheck } from "react-icons/fa6";

const ProductItem = ({
  product,
  color = "black",
}: {
  product: Product;
  color?: string;
}) => {
  const inStock = product?.inStock > 0;
  const rating = product?.rating || 4;

  return (
    <div className="group w-full flex flex-col justify-between bg-white border border-slate-200/80 hover:border-red-500/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      {/* Top Meta: Manufacturer & Stock Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {sanitize(product?.manufacturer) || "Brand"}
        </span>
        {inStock ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            In Stock
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
            Sold Out
          </span>
        )}
      </div>

      {/* Product Image Stage */}
      <Link
        href={`/product/${product?.slug}`}
        className="relative w-full h-52 sm:h-56 bg-slate-50 group-hover:bg-slate-100/60 rounded-xl flex items-center justify-center p-4 mb-4 transition-colors overflow-hidden"
      >
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
          width={220}
          height={220}
          alt={sanitize(product?.title) || "Product image"}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        {/* Star Ratings */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-xs ${
                i < rating ? "text-amber-400" : "text-slate-200"
              }`}
            />
          ))}
          <span className="text-[11px] text-slate-400 ml-1 font-medium">
            ({rating}.0)
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product?.slug}`}
          className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-3"
          title={sanitize(product?.title)}
        >
          {sanitize(product?.title)}
        </Link>
      </div>

      {/* Price & Action Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Price</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            ${product?.price}
          </span>
        </div>

        <Link
          href={`/product/${product?.slug}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 group-hover:bg-red-600 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 shrink-0"
        >
          <span>View Details</span>
          <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
