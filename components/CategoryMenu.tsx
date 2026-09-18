"use client";
import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import Heading from "./Heading";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly } from "@/utils/categoryFormating";
import { FaFolderOpen } from "react-icons/fa6";

interface CategoryMenuItem {
  id: string | number;
  title: string;
  src: string;
  href: string;
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

  if (items.length > 0) {
    items.push({
      id: "all-products-link",
      title: "All Products",
      src: "/dept-lighting.jpg",
      href: "/shop",
    });
  }

  return items;
};

interface CategoryMenuProps {
  initialCategories?: any[];
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ initialCategories = [] }) => {
  const [categories, setCategories] = useState<any[]>(initialCategories);

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
    <section className="py-20 bg-slate-50/80 border-b border-slate-200/60">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <Heading
          badge="Departments"
          title="Browse by Category"
          subtitle="Explore top technology segments, from daily smart devices to high-end creator gear."
          center={true}
        />

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-10">
            {items.map((item) => (
              <CategoryItem title={item.title} key={item.id} href={item.href}>
                <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-slate-50/60 p-3 mb-2 flex items-center justify-center group-hover:bg-blue-50/40 transition-colors">
                  <Image
                    src={item.src}
                    width={160}
                    height={160}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xs"
                  />
                </div>
              </CategoryItem>
            ))}
          </div>
        ) : (
          <div className="mt-10 py-16 px-6 rounded-2xl bg-white border border-slate-200/80 text-center max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <FaFolderOpen className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Categories Configured</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              There are currently no departments set to display on the storefront. Add or enable categories in the Admin Dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryMenu;
