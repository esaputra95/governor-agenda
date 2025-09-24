import ActionButton from "@/components/ui/buttons/ActionButton";
import { Column, Table } from "@/components/ui/tables/Table";
import { ScheduleTableType as PublicType } from "@/types/scheduleSchema";
import dayjs from "dayjs";
import React, { FC, useMemo } from "react";

type Props = {
  data?: PublicType[];
  isLoading: boolean;
  totalPages?: number;
  onUpdate?: (data?: PublicType) => void;
  onDelete?: (id?: string) => void;
  onView?: (id?: PublicType) => void;
};
const SchedulesTable: FC<Props> = ({
  data,
  isLoading,
  totalPages,
  onUpdate,
  onDelete,
  onView,
}) => {
  const SchedulesColumns = useMemo<Column<PublicType>[]>(
    () => [
      {
        header: "Nama",
        accessor: "userId",
        sortable: true,
        filterable: true,
        render: (row) => row?.users?.name,
      },
      {
        header: "Waktu Mulai",
        accessor: "startAt",
        sortable: true,
        filterable: true,
        filterType: "date",
        render: (row) => dayjs(row.startAt).format("DD/MM/YYYY hh:mm"),
      },
      {
        header: "Waktu Selesai",
        accessor: "endAt",
        sortable: true,
        filterable: true,
        filterType: "date",
        render: (row) => dayjs(row.endAt).format("DD/MM/YYYY hh:mm"),
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
        columns={SchedulesColumns}
        isLoading={isLoading}
        totalPages={totalPages ?? 0}
      />
    </>
  );
};

export default SchedulesTable;
