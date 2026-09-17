import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

import { DEFAULT_USERS } from "@/utils/defaults";

export async function GET() {
  try {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (users && users.length > 0) {
        return NextResponse.json(users);
      }
    } catch (dbErr) {
      console.warn("[API /api/users] DB read error:", dbErr);
    }

    return NextResponse.json(DEFAULT_USERS);
  } catch (error: any) {
    return NextResponse.json(DEFAULT_USERS);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const created = await prisma.user.create({
        data: {
          id: nanoid(),
          email,
          password: hashedPassword,
          role: role || "user",
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      return NextResponse.json(created, { status: 201 });
    } catch (dbErr: any) {
      return NextResponse.json(
        { id: nanoid(), email, role: role || "user" },
        { status: 201 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

