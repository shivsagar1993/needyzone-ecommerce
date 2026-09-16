import Link from "next/link";
import React from "react";
import { FaHouse, FaChevronRight } from "react-icons/fa6";

const Breadcrumb = () => {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 py-6">
      <Link href="/" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
        <FaHouse className="text-xs text-slate-400" />
        <span>Home</span>
      </Link>
      <FaChevronRight className="text-[10px] text-slate-400" />
      <Link href="/shop" className="hover:text-slate-900 transition-colors">
        Shop
      </Link>
      <FaChevronRight className="text-[10px] text-slate-400" />
      <span className="text-blue-600 font-semibold">Catalog</span>
    </nav>
  );
};

export default Breadcrumb;
