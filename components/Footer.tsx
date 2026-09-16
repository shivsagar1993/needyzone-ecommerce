import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FaXTwitter, FaGithub, FaLinkedin, FaYoutube, FaShieldHalved } from "react-icons/fa6";

const navigation = {
  shop: [
    { name: "Smartphones", href: "/shop/smart-phones" },
    { name: "Laptops & PCs", href: "/shop/laptops" },
    { name: "Headphones & Audio", href: "/shop/headphones" },
    { name: "Cameras & Optics", href: "/shop/cameras" },
    { name: "Smart Watches", href: "/shop/watches" },
  ],
  support: [
    { name: "Order Tracking", href: "/cart" },
    { name: "Warranty Policy", href: "#" },
    { name: "Returns & Exchanges", href: "#" },
    { name: "Shipping Information", href: "#" },
    { name: "Contact Help Desk", href: "#" },
  ],
  company: [
    { name: "About NeedyZone", href: "#" },
    { name: "Careers & Internships", href: "#" },
    { name: "Store Locations", href: "#" },
    { name: "Corporate Sales", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Settings", href: "#" },
    { name: "Compliance & Security", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/needyzone-logo.png"
                width={160}
                height={55}
                alt="NeedyZone"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Your trusted partner for high-definition CCTV security systems, fast charging solutions, digital switch boards, and smart electronics.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-white flex items-center justify-center border border-slate-800 transition-colors">
                <FaXTwitter className="text-xs" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-white flex items-center justify-center border border-slate-800 transition-colors">
                <FaGithub className="text-xs" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-white flex items-center justify-center border border-slate-800 transition-colors">
                <FaLinkedin className="text-xs" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-white flex items-center justify-center border border-slate-800 transition-colors">
                <FaYoutube className="text-xs" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Catalog
            </h3>
            <ul className="space-y-2.5 text-xs">
              {navigation.shop.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Legal & Trust
            </h3>
            <ul className="space-y-2.5 text-xs">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NeedyZone. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-400">
              <FaShieldHalved className="text-emerald-400 text-xs" />
              <span>SSL 256-Bit Encrypted Payments</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
