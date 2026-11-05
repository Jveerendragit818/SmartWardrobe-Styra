
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
};

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#17233F] text-white hover:bg-[#26385F] focus:ring-[#17233F]",
    secondary:
      "bg-[#C9B9E8] text-[#17233F] hover:bg-[#B9A5DF] focus:ring-[#C9B9E8]",
    outline:
      "border border-[#17233F] text-[#17233F] hover:bg-[#F3F0FA] focus:ring-[#17233F]",
  };

  const sizes = {
    small: "px-3 py-2 text-sm",
    medium: "px-5 py-2.5 text-base",
    large: "px-7 py-3 text-lg",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
