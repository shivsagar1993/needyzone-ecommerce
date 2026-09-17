"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaTrashCan, FaCartShopping } from "react-icons/fa6";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useProductStore } from "@/app/_zustand/store";
import { deleteWishItem } from "@/app/actions";
import { sanitize } from "@/lib/sanitize";

interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: WishItemProps) => {
  const { removeFromWishlist } = useWishlistStore();
  const { addToCart } = useProductStore();

  const handleRemove = async () => {
    removeFromWishlist(id);
    try {
      await deleteWishItem(id);
    } catch (err) {
      console.error("Failed to delete wishlist item from server:", err);
    }
    toast.success("Item removed from wishlist");
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price,
      image,
      amount: 1,
    });
    toast.success("Added to cart!");
  };

  const displayImage = image
    ? image.startsWith("http") || image.startsWith("/")
      ? image
      : `/${image}`
    : "/product_placeholder.jpg";

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td>
        <button
          onClick={handleRemove}
          className="btn btn-ghost btn-circle btn-sm text-red-500 hover:bg-red-50"
          title="Remove from wishlist"
          type="button"
        >
          <FaTrashCan className="text-base" />
        </button>
      </td>
      <td>
        <div className="flex justify-center items-center">
          <Link href={`/product/${slug}`}>
            <Image
              src={displayImage}
              alt={title || "Product image"}
              width={64}
              height={64}
              className="w-16 h-16 object-contain rounded-lg border border-slate-100 p-1"
            />
          </Link>
        </div>
      </td>
      <td>
        <div className="text-left max-w-xs mx-auto">
          <Link
            href={`/product/${slug}`}
            className="font-medium text-slate-800 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {sanitize(title)}
          </Link>
          <p className="text-sm font-bold text-red-600 mt-1">${price}</p>
        </div>
      </td>
      <td>
        {stockAvailabillity > 0 ? (
          <span className="badge badge-success text-white text-xs font-semibold px-2.5 py-1">
            In Stock
          </span>
        ) : (
          <span className="badge badge-error text-white text-xs font-semibold px-2.5 py-1">
            Out of Stock
          </span>
        )}
      </td>
      <td>
        <button
          onClick={handleAddToCart}
          disabled={stockAvailabillity <= 0}
          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium disabled:bg-slate-200 disabled:text-slate-400"
          type="button"
        >
          <FaCartShopping className="text-sm" />
          <span>Add to Cart</span>
        </button>
      </td>
    </tr>
  );
};

export default WishItem;

