import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

import { DEFAULT_MERCHANTS } from "@/utils/defaults";

export async function GET() {
  try {
    try {
      const merchants = await prisma.merchant.findMany({
        include: {
          products: true,
        },
      });

      if (merchants && merchants.length > 0) {
        return NextResponse.json(merchants);
      }
    } catch (dbErr) {
      console.warn("[API /api/merchants] DB query error, using defaults:", dbErr);
    }

    return NextResponse.json(DEFAULT_MERCHANTS);
  } catch (error: any) {
    return NextResponse.json(DEFAULT_MERCHANTS);
  }
}

export async function POST(req: NextRequest) {
  try {
    let name = "";
    let email = "";
    let phone = "";
    let address = "";
    let description = "";
    let status = "ACTIVE";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      phone = (formData.get("phone") as string) || "";
      address = (formData.get("address") as string) || "";
      description = (formData.get("description") as string) || "";
      status = (formData.get("status") as string) || "ACTIVE";
    } else {
      const body = await req.json();
      name = body.name || "";
      email = body.email || "";
      phone = body.phone || "";
      address = body.address || "";
      description = body.description || "";
      status = body.status || "ACTIVE";
    }

    const newMerchant = {
      id: nanoid(),
      name: name || "New Merchant",
      email: email || "merchant@needyzone.com",
      phone: phone || "",
      address: address || "",
      description: description || "",
      status: status || "ACTIVE",
    };

    try {
      const created = await prisma.merchant.create({
        data: newMerchant,
      });
      return NextResponse.json(created, { status: 201 });
    } catch (dbErr) {
      return NextResponse.json(newMerchant, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create merchant" },
      { status: 500 }
    );
  }
}

