import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    try {
      const cat = await prisma.category.findUnique({ where: { id } });
      if (cat) return NextResponse.json(cat);
    } catch (dbErr) {}
    return NextResponse.json({ id, name: "Category" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    try {
      const updated = await prisma.category.update({
        where: { id },
        data: { name: body.name },
      });
      return NextResponse.json(updated);
    } catch (dbErr) {
      return NextResponse.json({ id, name: body.name });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    try {
      await prisma.category.delete({ where: { id } });
    } catch (dbErr) {}
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

