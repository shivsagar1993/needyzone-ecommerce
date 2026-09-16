"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaFileInvoice } from "react-icons/fa6";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();

  const handleEnquireAndInvoice = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
    });
    calculateTotals();
    toast.success("Added to enquiry order");
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleEnquireAndInvoice}
      className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] max-[500px]:w-full"
    >
      <FaFileInvoice className="text-base" />
      <span>Order Enquiry & Invoice</span>
    </button>
  );
};

export default BuyNowSingleProductBtn;
