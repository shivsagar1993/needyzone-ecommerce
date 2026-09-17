export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import os from "os";

const DEFAULT_CATEGORIES = [
  { id: "cctv-security", name: "CCTV & Security" },
  { id: "mobile-chargers", name: "Mobile Chargers" },
  { id: "data-cables", name: "Data Cables" },
  { id: "digital-switches", name: "Digital Switches" },
  { id: "power-strips", name: "Power Strips" },
  { id: "networking-devices", name: "Networking Devices" },
  { id: "usb-products", name: "USB Products" },
  { id: "cameras", name: "Cameras" },
  { id: "smart-phones", name: "Smartphones" },
  { id: "laptops", name: "Laptops" },
  { id: "headphones", name: "Headphones" },
  { id: "watches", name: "Smart Watches" },
  { id: "speakers", name: "Speakers" },
  { id: "tablets", name: "Tablets" },
];

const getCustomCategoriesFile = () => path.join(os.tmpdir(), "custom-categories.json");

const readCustomCategories = (): Array<{ id: string; name: string }> => {
  try {
    const file = getCustomCategoriesFile();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (_) {}
  return [];
};

const saveCustomCategory = (cat: { id: string; name: string }) => {
  try {
    const file = getCustomCategoriesFile();
    const existing = readCustomCategories();
    if (!existing.some((c) => c.name.toLowerCase() === cat.name.toLowerCase() || c.id === cat.id)) {
      existing.push(cat);
      fs.writeFileSync(file, JSON.stringify(existing, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("[API /api/categories] Failed writing custom category to file:", err);
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDebug = searchParams.get("debug") === "1";
    const customCats = readCustomCategories();

    let allCats: Array<{ id: string; name: string }> = [];

    try {
      const dbCategories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
      if (dbCategories && dbCategories.length > 0) {
        allCats = [...dbCategories];
      }
    } catch (dbErr: any) {
      console.warn("[API /api/categories] DB read error:", dbErr?.message);
    }

    if (allCats.length === 0) {
      allCats = [...DEFAULT_CATEGORIES];
    }

    // Merge custom categories that were added by user
    for (const custom of customCats) {
      if (!allCats.some((c) => c.id === custom.id || c.name.toLowerCase() === custom.name.toLowerCase())) {
        allCats.push(custom);
      }
    }

    // Sort alphabetically by name
    const noCacheHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    if (isDebug) {
      return NextResponse.json(
        {
          debug: true,
          count: allCats.length,
          categories: allCats,
          dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 15) : "none",
        },
        { headers: noCacheHeaders }
      );
    }

    return NextResponse.json(allCats, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json(DEFAULT_CATEGORIES, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}

export async function POST(req: NextRequest) {
  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  try {
    const body = await req.json();
    const rawName = (body.name || "").trim();

    if (!rawName) {
      return NextResponse.json({ error: "Category department name is required" }, { status: 400, headers: noCacheHeaders });
    }

    // Format readable name: e.g. "smart-watches" -> "Smart Watches"
    const categoryName = rawName.includes("-")
      ? rawName.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : rawName;

    const categoryId =
      body.id ||
      rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
      nanoid(8);

    const newCategory = { id: categoryId, name: categoryName };

    // 1. Try persisting to Prisma DB
    try {
      const existing = await prisma.category.findFirst({
        where: {
          OR: [
            { id: categoryId },
            { name: categoryName },
          ],
        },
      });

      if (existing) {
        saveCustomCategory(existing);
        return NextResponse.json(existing, { status: 200, headers: noCacheHeaders });
      }

      const created = await prisma.category.create({
        data: {
          id: categoryId,
          name: categoryName,
        },
      });

      saveCustomCategory(created);
      return NextResponse.json(created, { status: 201, headers: noCacheHeaders });
    } catch (dbErr: any) {
      console.warn("[API /api/categories POST] DB create warning, saving to file backup:", dbErr.message);
      saveCustomCategory(newCategory);
      return NextResponse.json(newCategory, { status: 201, headers: noCacheHeaders });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create category" }, { status: 500, headers: noCacheHeaders });
  }
}
