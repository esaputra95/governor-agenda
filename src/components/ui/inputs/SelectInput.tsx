import { OptionSelectType } from "@/types/selectOptionType";
import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectOptionProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errors?: string;
  option: OptionSelectType[];
  allowNull?: boolean;
  required?: boolean;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectOptionProps>(
  (props, ref) => {
    const {
      label,
      errors,
      option,
      allowNull = true,
      required,
      ...rest
    } = props;
    return (
      <div className="w-full">
        <label className="block text-gray-800 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="mt-2">
          <select
            ref={ref}
            {...rest}
            id="gender"
            autoComplete="gender"
            className="block w-full px-2 rounded-md border-0 py-2 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
          >
            {allowNull ? <option></option> : null}

            {option.length > 0
              ? option.map((value) => (
                  <option
                    className="text-gray-700"
                    key={value.value}
                    value={value.value}
                  >
                    {value.label}
                  </option>
                ))
              : null}
          </select>
        </div>
        <label className="text-red-400 text-xs font-light">
          {errors ? errors : null}
        </label>
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
