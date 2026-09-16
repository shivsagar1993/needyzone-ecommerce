"use client";
import { AdminOrders, DashboardSidebar } from "@/components";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col xl:flex-row">
      <DashboardSidebar />
      <AdminOrders />
    </div>
  );
};

export default DashboardOrdersPage;
