import {
  CategoryMenu,
  Hero,
  Incentives,
  IntroducingSection,
  Newsletter,
  ProductsSection,
} from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Hero />
      <Incentives />
      <CategoryMenu />
      <ProductsSection />
      <IntroducingSection />
      <Newsletter />
    </main>
  );
}
