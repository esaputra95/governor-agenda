import React, { FC, ReactNode } from "react";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { DropdownSelector } from "../tables/DropdownSelector";
import { useSession } from "next-auth/react";

type Props = {
  onUpdate?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
  allowedEditRoles?: string[]; // Roles yang boleh edit
  allowedDeleteRoles?: string[]; // Roles yang boleh delete
};

const ActionButton: FC<Props> = ({
  onDelete,
  onUpdate,
  onView,
  children,
  allowedEditRoles,
  allowedDeleteRoles,
}) => {
  const { data: session } = useSession();
  const userRole = session?.user?.role as string;

  // Check if user role is allowed to edit
  const canEdit = allowedEditRoles ? allowedEditRoles.includes(userRole) : true;

  // Check if user role is allowed to delete
  const canDelete = allowedDeleteRoles
    ? allowedDeleteRoles.includes(userRole)
    : true;

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
      {onUpdate && canEdit && (
        <button
          onClick={onUpdate}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sky-500 flex items-center gap-2"
        >
          <BsPencil /> Edit
        </button>
      )}

      {onDelete && canDelete && (
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
