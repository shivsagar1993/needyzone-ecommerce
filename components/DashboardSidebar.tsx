"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdCategory,
} from "react-icons/md";
import {
  FaTable,
  FaRegUser,
  FaGear,
  FaBagShopping,
  FaStore,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import { FaFileUpload } from "react-icons/fa";

const navSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: MdDashboard, exact: true },
    ],
  },
  {
    title: "Commerce",
    items: [
      { name: "Orders", href: "/admin/orders", icon: FaBagShopping },
      { name: "Products", href: "/admin/products", icon: FaTable },
      { name: "Bulk Upload", href: "/admin/bulk-upload", icon: FaFileUpload },
      { name: "Categories", href: "/admin/categories", icon: MdCategory },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", href: "/admin/users", icon: FaRegUser },
      { name: "Merchants", href: "/admin/merchant", icon: FaStore },
      { name: "Settings", href: "/admin/settings", icon: FaGear },
    ],
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full xl:w-72 bg-slate-950 text-slate-300 border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className={`text-base ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Link */}
      <div className="pt-6 mt-6 border-t border-slate-800/80">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-800"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Storefront Live</span>
          </div>
          <FaArrowUpRightFromSquare className="text-[11px] opacity-70" />
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
