import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { FALLBACK_PRODUCTS } from "@/utils/fallbackProducts";

const ProductsSection = async () => {
  let products = FALLBACK_PRODUCTS;
  
  try {
    const data = await apiClient.get("/api/products");
    
    if (data.ok) {
      const result = await data.json();
      if (Array.isArray(result) && result.length > 0) {
        products = result;
      }
    }
  } catch (_error) {
    // Gracefully use curated NeedyZone fallback products when backend API is offline
    products = FALLBACK_PRODUCTS;
  }

  return (
    <section className="bg-white py-20 border-b border-slate-200/60">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-red-600 uppercase bg-red-50 border border-red-100 rounded-full">
              Trending Now
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Featured Electronics
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl">
              Explore high-performance smartphones, premium cameras, audio gear, and laptops.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 group shrink-0"
          >
            <span>Browse Complete Catalog</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
