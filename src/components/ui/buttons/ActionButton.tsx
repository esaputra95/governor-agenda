import React, { FC, ReactNode } from "react";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { DropdownSelector } from "../tables/DropdownSelector";

type Props = {
  onUpdate?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
};

const ActionButton: FC<Props> = ({ onDelete, onUpdate, onView, children }) => {
  return (
    <DropdownSelector>
      {onView && (
        <button
          onClick={onView}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
        >
          <BsEye className="h-4 w-4" /> Detail
        </button>
      )}
      {onUpdate && (
        <button
          onClick={onUpdate}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sky-500 flex items-center gap-2"
        >
          <BsPencil /> Edit
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
        >
          <BsTrash /> Hapus
        </button>
      )}
      {children}
    </DropdownSelector>
  );
};

export default ActionButton;
