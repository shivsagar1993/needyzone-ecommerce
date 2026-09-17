import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      const images = await prisma.image.findMany({
        where: { productID: id },
      });

      return NextResponse.json(images || []);
    } catch (dbErr) {
      console.warn("[API /api/images/[id]] DB query error:", dbErr);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    return NextResponse.json([]);
  }
}

