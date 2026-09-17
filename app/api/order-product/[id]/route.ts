import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      const items = await prisma.customer_order_product.findMany({
        where: { customerOrderId: id },
        include: {
          product: true,
        },
      });

      return NextResponse.json(items || []);
    } catch (dbErr) {
      console.warn("[API /api/order-product/[id]] DB read error:", dbErr);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    return NextResponse.json([]);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      await prisma.customer_order_product.deleteMany({
        where: { customerOrderId: id },
      });
    } catch (dbErr) {
      console.warn("[API /api/order-product/[id]] DB delete error:", dbErr);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Delete failed" }, { status: 500 });
  }
}

