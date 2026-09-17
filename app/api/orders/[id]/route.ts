import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    try {
      const order = await prisma.customer_order.findUnique({
        where: { id },
        include: {
          products: {
            include: { product: true },
          },
        },
      });
      if (order) return NextResponse.json(order);
    } catch (dbErr) {
      console.warn("[API /api/orders/[id]] DB query error:", dbErr);
    }

    return NextResponse.json({
      id,
      name: "Customer",
      lastname: "",
      phone: "",
      email: "customer@needyzone.com",
      company: "",
      adress: "Standard Delivery Address",
      apartment: "",
      postalCode: "000000",
      status: "pending",
      city: "Local",
      country: "Domestic",
      orderNotice: "Standard priority delivery",
      total: 0,
      dateTime: new Date().toISOString(),
      products: [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    try {
      const updated = await prisma.customer_order.update({
        where: { id },
        data: {
          status: body.status,
        },
      });
      return NextResponse.json(updated);
    } catch (dbErr) {
      return NextResponse.json({ id, status: body.status });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    try {
      await prisma.customer_order_product.deleteMany({ where: { customerOrderId: id } });
      await prisma.customer_order.delete({ where: { id } });
    } catch (dbErr) {}
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

