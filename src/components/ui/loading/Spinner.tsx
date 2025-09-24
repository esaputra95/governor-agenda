import { cn } from "@/utils/cn";
import React from "react";

export interface SpinnerProps {
  size?: number | string; // px atau rem atau Tailwind class
  color?: string; // bisa hex, tailwind class, dsb
  thickness?: number; // ketebalan border
  className?: string; // class tambahan jika perlu
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "#3b82f6", // default to Tailwind's blue-500
  thickness = 3,
  className,
}) => {
  const sizeStyle = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={cn("inline-block animate-spin rounded-full", className)}
      style={{
        width: sizeStyle,
        height: sizeStyle,
        borderWidth: thickness,
        borderColor: `${color} transparent ${color} transparent`,
        borderStyle: "solid",
      }}
    />
  );
};

export default Spinner;
