import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href?: string;
  onClick?: () => void;
  expanded?: boolean;
}

const CategoryItem = ({ title, children, href, onClick, expanded }: CategoryItemProps) => {
  const card = (
    <div className="flex h-full flex-col items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg sm:p-4">
      {children}
      <h3 className="mt-1 text-center text-xs font-bold leading-snug tracking-tight text-slate-800 transition-colors group-hover:text-blue-600 sm:text-sm">
        {title}
      </h3>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        className="group block h-full w-full cursor-pointer rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {card}
      </button>
    );
  }

  if (!href) return null;

  return (
    <Link href={href} className="group block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {card}
    </Link>
  );
};

export default CategoryItem;
