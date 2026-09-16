export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";

const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    const textArray = text.split("-");
    return textArray.join(" ");
  } else {
    return text;
  }
};

const ShopPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const currentCategoryName =
    awaitedParams?.slug && awaitedParams?.slug[0]?.length > 0
      ? sanitize(improveCategoryText(awaitedParams?.slug[0]))
      : "All Products";

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <Breadcrumb />

        {/* Page Banner / Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block mb-2">
              Store Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 capitalize">
              {currentCategoryName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Browse our complete range of certified electronics and high-tech gear.
            </p>
          </div>
          <SortBy />
        </div>

        {/* Main Grid: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Filters />
          </div>
          <div className="lg:col-span-3 flex flex-col">
            <Products params={awaitedParams} searchParams={awaitedSearchParams} />
            <div className="mt-8 flex justify-center">
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
