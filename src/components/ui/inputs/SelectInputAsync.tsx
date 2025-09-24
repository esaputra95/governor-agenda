"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { GroupBase, StylesConfig } from "react-select";
import type { AsyncProps } from "react-select/async";

const AsyncSelect = dynamic(() => import("react-select/async"), {
  ssr: false,
}) as unknown as React.ComponentType<
  AsyncProps<OptionType, boolean, GroupBase<OptionType>>
>;

export type OptionType = { label: string; value: string | number };

export interface AsyncSelectInputProps
  extends Partial<AsyncProps<OptionType, boolean, GroupBase<OptionType>>> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// factory supaya bisa akses error
const createStyles = (
  hasError: boolean
): StylesConfig<OptionType, boolean, GroupBase<OptionType>> => ({
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderColor: hasError
      ? "#ef4444"
      : state.isFocused
      ? "#0284c7"
      : base.borderColor,
    boxShadow: hasError
      ? "0 0 0 1px #ef4444"
      : state.isFocused
      ? "0 0 0 2px rgba(2,132,199,.2)"
      : base.boxShadow,
    "&:hover": {
      borderColor: hasError ? "#ef4444" : "#0284c7",
    },
  }),
  menu: (base) => ({ ...base, zIndex: 50 }),
});

const AsyncSelectInput: React.FC<AsyncSelectInputProps> = ({
  label,
  error,
  required,
  className,
  ...props
}) => {
  const id = React.useId();
  const hasError = Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className={`mb-1 block text-sm font-medium ${
            hasError ? "text-red-600" : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <AsyncSelect
        inputId={id}
        classNamePrefix="react-select"
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        styles={createStyles(hasError)}
        {...props}
      />

      {hasError && (
        <p id={`${id}-error`} className="mt-1 text-xs font-light text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default AsyncSelectInput;
