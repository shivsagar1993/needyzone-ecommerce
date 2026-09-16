import React from "react";

interface CustomButtonProps {
  paddingX?: number;
  paddingY?: number;
  text: string;
  buttonType?: "submit" | "reset" | "button";
  customWidth?: string;
  textSize?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

const CustomButton = ({
  text,
  buttonType = "button",
  variant = "primary",
  className = "",
}: CustomButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl text-sm px-5 py-2.5 transition-all duration-200 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-blue-500/20",
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-700",
    outline:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-slate-400",
  };

  return (
    <button
      type={buttonType}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
