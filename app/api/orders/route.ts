import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
  try {
    try {
      const orders = await prisma.customer_order.findMany({
        orderBy: { dateTime: "desc" },
      });
      return NextResponse.json({
        orders: orders || [],
        pagination: {
          page: 1,
          limit: 50,
          total: orders?.length || 0,
          totalPages: 1,
        },
      });
    } catch (dbErr) {
      console.warn("[API /api/orders] DB query error:", dbErr);
      return NextResponse.json({
        orders: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      orders: [],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    try {
      const created = await prisma.customer_order.create({
        data: body,
      });
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      return NextResponse.json({ error: dbErr?.message || "DB Error" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}
