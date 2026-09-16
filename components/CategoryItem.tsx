import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} className="group block h-full">
      <div className="flex flex-col items-center justify-between p-3.5 sm:p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 h-full">
        {children}
        <h3 className="mt-1 font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition-colors text-center tracking-tight leading-snug">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
