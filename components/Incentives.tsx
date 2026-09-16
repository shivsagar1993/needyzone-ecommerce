import React from 'react';
import { FaTruckFast, FaRotateLeft, FaHeadset, FaCreditCard } from 'react-icons/fa6';

const benefits = [
  {
    icon: FaTruckFast,
    title: "Free Express Shipping",
    description: "Fast doorstep delivery on all orders over $50",
    color: "text-red-600 bg-red-50 border-red-100",
  },
  {
    icon: FaRotateLeft,
    title: "30-Day Guarantee",
    description: "Hassle-free 30-day return & full refund policy",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    icon: FaHeadset,
    title: "24/7 Expert Support",
    description: "Round-the-clock technical guidance by tech pros",
    color: "text-red-600 bg-red-50 border-red-100",
  },
  {
    icon: FaCreditCard,
    title: "100% Secure Checkout",
    description: "Bank-grade 256-bit SSL encrypted transactions",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
];

const Incentives = () => {
  return (
    <section className="bg-white py-12 border-b border-slate-200/80">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className={`p-3 rounded-xl border shrink-0 ${benefit.color}`}>
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{benefit.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Incentives;