"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ServiceType as PublicType } from "@/types/serviceSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { useState } from "react";

type FetchArgs = {
  q: string;
  limit?: number;
  signal?: AbortSignal;
  type?: "service" | "room";
};

export function useServices() {
  const queryParams = useGetParams();
  console.log({ queryParams });

  return useQuery<BaseApiResponse<PublicType[]>>({
    queryKey: ["Services", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<PublicType[]>>(
        apiUrl.services,
        queryParams
      ),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PublicType) =>
      (await api.post(apiUrl.services, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Services"] }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<PublicType>) =>
      (await api.put(`${apiUrl.services}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Services"] }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string } & Partial<PublicType>) =>
      (await api.delete(`${apiUrl.services}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Services"] }),
  });
}

export function useFetchServiceOptions() {
  const [options, setOptions] = useState<OptionType[]>();

  async function serviceOption({ q, limit = 10, type, signal }: FetchArgs) {
    const res = await api.get(apiUrl.services, {
      params: { q, limit, type },
      signal,
    });
    const items = res.data?.data ?? [];
    const options: OptionType[] = items.map((x: PublicType) => ({
      label: x.name,
      value: x.id,
    }));
    setOptions(options);
    return options;
  }

  return {
    serviceOption,
    options,
  };
  // sesuaikan mapping response API kamu
}
