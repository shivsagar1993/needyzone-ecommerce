import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { DEFAULT_USERS } from "../route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true },
      });

      if (user) {
        return NextResponse.json(user);
      }
    } catch (dbErr) {
      console.warn("[API /api/users/[id]] DB read error:", dbErr);
    }

    const fallback = DEFAULT_USERS.find((u) => u.id === id);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { email, password, role } = body;

    const dataToUpdate: any = {};
    if (email) dataToUpdate.email = email;
    if (role) dataToUpdate.role = role;
    if (password && password.trim().length >= 6) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    try {
      const updated = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
        select: { id: true, email: true, role: true },
      });
      return NextResponse.json(updated);
    } catch (dbErr) {
      return NextResponse.json({ id, email, role });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("[API /api/users/[id]] DB delete error:", dbErr);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}

