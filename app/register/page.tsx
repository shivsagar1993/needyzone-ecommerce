"use client";
import { SectionTitle } from "@/components";
import Link from "next/link";
import React from "react";
import { FaStore, FaShieldHalved, FaFileInvoiceDollar, FaTruckFast } from "react-icons/fa6";

const RegisterPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SectionTitle title="Account Registration" path="Home | Register" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm mb-4">
            <FaFileInvoiceDollar className="text-3xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            No Account Needed to Order
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Singitronic operates on an open-catalogue model with instant pro-forma invoice generation.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[560px]">
          <div className="bg-white px-8 py-10 shadow-lg border border-slate-200/80 rounded-3xl sm:px-10 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <FaFileInvoiceDollar className="text-blue-600 text-lg shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Instant Invoices</h4>
                  <p className="text-xs text-slate-500">Configure your order enquiry and receive an official printable pro-forma invoice immediately.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <FaTruckFast className="text-emerald-600 text-lg shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Direct Procurement</h4>
                  <p className="text-xs text-slate-500">No upfront online payment required. Pay via standard corporate bank wire or direct settlement.</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Customer accounts have been retired in favor of zero-friction procurement. If you are a Singitronic staff member or administrator, please sign in via the Admin Portal below.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                <FaStore className="text-xs" />
                <span>Browse Products</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <FaShieldHalved className="text-xs text-slate-500" />
                <span>Admin Portal Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
