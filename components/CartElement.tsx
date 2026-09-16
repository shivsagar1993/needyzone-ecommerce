"use client";
import Link from 'next/link';
import React from 'react';
import { FaCartShopping } from 'react-icons/fa6';
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
  const { allQuantity, total } = useProductStore();
  return (
    <Link
      href="/cart"
      className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white transition-all shadow-sm active:scale-95 shrink-0"
      aria-label="Order Enquiry & Cart"
    >
      <div className="relative flex items-center justify-center">
        <FaCartShopping className="text-base sm:text-lg transition-transform group-hover:scale-105" />
        {allQuantity > 0 && (
          <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs border-2 border-slate-900">
            {allQuantity > 99 ? '99+' : allQuantity}
          </span>
        )}
      </div>
      <div className="flex flex-col items-start leading-none text-left">
        <span className="text-[10px] font-medium text-slate-300 group-hover:text-red-100 uppercase tracking-wider">
          Enquiry
        </span>
        <span className="text-xs font-bold text-white mt-0.5">
          {total > 0 ? `${total}` : "Cart (0)"}
        </span>
      </div>
    </Link>
  );
};

export default CartElement;