"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight, FaBolt, FaShieldHeart, FaStar, FaVideo } from "react-icons/fa6";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient background glow effects matching NeedyZone Red & Blue */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 relative z-10">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start gap-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Smart Products. Better Living.
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Reliable Tech <br />
            <span className="bg-gradient-to-r from-red-500 via-rose-300 to-blue-400 bg-clip-text text-transparent">
              for Everyday Needs.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
            CCTV surveillance systems, fast data cables, 20W PD chargers, digital switch boards, and smart electronics — all in one place at NeedyZone.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 w-full max-w-lg">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
              <FaVideo className="text-red-400 shrink-0" />
              <span>4K AI Surveillance</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
              <FaBolt className="text-amber-400 shrink-0" />
              <span>Color Night Vision</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
              <FaShieldHeart className="text-blue-400 shrink-0" />
              <span>100% Genuine Guard</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 w-full sm:w-auto">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/30"
            >
              <span>Shop Now</span>
              <FaArrowRight className="text-xs" />
            </Link>
            <Link
              href="/shop/cameras"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-red-500/40 text-sm font-semibold transition-all backdrop-blur-sm"
            >
              <FaVideo className="text-xs text-red-400" />
              <span>CCTV &amp; Security</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 3 CCTV Trio Transparent Visual Showcase */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-xl">
            {/* Ambient radial glow behind the cameras */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-blue-600/20 to-sky-400/15 rounded-full blur-3xl transform scale-95 pointer-events-none" />

            {/* Transparent PNG 3 CCTV Trio */}
            <div className="relative flex justify-center items-center py-4 w-full">
              <Image
                src="/hero-cctv-trio-transparent.png"
                width={1300}
                height={620}
                alt="NeedyZone 4K Bullet, Eyeball Turret & Dome CCTV Security Cameras"
                priority
                className="w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.6)] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Floating Glassmorphic Pill: Rating */}
            <div className="absolute top-2 left-0 sm:-left-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3 shadow-xl flex items-center gap-3 z-10">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <FaStar className="text-sm" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Surveillance Rating</p>
                <p className="text-xs sm:text-sm font-bold text-white">4.9 / 5.0 (1.5k+ Installs)</p>
              </div>
            </div>

            {/* Floating Glassmorphic Pill: 24/7 AI Guard */}
            <div className="absolute -bottom-2 right-0 sm:-right-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3 shadow-xl flex items-center gap-3 z-10">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">AI Motion &amp; Threat Guard</p>
                <p className="text-xs sm:text-sm font-bold text-emerald-400">24/7 Active Protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
