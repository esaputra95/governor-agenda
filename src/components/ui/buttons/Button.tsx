import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";
import Spinner from "../loading/Spinner";

const buttonVariants = cva(
  "flex gap-2 hover:cursor-pointer items-center justify-center font-medium rounded-lg transition focus:outline-none",
  {
    variants: {
      color: {
        primary: "",
        success: "",
        error: "",
        warning: "",
      },
      variant: {
        solid: "",
        outlined: "",
        gradient: "",
      },
      size: {
        small: ["text-sm", "py-1", "px-2"],
        medium: ["text-base", "py-2", "px-4", "md:px-5", "md:h-11"],
      },
    },
    compoundVariants: [
      {
        color: "primary",
        variant: "solid",
        className:
          "text-white bg-sky-700 hover:bg-sky-600  focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800",
      },
      {
        color: "success",
        variant: "solid",
        className:
          "text-white bg-green-600 hover:bg-green-700  focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700",
      },
      {
        color: "error",
        variant: "solid",
        className:
          "text-white bg-red-600 hover:bg-red-700  focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700",
      },
      {
        color: "warning",
        variant: "solid",
        className:
          "text-white bg-yellow-500 hover:bg-yellow-600  focus:ring-yellow-300 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-600",
      },

      {
        color: "primary",
        variant: "outlined",
        className:
          "text-sky-700 border border-sky-700 hover:bg-sky-700 hover:text-white focus:ring-2",
      },
      {
        color: "success",
        variant: "outlined",
        className:
          "text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-2",
      },
      {
        color: "error",
        variant: "outlined",
        className:
          "text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-2",
      },
      {
        color: "warning",
        variant: "outlined",
        className:
          "text-yellow-700 border border-yellow-700 hover:bg-yellow-700 hover:text-white focus:ring-2",
      },

      {
        color: "primary",
        variant: "gradient",
        className:
          "text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:opacity-90",
      },
      {
        color: "success",
        variant: "gradient",
        className:
          "text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90",
      },
      {
        color: "error",
        variant: "gradient",
        className:
          "text-white bg-gradient-to-r from-red-400 to-red-600 hover:opacity-90",
      },
      {
        color: "warning",
        variant: "gradient",
        className:
          "text-white bg-gradient-to-r from-yellow-400 to-yellow-600 hover:opacity-90",
      },
    ],
    defaultVariants: {
      color: "primary",
      variant: "solid",
      size: "medium",
    },
  }
);

export type ButtonColor = "primary" | "success" | "error" | "warning";
export type ButtonStyle = "solid" | "outlined" | "gradient";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonStyle;
  size?: "small" | "medium";
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  className,
  color,
  variant,
  size,
  isLoading,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        buttonVariants({ color, variant, size }),
        className,
        `${isLoading && "focus:cursor-not-allowed hover:cursor-not-allowed"}`
      )}
      {...props}
      disabled={isLoading || disabled}
    >
      {props.children}
      {isLoading && <Spinner />}
    </button>
  );
};

export default Button;
