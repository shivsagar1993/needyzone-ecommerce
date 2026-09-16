"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEnvelope, FaShieldCheck } from 'react-icons/fa6';

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to NeedyZone updates!");
    setEmail("");
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-b border-slate-200/60">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-blue-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl shadow-red-600/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-semibold uppercase tracking-wider mb-3">
              <FaEnvelope className="text-xs" /> Stay Ahead in Tech
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Get Exclusive Tech Deals & Updates
            </h2>
            <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Subscribe to our weekly dispatch for early product releases, VIP discount codes, and deep hardware reviews.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your work or personal email"
              className="w-full bg-white/95 text-slate-900 placeholder-slate-400 text-sm px-4 py-3.5 rounded-xl border-0 focus:ring-4 focus:ring-white/30 outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-semibold text-sm transition-all shadow-md shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;