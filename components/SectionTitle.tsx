import React from 'react';
import Link from 'next/link';
import { FaChevronRight, FaHouse } from 'react-icons/fa6';

const SectionTitle = ({ title, path }: { title: string; path: string }) => {
  const parts = path ? path.split('|').map((p) => p.trim()) : [];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white border-b border-slate-800 py-10 px-6 sm:px-12">
      <div className="max-w-screen-2xl mx-auto flex flex-col items-center text-center gap-3">
        {/* Breadcrumb row */}
        {parts.length > 0 && (
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <FaHouse className="text-[10px]" />
              <span>Home</span>
            </Link>
            {parts.slice(1).map((item, idx) => (
              <React.Fragment key={idx}>
                <FaChevronRight className="text-[9px] text-slate-600" />
                <span className="text-blue-400 font-semibold">{item}</span>
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default SectionTitle;