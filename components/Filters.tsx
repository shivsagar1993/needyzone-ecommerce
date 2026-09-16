"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { FaSliders, FaRotateLeft } from "react-icons/fa6";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page]);

  const handleReset = () => {
    setInputCategory({
      inStock: { text: "instock", isChecked: true },
      outOfStock: { text: "outofstock", isChecked: true },
      priceFilter: { text: "price", value: 3000 },
      ratingFilter: { text: "rating", value: 0 },
    });
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
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
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
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
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
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              priceFilter: {
                text: "price",
                value: Number(e.target.value),
              },
            })
          }
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
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
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
