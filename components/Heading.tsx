import React from 'react';

interface HeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  center?: boolean;
}

const Heading = ({ title, subtitle, badge, center = true }: HeadingProps) => {
  return (
    <div className={`mb-10 ${center ? 'text-center' : 'text-left'}`}>
      {badge && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 border border-blue-100 rounded-full">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Heading;