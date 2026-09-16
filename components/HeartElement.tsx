"use client";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";

const HeartElement = ({ wishQuantity }: { wishQuantity: number }) => {
  return (
    <Link
      href="/wishlist"
      className="group relative flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50/70 border border-slate-200/80 hover:border-rose-200 transition-all active:scale-95 shrink-0"
      aria-label="Wishlist"
    >
      <div className="relative flex items-center justify-center">
        <FaHeart className="text-base text-slate-500 group-hover:text-rose-500 transition-colors" />
        {wishQuantity > 0 && (
          <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs border-2 border-white">
            {wishQuantity > 99 ? '99+' : wishQuantity}
          </span>
        )}
      </div>
      <span className="hidden lg:inline text-xs font-semibold text-slate-700 group-hover:text-rose-600">
        Wishlist
      </span>
    </Link>
  );
};

export default HeartElement;
