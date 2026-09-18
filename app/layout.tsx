
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import 'svgmap/dist/svgMap.min.css';
import SessionProvider from "@/utils/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/Providers";
import SessionTimeoutWrapper from "@/components/SessionTimeoutWrapper";
import prisma from "@/utils/db";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeedyZone - Reliable Tech for Everyday Needs",
  description: "CCTV surveillance systems, fast cables, chargers, digital switch boards, and smart electronics at NeedyZone.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  let navCategories: Array<{ id: string; name: string }> = [];
  try {
    const dbCats = await prisma.category.findMany({
      where: {
        isVisible: true,
        showInNav: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: [
        { orderIndex: "asc" },
        { name: "asc" },
      ],
    });
    if (dbCats) navCategories = dbCats;
  } catch (_) {}

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider session={session}>
          <SessionTimeoutWrapper />
          <Header initialNavCategories={navCategories} />
          <Providers>
            {children}
          </Providers>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
