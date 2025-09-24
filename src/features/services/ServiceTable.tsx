import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { ServiceType as PublicType } from "@/types/serviceSchema";
import React, { FC, useMemo } from "react";

type Props = {
  data?: PublicType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: PublicType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: PublicType) => void;
};
const ServiceTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const ServiceColumns = useMemo<Column<PublicType>[]>(
    () => [
      { header: "Nama", accessor: "name", sortable: true, filterable: true },
      {
        header: "Tipe",
        accessor: "type",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { value: "room", label: "Ruangan" },
          { value: "service", label: "Layanan" },
        ],
      },
      {
        header: "Deskripsi",
        accessor: "description",
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
        columns={ServiceColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default ServiceTable;
