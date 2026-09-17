import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDebug = searchParams.get("debug") === "1";

    try {
      const dbCategories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
      if (isDebug) {
        return NextResponse.json({
          debug: true,
          count: dbCategories?.length || 0,
          categories: dbCategories,
          dbUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 15) : "none",
        });
      }
      if (dbCategories && dbCategories.length > 0) {
        return NextResponse.json(dbCategories);
      }
    } catch (dbErr: any) {
      console.warn("[API /api/categories] DB read error:", dbErr);
      if (isDebug) {
        return NextResponse.json({
          debug: true,
          error: dbErr?.message,
          code: dbErr?.code,
          dbUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 15) : "none",
        }, { status: 500 });
      }
    }
    return NextResponse.json(DEFAULT_CATEGORIES);
  } catch (error: any) {
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    try {
      const created = await prisma.category.create({
        data: {
          id: nanoid(),
          name: name || "New Category",
        },
      });
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      console.error("[API /api/categories POST] DB error:", dbErr);
      return NextResponse.json(
        {
          error: dbErr?.message || "Failed to save category to database",
          code: dbErr?.code,
          dbUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 15) : "none",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

