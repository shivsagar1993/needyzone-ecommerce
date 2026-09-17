import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { FALLBACK_PRODUCTS } from "@/utils/fallbackProducts";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    if (!query.trim()) {
      return NextResponse.json(FALLBACK_PRODUCTS);
    }

    const q = query.toLowerCase();

    try {
      const dbMatches = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        include: {
          category: true,
        },
      });

      if (dbMatches && dbMatches.length > 0) {
        return NextResponse.json(dbMatches);
      }
    } catch (dbErr) {
      console.warn("[API /api/search] DB search error, falling back:", dbErr);
    }

    // Filter fallback products
    const fallbackMatches = FALLBACK_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category && p.category.name.toLowerCase().includes(q))
    );

    return NextResponse.json(fallbackMatches);
  } catch (error: any) {
    console.error("[API /api/search] Error:", error);
    return NextResponse.json(FALLBACK_PRODUCTS);
  }
}

