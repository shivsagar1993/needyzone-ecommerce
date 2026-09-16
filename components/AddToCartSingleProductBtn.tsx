"use client";
import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa6";

const AddToCartSingleProductBtn = ({ product, quantityCount }: SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
    });
    calculateTotals();
    toast.success("Added to enquiry cart");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-bold text-sm bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] max-[500px]:w-full"
    >
      <FaCartPlus className="text-base text-blue-600" />
      <span>Add to Cart</span>
    </button>
  );
};

export default AddToCartSingleProductBtn;
