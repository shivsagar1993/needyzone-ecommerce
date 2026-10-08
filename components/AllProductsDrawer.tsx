"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FaXmark,
  FaChevronRight,
  FaMagnifyingGlass,
  FaStore,
  FaBolt,
  FaFire,
  FaTag,
  FaStar,
  FaCamera,
  FaMobileScreenButton,
  FaLaptop,
  FaHeadphones,
  FaClock,
  FaVolumeHigh,
  FaTabletScreenButton,
  FaPlug,
  FaNetworkWired,
  FaMicrochip,
  FaHardDrive,
  FaFolder,
  FaCartShopping,
  FaFileInvoice,
  FaShieldHalved,
  FaUser,
  FaArrowRight,
  FaRotateRight,
  FaBoxOpen,
} from "react-icons/fa6";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly } from "@/utils/categoryFormating";

interface AllProductsDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  isVisible?: boolean;
}

const getCategoryIcon = (slugOrName: string): React.ComponentType<{ className?: string }> => {
  const s = slugOrName.toLowerCase();
  if (s.includes("cctv") || s.includes("camera") || s.includes("nvr") || s.includes("security")) return FaCamera;
  if (s.includes("phone") || s.includes("mobile")) return FaMobileScreenButton;
  if (s.includes("laptop") || s.includes("computer") || s.includes("pc")) return FaLaptop;
  if (s.includes("headphone") || s.includes("earbud") || s.includes("audio")) return FaHeadphones;
  if (s.includes("watch") || s.includes("wearable") || s.includes("clock")) return FaClock;
  if (s.includes("speaker") || s.includes("sound")) return FaVolumeHigh;
  if (s.includes("tablet")) return FaTabletScreenButton;
  if (s.includes("cable") || s.includes("wire")) return FaBolt;
  if (s.includes("charger") || s.includes("plug") || s.includes("power")) return FaPlug;
  if (s.includes("network") || s.includes("wifi") || s.includes("router")) return FaNetworkWired;
  if (s.includes("switch") || s.includes("chip")) return FaMicrochip;
  if (s.includes("usb") || s.includes("storage") || s.includes("drive")) return FaHardDrive;
  return FaFolder;
};

const formatDisplayName = (rawName: string): string => {
  if (!rawName) return "Category";
  if (rawName.includes("-")) {
    return rawName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
};

const AllProductsDrawer = ({ open, onClose }: AllProductsDrawerProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    apiClient
      .get(`/api/categories?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [open]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return cat.name.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q);
  });

  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} initialFocus={closeButtonRef}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300 motion-reduce:transition-none"
                enterFrom="-translate-x-full motion-reduce:transform-none"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200 motion-reduce:transition-none"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full motion-reduce:transform-none"
              >
                <Dialog.Panel className="pointer-events-auto flex h-full w-screen max-w-md flex-col bg-white shadow-2xl">
                  {/* Professional Sidebar Top Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between border-b border-slate-700/60 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-200 shadow-inner">
                        <FaUser className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        {session?.user ? (
                          <>
                            <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
                            <p className="text-sm font-bold text-white truncate max-w-[190px]">
                              {session.user.name || session.user.email}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-slate-400 font-medium">Hello, Guest</p>
                            <Link
                              href="/login"
                              onClick={onClose}
                              className="text-sm font-bold text-white hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                            >
                              <span>Sign In / Register</span>
                              <FaChevronRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={onClose}
                      aria-label="Close sidebar menu"
                      className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <FaXmark className="text-sm" />
                    </button>
                  </div>

                  {/* Search inside Sidebar */}
                  <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200/80">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search departments or products..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
                      />
                    </form>
                  </div>

                  {/* Scrollable Navigation Body */}
                  <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 space-y-6">
                    {/* Trending & Quick Links */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
                        <FaFire className="text-red-500 text-xs" />
                        <span>Trending & Highlights</span>
                      </p>
                      <div className="space-y-1">
                        <Link
                          href="/shop"
                          onClick={onClose}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <FaStore className="text-xs" />
                            </div>
                            <span>All Products Catalog</span>
                          </div>
                          <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          href="/shop?sort=newest"
                          onClick={onClose}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                              <FaBolt className="text-xs" />
                            </div>
                            <span>New Arrivals & Hot Tech</span>
                          </div>
                          <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          href="/shop?featured=true"
                          onClick={onClose}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <FaStar className="text-xs" />
                            </div>
                            <span>Featured Electronics</span>
                          </div>
                          <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          href="/shop?sort=priceAsc"
                          onClick={onClose}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                              <FaTag className="text-xs" />
                            </div>
                            <span>Special Value Deals</span>
                          </div>
                          <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </div>
                    </div>

                    <div className="h-px bg-slate-200/80" />

                    {/* Shop by Department / Categories Section */}
                    <div>
                      <div className="flex items-center justify-between px-3 mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Shop by Department
                        </p>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          {filteredCategories.length} Departments
                        </span>
                      </div>

                      {loading ? (
                        <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs">
                          <FaRotateRight className="animate-spin text-lg text-blue-600 mb-2" />
                          <span>Loading departments...</span>
                        </div>
                      ) : filteredCategories.length === 0 ? (
                        <div className="py-6 px-4 text-center rounded-xl bg-slate-50 border border-slate-200/60">
                          <FaBoxOpen className="mx-auto text-xl text-slate-300 mb-1" />
                          <p className="text-xs text-slate-500 font-medium">No departments found</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredCategories.map((category) => {
                            const rawName = category.name || category.id || "";
                            const slug = category.id || convertCategoryNameToURLFriendly(rawName);
                            const displayName = formatDisplayName(rawName);
                            const IconComponent = getCategoryIcon(`${slug} ${rawName}`);
                            const isActive = pathname === `/shop/${slug}`;

                            return (
                              <Link
                                key={category.id}
                                href={`/shop/${slug}`}
                                onClick={onClose}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                                  isActive
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "text-slate-700 hover:text-blue-600 hover:bg-slate-100/80"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                      isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                                    }`}
                                  >
                                    <IconComponent className="text-xs" />
                                  </div>
                                  <span className="truncate">{displayName}</span>
                                </div>
                                <FaChevronRight
                                  className={`text-[10px] shrink-0 transition-all ${
                                    isActive
                                      ? "text-white/80"
                                      : "text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5"
                                  }`}
                                />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-slate-200/80" />

                    {/* Orders & Customer Services */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                        Orders & Customer Services
                      </p>
                      <div className="space-y-1">
                        <Link
                          href="/cart"
                          onClick={onClose}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <FaCartShopping className="text-xs" />
                            </div>
                            <span>Track Order / My Cart</span>
                          </div>
                          <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          href="/checkout"
                          onClick={onClose}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <FaFileInvoice className="text-xs" />
                            </div>
                            <span>Request Pro-Forma Invoice</span>
                          </div>
                          <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={onClose}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/60 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <FaShieldHalved className="text-xs" />
                              </div>
                              <span>Admin Dashboard</span>
                            </div>
                            <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Sidebar Bottom Action */}
                  <div className="border-t border-slate-200 bg-slate-50 p-4 sm:px-6">
                    <Link
                      href="/shop"
                      onClick={onClose}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-blue-600 px-4 py-3 text-xs font-bold text-white transition-all shadow-sm active:scale-98"
                    >
                      <FaStore className="text-xs" />
                      <span>Browse Complete Catalog</span>
                      <FaArrowRight className="text-[10px]" />
                    </Link>
                    <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                      NeedyZone • Genuine Tech for Everyday Needs
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AllProductsDrawer;
