import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { FALLBACK_PRODUCTS } from "@/utils/fallbackProducts";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });

      if (product) {
        return NextResponse.json(product);
      }
    } catch (dbErr) {
      console.warn("[API /api/products/[id]] DB read error:", dbErr);
    }

    const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...body,
          price: body.price !== undefined ? Number(body.price) : undefined,
          inStock: body.inStock !== undefined ? Number(body.inStock) : undefined,
          rating: body.rating !== undefined ? Number(body.rating) : undefined,
        },
      });
      return NextResponse.json(updated);
    } catch (dbErr) {
      console.warn("[API /api/products/[id]] DB update error:", dbErr);
      return NextResponse.json({ ...body, id });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      // Unlink customer orders first to prevent foreign key errors
      await prisma.customer_order_product.deleteMany({
        where: { productId: id },
      });

      await prisma.product.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("[API /api/products/[id]] DB delete error:", dbErr);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
  }
}

