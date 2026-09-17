"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  showSummary?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage: propPage,
  totalPages: propTotalPages,
  totalItems: propTotalItems,
  pageSize: propPageSize = 9,
  onPageChange,
  showSummary = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    page: storePage,
    totalPages: storeTotalPages,
    totalItems: storeTotalItems,
    pageSize: storePageSize,
    setPage: setStorePage,
    setPagination,
  } = usePaginationStore();

  // Sync props into store if passed
  useEffect(() => {
    if (propPage !== undefined || propTotalPages !== undefined || propTotalItems !== undefined) {
      setPagination({
        page: propPage,
        totalPages: propTotalPages,
        totalItems: propTotalItems,
        pageSize: propPageSize,
      });
    }
  }, [propPage, propTotalPages, propTotalItems, propPageSize, setPagination]);

  const activePage = propPage ?? storePage ?? 1;
  const totalPages = Math.max(1, propTotalPages ?? storeTotalPages ?? 1);
  const totalItems = propTotalItems ?? storeTotalItems ?? 0;
  const pageSize = propPageSize ?? storePageSize ?? 9;

  const startItem = totalItems > 0 ? (activePage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(activePage * pageSize, totalItems);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === activePage) return;

    setStorePage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }

    try {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
      params.set("page", String(newPage));
      router.push(`${pathname}?${params.toString()}`);
    } catch (_) {}

    // Smooth scroll to catalog top
    const catalogElement = document.getElementById("products-catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate pagination pill items
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (activePage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (activePage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", activePage - 1, activePage, activePage + 1, "...", totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4">
      {/* Item Range Summary */}
      {showSummary && (
        <div className="text-xs sm:text-sm text-slate-500 order-2 md:order-1 text-center md:text-left">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-bold text-slate-900">{startItem}</span> to{" "}
              <span className="font-bold text-slate-900">{endItem}</span> of{" "}
              <span className="font-bold text-slate-900">{totalItems}</span> products
              {totalPages > 1 && (
                <span className="ml-1.5 text-slate-400">
                  • Page <span className="font-semibold text-slate-700">{activePage}</span> of{" "}
                  <span className="font-semibold text-slate-700">{totalPages}</span>
                </span>
              )}
            </>
          ) : (
            <span>No products to display</span>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="inline-flex items-center gap-1.5 order-1 md:order-2">
          {/* Jump to First Page */}
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={activePage <= 1}
            title="First Page"
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all border ${
              activePage <= 1
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                : "border-slate-200/90 text-slate-600 bg-white hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 shadow-sm active:scale-95"
            }`}
          >
            <FaAnglesLeft className="text-[11px]" />
          </button>

          {/* Previous Page */}
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage <= 1}
            title="Previous Page"
            className={`px-3 h-9 flex items-center gap-1 rounded-xl text-xs font-semibold transition-all border ${
              activePage <= 1
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                : "border-slate-200/90 text-slate-600 bg-white hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 shadow-sm active:scale-95"
            }`}
          >
            <FaChevronLeft className="text-[10px]" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Number Pills */}
          <div className="flex items-center gap-1">
            {pages.map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-7 text-center text-xs text-slate-400 select-none font-bold tracking-widest"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === activePage;

              return (
                <button
                  key={`page-${pageNum}`}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isActive
                      ? "bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-600/30 scale-105 pointer-events-none"
                      : "bg-white text-slate-700 border border-slate-200/90 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 active:scale-95"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage >= totalPages}
            title="Next Page"
            className={`px-3 h-9 flex items-center gap-1 rounded-xl text-xs font-semibold transition-all border ${
              activePage >= totalPages
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                : "border-slate-200/90 text-slate-600 bg-white hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 shadow-sm active:scale-95"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <FaChevronRight className="text-[10px]" />
          </button>

          {/* Jump to Last Page */}
          <button
            type="button"
            onClick={() => handlePageChange(totalPages)}
            disabled={activePage >= totalPages}
            title="Last Page"
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all border ${
              activePage >= totalPages
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                : "border-slate-200/90 text-slate-600 bg-white hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 shadow-sm active:scale-95"
            }`}
          >
            <FaAnglesRight className="text-[11px]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;

