import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { DEFAULT_MERCHANTS } from "../route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      const merchant = await prisma.merchant.findUnique({
        where: { id },
        include: { products: true },
      });

      if (merchant) {
        return NextResponse.json(merchant);
      }
    } catch (dbErr) {
      console.warn("[API /api/merchants/[id]] DB read error:", dbErr);
    }

    const fallback = DEFAULT_MERCHANTS.find((m) => m.id === id);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    let data: any = {};

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      data.name = formData.get("name") as string;
      data.email = formData.get("email") as string;
      data.phone = formData.get("phone") as string;
      data.address = formData.get("address") as string;
      data.description = formData.get("description") as string;
      data.status = formData.get("status") as string;
    } else {
      data = await req.json();
    }

    try {
      const updated = await prisma.merchant.update({
        where: { id },
        data,
      });
      return NextResponse.json(updated);
    } catch (dbErr) {
      return NextResponse.json({ ...data, id });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      await prisma.merchant.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("[API /api/merchants/[id]] DB delete error:", dbErr);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Delete failed" },
      { status: 500 }
    );
  }
}

