"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import {
  FaLaptop,
  FaMobileScreenButton,
  FaHeadphones,
  FaCamera,
  FaClock,
  FaStore,
  FaVolumeHigh,
  FaTabletScreenButton,
  FaTruckFast,
  FaFileInvoice,
  FaArrowUpRightFromSquare,
  FaBolt,
  FaPlug,
} from "react-icons/fa6";

const categoryLinks = [
  { name: "All Products", href: "/shop", icon: FaStore },
  { name: "CCTV & Security", href: "/shop/cctv-security", icon: FaCamera },
  { name: "Smartphones", href: "/shop/smart-phones", icon: FaMobileScreenButton },
  { name: "Fast Cables", href: "/shop/data-cables", icon: FaBolt },
  { name: "PD Chargers", href: "/shop/mobile-chargers", icon: FaPlug },
  { name: "Laptops", href: "/shop/laptops", icon: FaLaptop },
  { name: "Headphones", href: "/shop/headphones", icon: FaHeadphones },
  { name: "Smart Watches", href: "/shop/watches", icon: FaClock },
  { name: "Speakers", href: "/shop/speakers", icon: FaVolumeHigh },
  { name: "Tablets", href: "/shop/tablets", icon: FaTabletScreenButton },
];

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { wishQuantity } = useWishlistStore();

  const handleLogout = () => {
    setTimeout(() => signOut(), 500);
    toast.success("Logged out successfully");
  };

  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="bg-white sticky top-0 z-40 shadow-xs transition-all print:hidden">
      {!isAdmin && <HeaderTop />}

      {!isAdmin ? (
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
            {/* Primary Header Row */}
            <div className="h-18 sm:h-20 flex items-center justify-between gap-4 lg:gap-8">
              {/* Brand Logo */}
              <Link href="/" className="flex items-center shrink-0 group py-1">
                <Image
                  src="/needyzone-logo.png"
                  width={180}
                  height={55}
                  alt="NeedyZone"
                  className="h-9 sm:h-11 w-auto object-contain group-hover:scale-[1.02] transition-transform"
                  priority
                />
              </Link>

              {/* Central Search Bar */}
              <div className="flex-1 max-w-2xl hidden md:block">
                <SearchInput />
              </div>

              {/* Action Clusters */}
              <div className="flex items-center gap-2 sm:gap-3">
                <HeartElement wishQuantity={wishQuantity} />
                <CartElement />
              </div>
            </div>

            {/* Mobile Search Row (visible on small viewports) */}
            <div className="pb-3 md:hidden">
              <SearchInput />
            </div>

            {/* Category Navigation Strip */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs font-medium">
              <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {categoryLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 transition-all ${
                        isActive
                          ? "bg-red-50 text-red-600 font-bold border border-red-200/80 shadow-2xs"
                          : "text-slate-600 hover:text-red-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="text-xs opacity-75" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Store Links on desktop */}
              <div className="hidden xl:flex items-center gap-5 text-slate-500 text-xs shrink-0 pl-4 border-l border-slate-200">
                <Link
                  href="/cart"
                  className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                >
                  <FaTruckFast className="text-red-500 text-xs" />
                  <span>Order Status</span>
                </Link>
                <Link
                  href="/checkout"
                  className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                >
                  <FaFileInvoice className="text-blue-600 text-xs" />
                  <span className="font-semibold text-slate-700 hover:text-red-600">
                    Request Pro-Forma
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Modern Admin Topbar */
        <div className="h-16 bg-white border-b border-slate-200/80 px-6 lg:px-10 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <Image
                src="/needyzone-logo.png"
                width={120}
                height={40}
                alt="NeedyZone"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 ml-1">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-x-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <FaArrowUpRightFromSquare className="text-[11px]" />
              <span className="hidden sm:inline">View Storefront</span>
            </Link>

            <NotificationBell />

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                  {session?.user?.email || "Admin"}
                </span>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 ring-2 ring-blue-500/20">
                  <Image
                    src="/randomuser.jpg"
                    alt="admin profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-50 menu p-2 shadow-xl bg-white border border-slate-200 rounded-xl w-56 mt-2 text-sm"
              >
                <li className="menu-title text-xs text-slate-400 font-semibold px-3 py-1">
                  Management
                </li>
                <li>
                  <Link href="/admin" className="rounded-lg hover:bg-slate-50">
                    Dashboard Overview
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products" className="rounded-lg hover:bg-slate-50">
                    Manage Products
                  </Link>
                </li>
                <li>
                  <Link href="/admin/orders" className="rounded-lg hover:bg-slate-50">
                    Manage Orders
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li onClick={handleLogout}>
                  <button className="text-rose-600 hover:bg-rose-50 rounded-lg">
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
