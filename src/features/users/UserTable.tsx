import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { UserPublicType as PublicType } from "@/types/userSchema";
import React, { useMemo } from "react";

type Props = {
  data?: PublicType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: PublicType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: PublicType) => void;
};
const UserTable = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}: Props) => {
  const userColumns = useMemo<Column<PublicType>[]>(
    () => [
      { header: "Nama", accessor: "name", sortable: true, filterable: true },
      {
        header: "Email",
        accessor: "email",
        sortable: true,
        filterable: true,
      },
      {
        header: "Jabatan",
        accessor: "role",
        sortable: true,
        filterable: true,
      },
      {
        header: "Aksi",
        accessor: "id",
        render: (row: PublicType) => (
          <ActionButton
            onUpdate={() => onUpdate?.(row)}
            onDelete={() => onDelete?.(row?.id)}
            onView={() => onView?.(row)}
          />
        ),
      },
    ],
    []
  );
  return (
    <>
      <Table
        data={data ?? []}
        columns={userColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default UserTable;
