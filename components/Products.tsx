import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FALLBACK_PRODUCTS } from "@/utils/fallbackProducts";

const Products = async ({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  let stockMode: string = "lte";
  if (inStockNum === 1) stockMode = "equals";
  if (outOfStockNum === 1) stockMode = "lt";
  if (inStockNum === 1 && outOfStockNum === 1) stockMode = "lte";
  if (inStockNum === 0 && outOfStockNum === 0) stockMode = "gt";

  const categorySlug = params?.slug && params?.slug?.length > 0 ? params.slug[0] : "";
  let products = FALLBACK_PRODUCTS;

  try {
    const query = new URLSearchParams();
    if (searchParams?.price) query.set("price", String(searchParams.price));
    if (searchParams?.rating) query.set("rating", String(searchParams.rating));
    if (searchParams?.sort) query.set("sort", String(searchParams.sort));
    if (searchParams?.inStock) query.set("inStock", String(searchParams.inStock));
    if (searchParams?.outOfStock) query.set("outOfStock", String(searchParams.outOfStock));
    if (categorySlug) {
      query.set("category", categorySlug);
      query.set("filters[category][$equals]", categorySlug);
    }
    query.set("page", String(page));

    const data = await apiClient.get(`/api/products?${query.toString()}`);

    if (data.ok) {
      const result = await data.json();
      if (Array.isArray(result)) {
        products = result;
      }
    }
  } catch (_error) {
    // Gracefully use curated NeedyZone fallback products when backend API is offline
    products = categorySlug
      ? FALLBACK_PRODUCTS.filter((p) => (p.categoryId === categorySlug || p.category?.name === categorySlug))
      : FALLBACK_PRODUCTS;
  }

  return (
    <div className="w-full">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <FaMagnifyingGlass className="text-xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No products matched your criteria
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Try adjusting your price range, availability toggles, or category filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
