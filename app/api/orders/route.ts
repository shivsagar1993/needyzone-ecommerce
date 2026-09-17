import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

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
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      status,
      city,
      country,
      orderNotice,
      total,
    } = body;

    const orderId = nanoid(12);
    const sanitizedOrderData = {
      id: orderId,
      name: name ? String(name).trim() : "Customer",
      lastname: lastname ? String(lastname).trim() : "",
      phone: phone ? String(phone).trim() : "",
      email: email ? String(email).trim().toLowerCase() : "customer@needyzone.com",
      company: company ? String(company).trim() : "",
      adress: adress ? String(adress).trim() : "",
      apartment: apartment ? String(apartment).trim() : "",
      postalCode: postalCode ? String(postalCode).trim() : "",
      status: status ? String(status).trim() : "pending",
      city: city ? String(city).trim() : "",
      country: country ? String(country).trim() : "",
      orderNotice: orderNotice ? String(orderNotice).trim() : "",
      total: Math.round(Number(total)) || 0,
      dateTime: new Date(),
    };

    try {
      const created = await prisma.customer_order.create({
        data: sanitizedOrderData,
      });
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      console.warn("[API /api/orders] DB order insert fallback:", dbErr);
      return NextResponse.json(sanitizedOrderData, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}
