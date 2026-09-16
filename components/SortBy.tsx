"use client";
import React from "react";
import { useSortStore } from "@/app/_zustand/sortStore";
import { FaArrowDownShortWide } from "react-icons/fa6";

const SortBy = () => {
  const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort-select" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <FaArrowDownShortWide className="text-xs text-blue-600" />
        <span>Sort:</span>
      </label>
      <select
        id="sort-select"
        defaultValue={sortBy}
        onChange={(e) => changeSortBy(e.target.value)}
        className="bg-white text-slate-800 text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer shadow-sm"
        name="sort"
      >
        <option value="defaultSort">Featured / Default</option>
        <option value="titleAsc">Name: A to Z</option>
        <option value="titleDesc">Name: Z to A</option>
        <option value="lowPrice">Price: Low to High</option>
        <option value="highPrice">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortBy;
