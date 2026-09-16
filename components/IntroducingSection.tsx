import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FaArrowRight, FaCheck } from "react-icons/fa6";

const IntroducingSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Special Tech Spotlight
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Pure Acoustic Clarity. <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Studio-Grade Wireless Audio.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Equipped with active noise cancellation, custom high-excursion drivers, and up to 40 hours of uninterrupted playback. Elevate your daily listening experience.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 w-full max-w-lg">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FaCheck className="text-[10px]" />
                </span>
                <span>Active Noise Cancellation (ANC)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FaCheck className="text-[10px]" />
                </span>
                <span>Hi-Res Audio Certified Wireless</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FaCheck className="text-[10px]" />
                </span>
                <span>40-Hour Extended Battery Life</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FaCheck className="text-[10px]" />
                </span>
                <span>Ultra-Comfort Memory Foam Cushions</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/shop/headphones"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 active:scale-95"
              >
                <span>Shop Audio Collection</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Right Column: Headphone visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
              <Image
                src="/headphones 1.png"
                width={380}
                height={380}
                alt="Singitronic Wireless Headphones"
                className="w-auto h-auto max-h-[340px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroducingSection;
