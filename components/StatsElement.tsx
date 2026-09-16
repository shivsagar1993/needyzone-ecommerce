import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { IconType } from "react-icons";

interface StatsElementProps {
  title?: string;
  value?: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: IconType;
  subtitle?: string;
}

const StatsElement = ({
  title = "Total Revenue",
  value = "$14,250",
  change = "+12.5%",
  isPositive = true,
  icon: Icon,
  subtitle = "Compared to last month",
}: StatsElementProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Icon className="text-lg" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {isPositive ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
            {change}
          </span>
          <span className="text-xs text-slate-400">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsElement;
