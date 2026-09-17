import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import fs from "fs";
import path from "path";

const getCustomCategoriesFile = () => path.join("/tmp", "custom-categories.json");

const readCustomCategories = (): Array<{ id: string; name: string }> => {
  try {
    const file = getCustomCategoriesFile();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (_) {}
  return [];
};

const updateCustomCategoryInFile = (id: string, newName: string) => {
  try {
    const file = getCustomCategoriesFile();
    const existing = readCustomCategories();
    const idx = existing.findIndex((c) => c.id === id);
    if (idx !== -1) {
      existing[idx].name = newName;
      fs.writeFileSync(file, JSON.stringify(existing, null, 2), "utf8");
    }
  } catch (_) {}
};

const removeCustomCategoryFromFile = (id: string) => {
  try {
    const file = getCustomCategoriesFile();
    const existing = readCustomCategories();
    const filtered = existing.filter((c) => c.id !== id);
    fs.writeFileSync(file, JSON.stringify(filtered, null, 2), "utf8");
  } catch (_) {}
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;

    // 1. Try DB lookup
    try {
      const category = await prisma.category.findFirst({
        where: {
          OR: [{ id }, { name: id }],
        },
      });
      if (category) {
        return NextResponse.json(category);
      }
    } catch (dbErr) {
      console.warn("[API /api/categories/[id]] DB read error:", dbErr);
    }

    // 2. Check file backup
    const customCats = readCustomCategories();
    const foundCustom = customCats.find((c) => c.id === id || c.name === id);
    if (foundCustom) {
      return NextResponse.json(foundCustom);
    }

    return NextResponse.json({ id, name: id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Category not found" }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;
    const body = await req.json();
    const rawName = body.name?.trim();

    if (!rawName) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const categoryName = rawName.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

    // 1. Try DB update
    try {
      const updated = await prisma.category.update({
        where: { id },
        data: { name: categoryName },
      });
      updateCustomCategoryInFile(id, categoryName);
      return NextResponse.json(updated);
    } catch (dbErr: any) {
      console.warn("[API /api/categories/[id]] DB update error, saving to file:", dbErr.message);
      updateCustomCategoryInFile(id, categoryName);
      return NextResponse.json({ id, name: categoryName });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;

    // 1. Try DB delete
    try {
      await prisma.category.delete({
        where: { id },
      });
      removeCustomCategoryFromFile(id);
      return new NextResponse(null, { status: 204 });
    } catch (dbErr: any) {
      console.warn("[API /api/categories/[id]] DB delete error, removing from file:", dbErr.message);
      removeCustomCategoryFromFile(id);
      return new NextResponse(null, { status: 204 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete category" }, { status: 500 });
  }
}
