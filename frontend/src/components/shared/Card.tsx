
import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "small" | "medium" | "large";
  shadow?: "none" | "small" | "medium";
};

export default function Card({
  children,
  padding = "medium",
  shadow = "small",
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    small: "p-3",
    medium: "p-5",
    large: "p-7",
  };

  const shadowStyles = {
    none: "",
    small: "shadow-sm",
    medium: "shadow-md",
  };

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
