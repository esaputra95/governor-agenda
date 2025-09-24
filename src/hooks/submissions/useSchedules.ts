"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  SchedulesType as PublicType,
  ScheduleTableType,
} from "@/types/scheduleSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";

export function useSchedules() {
  const queryParams = useGetParams();
  console.log({ queryParams });

  return useQuery<BaseApiResponse<ScheduleTableType[]>>({
    queryKey: ["Scheduless", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<ScheduleTableType[]>>(
        apiUrl.schedules,
        queryParams
      ),
  });
}

export function useCreateSchedules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PublicType) =>
      (await api.post(apiUrl.schedules, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Scheduless"] }),
  });
}

export function useUpdateSchedules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<PublicType>) =>
      (await api.put(`${apiUrl.schedules}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Scheduless"] }),
  });
}

export function useDeleteSchedules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string } & Partial<PublicType>) =>
      (await api.delete(`${apiUrl.schedules}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Scheduless"] }),
  });
}
