"use client";
import TitleContent from "@/components/layouts/TitleContent";
import TextInput from "@/components/ui/inputs/TextInput";
import { useGetReport } from "@/hooks/reports/useReportRequest";
import apiUrl from "@/lib/apiUrl";
import { DataReportType, reportSchema, ReportType } from "@/types/reportType";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

const RequestReport = () => {
  const [data, setData] = useState<DataReportType[]>();
  const mutate = useGetReport(apiUrl.scheduleReport);

  // Set default values: awal dan akhir bulan ini
  const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");

  const { register, watch } = useForm<ReportType>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      endAt: startOfMonth,
      startAt: endOfMonth,
    },
  });

  const handleOnClick = async (start: string, end: string) => {
    const response = await mutate.mutateAsync({ endAt: start, startAt: end });
    setData(response.data);
  };
  return (
    <div className="p-4">
      <TitleContent
        isLoading={mutate.isPending}
        title="Laporan Jadwal"
        titleButton="Lihat Laporan Jadwal"
        onClickButton={() => handleOnClick(watch("startAt"), watch("endAt"))}
      />
      <div className=" grid grid-cols-1 lg:grid-cols-2 py-4 gap-4">
        <TextInput label="Dari Tanggal" {...register("endAt")} type="date" />
        <TextInput
          label="Sampai Tanggal"
          {...register("startAt")}
          type="date"
        />
      </div>
      <div className="py-4 relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {data?.map((e, i) => (
            <tr
              className={cn(
                `bg-white border-b  border-gray-200`,
                i == 0 && "text-xs text-gray-700 uppercase bg-gray-50"
              )}
              key={Math.random().toString()}
            >
              {e?.map((v) => (
                <td className="py-2 px-3" key={v}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default RequestReport;
