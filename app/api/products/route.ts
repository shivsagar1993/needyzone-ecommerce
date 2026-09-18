export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

function normalizeCategoryKey(val: string): string {
  if (!val) return "";
  return val.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const CATEGORY_ALIASES: Record<string, string[]> = {
  "cctv-security": ["cctv-security", "cctv", "cameras", "security", "surveillance", "cctv-and-security"],
  "cameras": ["cameras", "cctv-security", "cctv", "camera"],
  "smart-phones": ["smart-phones", "smartphones", "phones", "mobile", "smart-phone"],
  "laptops": ["laptops", "laptop", "computers", "notebooks", "notebook"],
  "headphones": ["headphones", "earbuds", "audio", "headphone", "earbud"],
  "watches": ["watches", "watch", "smart-watches", "smart-watch"],
  "speakers": ["speakers", "speaker", "sound"],
  "tablets": ["tablets", "tablet", "ipad"],
  "mobile-chargers": ["mobile-chargers", "chargers", "charger", "fast-charger", "pd-chargers"],
  "data-cables": ["data-cables", "cables", "cable", "type-c", "fast-cables"],
  "digital-switches": ["digital-switches", "switches", "switch", "smart-switches"],
  "power-strips": ["power-strips", "powerstrip", "power-strip", "extension"],
  "networking-devices": ["networking-devices", "networking", "wifi", "router", "routers"],
  "usb-products": ["usb-products", "usb", "storage"],
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam =
      searchParams.get("category") ||
      searchParams.get("filters[category][$equals]") ||
      searchParams.get("categoryId");

    const maxPrice = Number(searchParams.get("filters[price][$lte]") || searchParams.get("price"));
    const minRating = Number(searchParams.get("filters[rating][$gte]") || searchParams.get("rating"));
    const inStock = searchParams.get("filters[inStock][$equals]") || searchParams.get("inStock");
    const outOfStock = searchParams.get("outOfStock");
    const search = searchParams.get("search") || searchParams.get("q");
    const sort = searchParams.get("sort") || "defaultSort";
    const mode = searchParams.get("mode");

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const defaultLimit = mode === "admin" ? 1000 : 9;
    const limit = searchParams.get("limit") ? Math.max(1, parseInt(searchParams.get("limit")!, 10)) : defaultLimit;
    const skip = (page - 1) * limit;

    try {
      let matchingCategoryIds: string[] = [];
      if (categoryParam && categoryParam !== "all" && categoryParam.trim() !== "") {
        const normTarget = normalizeCategoryKey(categoryParam);
        const aliases = CATEGORY_ALIASES[normTarget] || [normTarget];

        const allCategories = await prisma.category.findMany();
        for (const cat of allCategories) {
          const catNormId = normalizeCategoryKey(cat.id);
          const catNormName = normalizeCategoryKey(cat.name);
          if (
            cat.id === categoryParam ||
            cat.name.toLowerCase() === categoryParam.toLowerCase() ||
            aliases.includes(catNormId) ||
            aliases.includes(catNormName)
          ) {
            matchingCategoryIds.push(cat.id);
          }
        }
      }

      const where: any = {};

      if (categoryParam && categoryParam !== "all" && categoryParam.trim() !== "") {
        if (matchingCategoryIds.length > 0) {
          where.categoryId = { in: matchingCategoryIds };
        } else {
          where.OR = [
            { categoryId: categoryParam },
            { category: { name: { contains: categoryParam } } },
          ];
        }
      }

      if (!isNaN(maxPrice) && maxPrice > 0) {
        where.price = { ...(where.price || {}), lte: maxPrice };
      }

      if (!isNaN(minRating) && minRating > 0) {
        where.rating = { ...(where.rating || {}), gte: minRating };
      }

      if (inStock === "1" || inStock === "true") {
        where.inStock = { gt: 0 };
      } else if (outOfStock === "true" && inStock === "false") {
        where.inStock = { equals: 0 };
      }

      if (search && search.trim() !== "") {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
          { manufacturer: { contains: search } },
        ];
      }

      let orderBy: any = { title: "asc" };
      if (sort === "price-low-to-high" || sort === "lowPrice") {
        orderBy = { price: "asc" };
      } else if (sort === "price-high-to-low" || sort === "highPrice") {
        orderBy = { price: "desc" };
      } else if (sort === "rating" || sort === "popular") {
        orderBy = { rating: "desc" };
      } else if (sort === "latest") {
        orderBy = { id: "desc" };
      } else if (sort === "titleAsc") {
        orderBy = { title: "asc" };
      } else if (sort === "titleDesc") {
        orderBy = { title: "desc" };
      }

      const includeHidden = searchParams.get("includeHidden") === "true" || mode === "admin";
      if (!includeHidden) {
        where.isVisible = true;
      }

      if (searchParams.get("featured") === "true") {
        where.isFeatured = true;
      }

      const totalCount = await prisma.product.count({ where });
      const totalPages = Math.max(1, Math.ceil(totalCount / limit));

      const isStorePaginated = !(mode === "admin" && !searchParams.get("limit") && !searchParams.get("page"));

      const dbProducts = await prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip: isStorePaginated ? skip : undefined,
        take: isStorePaginated ? limit : undefined,
      });

      const headers = {
        "x-total-count": String(totalCount),
        "x-total-pages": String(totalPages),
        "x-current-page": String(page),
        "x-page-size": String(limit),
        "Access-Control-Expose-Headers": "x-total-count, x-total-pages, x-current-page, x-page-size",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      };

      // Return actual database state directly (empty array when no products exist)
      return NextResponse.json(dbProducts || [], { headers });
    } catch (dbErr) {
      console.warn("[API /api/products] Database query error:", dbErr);
      return NextResponse.json([], {
        headers: {
          "x-total-count": "0",
          "x-total-pages": "1",
          "x-current-page": "1",
          "x-page-size": String(limit),
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      price,
      rating,
      description,
      mainImage,
      manufacturer,
      inStock,
      categoryId,
      slug,
    } = body;

    const newSlug =
      slug ||
      (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : `product-${nanoid(6)}`);

    let validMerchantId = body.merchantId;
    try {
      const existingMerchant = validMerchantId
        ? await prisma.merchant.findUnique({ where: { id: validMerchantId } })
        : null;

      if (!existingMerchant) {
        const firstMerchant = await prisma.merchant.findFirst({});
        if (firstMerchant) {
          validMerchantId = firstMerchant.id;
        } else {
          const createdMerchant = await prisma.merchant.create({
            data: {
              id: "1",
              name: "NeedyZone Direct Merchant",
              status: "ACTIVE",
            },
          });
          validMerchantId = createdMerchant.id;
        }
      }
    } catch (mErr) {
      console.warn("Merchant resolve warning:", mErr);
      validMerchantId = validMerchantId || "1";
    }

    let validCategoryId = categoryId;
    try {
      // 1. Direct ID lookup
      let existingCat = validCategoryId
        ? await prisma.category.findUnique({ where: { id: validCategoryId } })
        : null;

      // 2. Lookup by exact Name
      if (!existingCat && validCategoryId) {
        existingCat = await prisma.category.findFirst({
          where: { name: validCategoryId },
        });
      }

      // 3. Lookup by normalized name / slug
      if (!existingCat && validCategoryId) {
        const normInput = normalizeCategoryKey(validCategoryId);
        const allCats = await prisma.category.findMany();
        existingCat = allCats.find((c) => normalizeCategoryKey(c.name) === normInput || normalizeCategoryKey(c.id) === normInput) || null;
      }

      // 4. Create category if not found
      if (!existingCat) {
        if (validCategoryId && validCategoryId.trim()) {
          const createdCat = await prisma.category.create({
            data: {
              id: nanoid(),
              name: validCategoryId.trim(),
            },
          });
          validCategoryId = createdCat.id;
        } else {
          const defaultCat = await prisma.category.findFirst();
          validCategoryId = defaultCat ? defaultCat.id : "cctv-security";
        }
      } else {
        validCategoryId = existingCat.id;
      }
    } catch (cErr) {
      console.warn("Category resolve warning:", cErr);
      validCategoryId = validCategoryId || "cctv-security";
    }

    let finalSlug = newSlug;
    try {
      const slugExists = await prisma.product.findUnique({ where: { slug: finalSlug } });
      if (slugExists) {
        finalSlug = `${newSlug}-${nanoid(4).toLowerCase()}`;
      }
    } catch (_) {}

    const isVisible = body.isVisible !== undefined ? Boolean(body.isVisible) : true;
    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : false;

    const noCacheHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    };

    try {
      const created = await (prisma.product.create as any)({
        data: {
          id: nanoid(),
          title: title || "New Product",
          price: Math.round(Number(price)) || 0,
          rating: Number(rating) || 5,
          description: description || "",
          mainImage: mainImage || "product_placeholder.jpg",
          manufacturer: manufacturer || "NeedyZone",
          inStock: inStock !== undefined ? Number(inStock) : 1,
          isVisible,
          isFeatured,
          categoryId: validCategoryId,
          merchantId: validMerchantId,
          slug: finalSlug,
        },
        include: {
          category: true,
        },
      });

      return NextResponse.json(created, { status: 201, headers: noCacheHeaders });
    } catch (dbErr: any) {
      console.error("[API /api/products] DB create error:", dbErr);
      const fallbackCreated = {
        id: nanoid(),
        title: title || "New Product",
        price: Math.round(Number(price)) || 0,
        rating: Number(rating) || 5,
        description: description || "",
        mainImage: mainImage || "product_placeholder.jpg",
        manufacturer: manufacturer || "NeedyZone",
        inStock: inStock !== undefined ? Number(inStock) : 1,
        categoryId: validCategoryId,
        merchantId: validMerchantId,
        slug: finalSlug,
      };
      return NextResponse.json(fallbackCreated, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
