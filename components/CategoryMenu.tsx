import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import Heading from "./Heading";

const CategoryMenu = () => {
  return (
    <section className="py-20 bg-slate-50/80 border-b border-slate-200/60">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <Heading
          badge="Departments"
          title="Browse by Category"
          subtitle="Explore top technology segments, from daily smart devices to high-end creator gear."
          center={true}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-10">
          {categoryMenuList.map((item) => (
            <CategoryItem title={item.title} key={item.id} href={item.href}>
              <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-slate-50/60 p-3 mb-2 flex items-center justify-center group-hover:bg-blue-50/40 transition-colors">
                <Image
                  src={item.src}
                  width={160}
                  height={160}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xs"
                />
              </div>
            </CategoryItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryMenu;
