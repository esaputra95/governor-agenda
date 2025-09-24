"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  UserCreateInputType as CreateInputType,
  UserUpdateInputType as UpdateInputType,
  UserPublicType as PublicType,
} from "@/types/userSchema";
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

export function useUsers() {
  const queryParams = useGetParams();
  console.log({ queryParams });

  return useQuery<BaseApiResponse<PublicType[]>>({
    queryKey: ["users", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<PublicType[]>>(
        apiUrl.users,
        queryParams
      ),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateInputType | UpdateInputType) =>
      (await api.post("/api/users", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<CreateInputType | UpdateInputType>) =>
      (await api.put(`/api/users/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string } & Partial<CreateInputType>) =>
      (await api.delete(`/api/users/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useFetchUserOptions() {
  const [options, setOptions] = useState<OptionType[]>();

  async function schedulesOption({ q, limit = 10, type, signal }: FetchArgs) {
    const res = await api.get(apiUrl.users, {
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
    schedulesOption,
    options,
  };
  // sesuaikan mapping response API kamu
}
