import {
  CategoryMenu,
  Hero,
  Incentives,
  IntroducingSection,
  Newsletter,
  ProductsSection,
} from "@/components";
import prisma from "@/utils/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let homeCategories: any[] = [];
  try {
    homeCategories = await prisma.category.findMany({
      where: {
        isVisible: true,
        showOnHome: true,
      },
      include: {
        products: {
          where: { isVisible: true },
          select: { mainImage: true },
          take: 1,
        },
      },
      orderBy: [
        { orderIndex: "asc" },
        { name: "asc" },
      ],
    });
  } catch (err) {
    homeCategories = [];
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Hero />
      <Incentives />
      <CategoryMenu initialCategories={homeCategories} />
      <ProductsSection />
      <IntroducingSection />
      <Newsletter />
    </main>
  );
}
