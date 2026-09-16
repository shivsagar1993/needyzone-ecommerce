import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";
import { FaMagnifyingGlass } from "react-icons/fa6";

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

  let products = [];

  try {
    const data = await apiClient.get(
      `/api/products?filters[price][$lte]=${
        searchParams?.price || 3000
      }&filters[rating][$gte]=${
        Number(searchParams?.rating) || 0
      }&filters[inStock][$${stockMode}]=1&${
        params?.slug && params?.slug?.length > 0
          ? `filters[category][$equals]=${params?.slug}&`
          : ""
      }sort=${searchParams?.sort || "defaultSort"}&page=${page}`
    );

    if (!data.ok) {
      console.error("Failed to fetch products:", data.statusText);
      products = [];
    } else {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
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
