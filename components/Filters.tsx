"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { FaSliders, FaRotateLeft, FaFolderOpen } from "react-icons/fa6";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly } from "@/utils/categoryFormating";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const { page, setPage } = usePaginationStore();
  const { sortBy, changeSortBy } = useSortStore();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const isInitialized = useRef(false);

  const [inputCategory, setInputCategory] = useState<InputCategory>(() => ({
    inStock: {
      text: "instock",
      isChecked: searchParams?.get("inStock") !== "false",
    },
    outOfStock: {
      text: "outofstock",
      isChecked: searchParams?.get("outOfStock") !== "false",
    },
    priceFilter: {
      text: "price",
      value: searchParams?.get("price") ? Number(searchParams.get("price")) : 3000,
    },
    ratingFilter: {
      text: "rating",
      value: searchParams?.get("rating") ? Number(searchParams.get("rating")) : 0,
    },
  }));

  // On mount, sync URL sort and page into stores
  useEffect(() => {
    if (searchParams?.get("sort")) {
      changeSortBy(searchParams.get("sort")!);
    }
    if (searchParams?.get("page")) {
      const urlPage = Number(searchParams.get("page"));
      if (urlPage > 0) setPage(urlPage);
    }
    isInitialized.current = true;

    // Fetch dynamic categories for department filter
    apiClient
      .get(`/api/categories?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Synchronize URL when filters or sort change
  const handleFilterChange = (updater: (prev: InputCategory) => InputCategory) => {
    setInputCategory((prev) => {
      const next = updater(prev);
      setPage(1); // Reset to page 1 when user explicitly interacts with filters
      const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
      params.set("outOfStock", next.outOfStock.isChecked.toString());
      params.set("inStock", next.inStock.isChecked.toString());
      params.set("rating", next.ratingFilter.value.toString());
      params.set("price", next.priceFilter.value.toString());
      params.set("sort", sortBy);
      params.set("page", "1");
      replace(`${pathname}?${params.toString()}`);
      return next;
    });
  };

  const handleReset = () => {
    const defaultFilters: InputCategory = {
      inStock: { text: "instock", isChecked: true },
      outOfStock: { text: "outofstock", isChecked: true },
      priceFilter: { text: "price", value: 3000 },
      ratingFilter: { text: "rating", value: 0 },
    };
    setInputCategory(defaultFilters);
    setPage(1);
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("outOfStock", "true");
    params.set("inStock", "true");
    params.set("rating", "0");
    params.set("price", "3000");
    params.set("sort", sortBy);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <FaSliders className="text-blue-600 text-sm" />
          <span>Filters</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors"
          title="Reset Filters"
        >
          <FaRotateLeft className="text-[10px]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Departments / Categories Filter */}
      {categories.length > 0 && (
        <div className="py-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FaFolderOpen className="text-blue-600 text-xs" />
              <span>Departments</span>
            </h4>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {categories.length}
            </span>
          </div>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1 no-scrollbar">
            <Link
              href="/shop"
              className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/shop"
                  ? "bg-blue-50 text-blue-600 font-bold border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              All Departments
            </Link>
            {categories.map((c) => {
              const slug = c.id || convertCategoryNameToURLFriendly(c.name);
              const isActive = pathname.includes(`/shop/${slug}`);
              const displayName = c.name.includes("-")
                ? c.name
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")
                : c.name.charAt(0).toUpperCase() + c.name.slice(1);
              return (
                <Link
                  key={c.id}
                  href={`/shop/${slug}`}
                  className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold border border-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {displayName}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="py-4 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Availability
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                handleFilterChange((prev) => ({
                  ...prev,
                  inStock: {
                    text: "instock",
                    isChecked: !prev.inStock.isChecked,
                  },
                }))
              }
              className="checkbox checkbox-sm rounded-md checkbox-primary"
            />
            <span>In Stock</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                handleFilterChange((prev) => ({
                  ...prev,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !prev.outOfStock.isChecked,
                  },
                }))
              }
              className="checkbox checkbox-sm rounded-md checkbox-primary"
            />
            <span>Out of Stock</span>
          </label>
        </div>
      </div>

      {/* Price Filter */}
      <div className="py-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Price Range
          </h4>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            Up to ${inputCategory.priceFilter.value}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={3000}
          step={50}
          value={inputCategory.priceFilter.value}
          className="range range-primary range-xs w-full mt-2"
          onChange={(e) => {
            const val = Number(e.target.value);
            handleFilterChange((prev) => ({
              ...prev,
              priceFilter: { text: "price", value: val },
            }));
          }}
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$0</span>
          <span>$1,500</span>
          <span>$3,000</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Minimum Rating
          </h4>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
            {inputCategory.ratingFilter.value} ★ & up
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={inputCategory.ratingFilter.value}
          onChange={(e) => {
            const val = Number(e.target.value);
            handleFilterChange((prev) => ({
              ...prev,
              ratingFilter: { text: "rating", value: val },
            }));
          }}
          className="range range-warning range-xs w-full mt-2"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 px-1">
          <span>All</span>
          <span>1★</span>
          <span>2★</span>
          <span>3★</span>
          <span>4★</span>
          <span>5★</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
