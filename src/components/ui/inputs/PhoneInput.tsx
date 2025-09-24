"use client";

import React, { forwardRef } from "react";
import dynamic from "next/dynamic";
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

import type { Value as PhoneValue } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

// react-phone-number-input (SSR off)
const BasePhoneInput = dynamic(() => import("react-phone-number-input"), {
  ssr: false,
});

import "react-phone-number-input/style.css";

export interface PhoneInputFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  classNameParent?: string;
  inputClassName?: string;

  /** nilai yang disimpan (E.164), ex: +628123456789 */
  value?: PhoneValue;
  /** dipanggil saat berubah */
  onChange?: (val: PhoneValue) => void;

  /** default negara, ex: 'ID' */
  defaultCountry?: Country;
  /** boleh tanpa kode negara? default: true */
  international?: boolean;
  /** placeholder custom */
  placeholder?: string;
}

const PhoneInputField = forwardRef<HTMLInputElement, PhoneInputFieldProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      disabled,
      classNameParent,
      inputClassName,
      value,
      onChange,
      defaultCountry = "ID",
      international = true,
      placeholder = "Nomor telepon",
      ...rest
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ref
  ) => {
    const hasError = Boolean(error);
    const id = React.useId();

    return (
      <div className={cn("w-full", classNameParent)} {...rest}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium mb-2",
              hasError ? "text-red-600" : "text-gray-700"
            )}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <BasePhoneInput
            id={id}
            value={value ?? undefined}
            onChange={(val: PhoneValue) => onChange?.(val)}
            disabled={disabled}
            defaultCountry={defaultCountry}
            international={international}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-help` : undefined
            }
            className={cn(
              // wrapper dari library -> kita override bareng
              "PhoneInput ring rounded-md ring-gray-300 px-1 w-full",
              // input internal
              hasError
                ? "[&_.PhoneInputInput]:border-red-500 [&_.PhoneInputInput]:focus:ring-red-500 [&_.PhoneInputInput]:focus:border-red-500"
                : "[&_.PhoneInputInput]:border-slate-300 [&_.PhoneInputInput]:focus:border-sky-500 [&_.PhoneInputInput]:focus:ring-sky-500",
              // base style input internal
              "[&_.PhoneInputInput]:mt-1 [&_.PhoneInputInput]:block [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:py-2 [&_.PhoneInputInput]:bg-white [&_.PhoneInputInput]:rounded-sm [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:shadow-xs [&_.PhoneInputInput]:placeholder-slate-400 [&_.PhoneInputInput]:focus:outline-none [&_.PhoneInputInput]:focus:ring-1 [&_.PhoneInputInput]:disabled:bg-slate-50 [&_.PhoneInputInput]:disabled:text-slate-500 [&_.PhoneInputInput]:disabled:border-slate-200",
              inputClassName
            )}
          />
        </div>

        {hasError ? (
          <p
            id={`${id}-error`}
            className="mt-1 text-xs font-medium text-red-600"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={`${id}-help`} className="mt-1 text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

PhoneInputField.displayName = "PhoneInputField";
export default PhoneInputField;
