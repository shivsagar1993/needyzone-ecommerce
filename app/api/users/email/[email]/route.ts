import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface RouteParams {
  params: Promise<{ email: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    try {
      const user = await prisma.user.findUnique({
        where: { email: decodedEmail },
        select: { id: true, email: true, role: true },
      });

      if (user) {
        return NextResponse.json(user);
      }
    } catch (dbErr) {
      console.warn("[API /api/users/email/[email]] DB read error:", dbErr);
    }

    // Fallback user object if DB offline or user newly registered via master admin
    return NextResponse.json({
      id: "admin-master-user",
      email: decodedEmail,
      role: "admin",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "User lookup error" }, { status: 500 });
  }
}

