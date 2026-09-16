"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const sanitizedSearch = sanitize(searchInput.trim());
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
  };

  return (
    <form
      className="relative w-full flex items-center"
      onSubmit={searchProducts}
    >
      <div className="absolute left-3.5 pointer-events-none text-slate-400 flex items-center">
        <FaMagnifyingGlass className="text-sm" />
      </div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search CCTV, data cables, chargers, switch boards..."
        className="w-full bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
      />
      {searchInput && (
        <button
          type="button"
          onClick={() => setSearchInput("")}
          className="absolute right-22 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Clear search input"
        >
          <FaXmark className="text-xs" />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-xs px-5 py-2 rounded-lg transition-all shadow-xs"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
