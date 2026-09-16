"use client";
import {
  DashboardProductTable,
  DashboardSidebar,
} from "@/components";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <DashboardProductTable />
    </div>
  );
};

export default DashboardProducts;
