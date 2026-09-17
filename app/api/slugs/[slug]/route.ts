import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { FALLBACK_PRODUCTS } from "@/utils/fallbackProducts";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    try {
      const product = await prisma.product.findFirst({
        where: { slug },
        include: {
          category: true,
        },
      });

      if (product) {
        return NextResponse.json(product);
      }
    } catch (dbErr) {
      console.warn("[API /api/slugs/[slug]] DB query error, checking fallback:", dbErr);
    }

    // Match by slug or id in curated fallback products
    const fallback = FALLBACK_PRODUCTS.find(
      (p) => p.slug === slug || p.id === slug
    );

    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error: any) {
    console.error("[API /api/slugs/[slug]] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

