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

export async function GET() {
  try {
    try {
      const dbCategories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
      if (dbCategories && dbCategories.length > 0) {
        return NextResponse.json(dbCategories);
      }
    } catch (dbErr) {
      console.warn("[API /api/categories] DB read error:", dbErr);
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
    } catch (dbErr) {
      return NextResponse.json({ id: nanoid(), name }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

