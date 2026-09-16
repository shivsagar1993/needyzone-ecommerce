"use client";
import React from "react";
import { FaHeadphones, FaRegEnvelope, FaClock, FaFileInvoiceDollar } from "react-icons/fa6";

const HeaderTop = () => {
  return (
    <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800/80">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left: Direct Support Contacts */}
        <div className="flex items-center gap-x-4 sm:gap-x-6 text-slate-400 text-[11px] sm:text-xs">
          <a
            href="tel:+38161123321"
            className="flex items-center gap-x-1.5 hover:text-white transition-colors"
          >
            <FaHeadphones className="text-blue-400 text-xs" />
            <span className="font-medium">+381 61 123 321</span>
          </a>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <a
            href="mailto:support@needyzone.com"
            className="hidden md:flex items-center gap-x-1.5 hover:text-white transition-colors"
          >
            <FaRegEnvelope className="text-red-400 text-xs" />
            <span>support@needyzone.com</span>
          </a>
          <span className="text-slate-700 hidden lg:inline">•</span>
          <div className="hidden lg:flex items-center gap-x-1.5 text-slate-400">
            <FaClock className="text-slate-500 text-xs" />
            <span>Mon - Fri: 09:00 - 18:00</span>
          </div>
        </div>

        {/* Right: Direct Ordering Reassurance */}
        <div className="flex items-center gap-x-4 text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-x-1.5 text-red-300 font-medium">
            <FaFileInvoiceDollar className="text-red-400 text-xs" />
            <span>NeedyZone Verified Catalog • Instant Pro-Forma</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
