"use client";
import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { useAllProductsDrawer } from "./AllProductsProvider";
import Image from "next/image";
import Heading from "./Heading";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly } from "@/utils/categoryFormating";
import { FaFolderOpen } from "react-icons/fa6";

interface CategoryMenuItem {
  id: string | number;
  title: string;
  src: string;
  href?: string;
}

const getCategoryImage = (slug: string, name: string): string => {
  const key = `${slug} ${name}`.toLowerCase();
  if (key.includes("cctv") || key.includes("camera") || key.includes("nvr") || key.includes("security")) {
    return "/dept-cctv.jpg";
  }
  if (key.includes("phone") || key.includes("mobile") || key.includes("smart-phone")) {
    return "/dept-smartphone.jpg";
  }
  if (key.includes("laptop") || key.includes("computer") || key.includes("pc")) {
    return "/dept-laptop.jpg";
  }
  if (key.includes("headphone") || key.includes("earbud") || key.includes("audio") || key.includes("speaker")) {
    return "/stock-headphones.jpg";
  }
  if (key.includes("watch") || key.includes("wearable") || key.includes("clock")) {
    return "/stock-smartwatch.jpg";
  }
  if (key.includes("cable") || key.includes("wire") || key.includes("cord")) {
    return "/dept-cables.jpg";
  }
  if (key.includes("charger") || key.includes("adapter") || key.includes("power-bank")) {
    return "/dept-charger.jpg";
  }
  if (key.includes("power") || key.includes("strip") || key.includes("extension")) {
    return "/dept-powerstrip.jpg";
  }
  if (key.includes("network") || key.includes("wifi") || key.includes("router")) {
    return "/dept-networking.jpg";
  }
  if (key.includes("switch") || key.includes("iot") || key.includes("smart")) {
    return "/dept-smartswitch.jpg";
  }
  if (key.includes("usb") || key.includes("storage") || key.includes("ssd") || key.includes("drive")) {
    return "/dept-storage.jpg";
  }
  if (key.includes("light") || key.includes("bulb") || key.includes("lamp")) {
    return "/dept-lighting.jpg";
  }
  return "/product_placeholder.jpg";
};

const formatDisplayTitle = (rawName: string): string => {
  if (!rawName) return "Category";
  if (rawName.includes("-")) {
    return rawName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
};

const mapCategoriesToItems = (categories: any[]): CategoryMenuItem[] => {
  const items: CategoryMenuItem[] = categories.map((cat) => {
    const rawName = cat.name || cat.id || "";
    const slug = cat.id || convertCategoryNameToURLFriendly(rawName);
    const title = formatDisplayTitle(rawName);
    const keywordImage = getCategoryImage(slug, title);
    const prodImg = cat.products?.[0]?.mainImage;
    const src = prodImg
      ? (prodImg.startsWith("http") || prodImg.startsWith("/") ? prodImg : `/${prodImg}`)
      : keywordImage;

    return {
      id: cat.id,
      title,
      src,
      href: `/shop/${slug}`,
    };
  });

  items.push({
    id: "all-products-link",
    title: "All Products",
    src: "/dept-lighting.jpg",
  });

  return items;
};

interface CategoryMenuProps {
  initialCategories?: any[];
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ initialCategories = [] }) => {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const { open: allProductsOpen, openDrawer } = useAllProductsDrawer();

  useEffect(() => {
    apiClient
      .get(`/api/categories?showOnHome=true&t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  const items = mapCategoriesToItems(categories);

  return (
    <section className="border-b border-slate-200/60 bg-slate-50/80 py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
          <Heading
            badge="Departments"
            title="Browse by Category"
            subtitle="Explore top technology segments, from daily smart devices to high-end creator gear."
            center={true}
          />

          {categories.length === 0 && (
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200/80 bg-white px-6 py-10 text-center shadow-xs">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <FaFolderOpen className="text-2xl" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Categories Configured</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                There are currently no departments set to display on the storefront. Browse the complete catalog using the All Products card.
              </p>
            </div>
          )}

          <div
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${
              categories.length === 0 ? "mt-6" : "mt-10"
            }`}
          >
            {items.map((item) => {
              const isAllProducts = item.id === "all-products-link";

              return (
                <CategoryItem
                  title={item.title}
                  key={item.id}
                  href={item.href}
                  onClick={isAllProducts ? openDrawer : undefined}
                  expanded={isAllProducts ? allProductsOpen : undefined}
                >
                  <div className="relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50/60 p-3 transition-colors group-hover:bg-blue-50/40">
                    <Image
                      src={item.src}
                      width={160}
                      height={160}
                      alt={item.title}
                      className="h-full w-full object-contain drop-shadow-2xs transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </CategoryItem>
              );
            })}
          </div>
        </div>
    </section>
  );
};

export default CategoryMenu;
