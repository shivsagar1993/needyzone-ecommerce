import { SectionTitle } from "@/components";
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";

const CartPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle title="Shopping Cart" path="Home | Cart" />
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-10">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <Suspense fallback={<Loader />}>
            <CartModule />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
