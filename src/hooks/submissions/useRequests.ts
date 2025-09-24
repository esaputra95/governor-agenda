import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { RequestType as PublicType } from "@/types/requestSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { RequestTableType } from "@/features/requests/RequestTable";

export const useRequests = () => {
  const queryParams = useGetParams();
  return useQuery<BaseApiResponse<RequestTableType[]>>({
    queryKey: ["Requests", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<RequestTableType[]>>(
        apiUrl.requests,
        queryParams
      ),
  });
};

export const useGetDetailRequests = (id?: string) => {
  return useQuery<BaseApiResponse<RequestTableType>>({
    queryKey: ["Requests", id],
    queryFn: async () =>
      getData<unknown, BaseApiResponse<RequestTableType>>(
        `${apiUrl.requests}/${id}`
      ),
  });
};

export const useCreateRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PublicType) =>
      (await api.post(apiUrl.requests, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Requests"] }),
  });
};

export const useUpdateRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<PublicType>) =>
      (await api.put(`${apiUrl.requests}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Requests"] }),
  });
};

export const useDeleteRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string } & Partial<PublicType>) =>
      (await api.delete(`${apiUrl.requests}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Requests"] }),
  });
};

export const useDeleteAttachmentRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string } & Partial<PublicType>) =>
      (await api.delete(`${apiUrl.attachments}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Requests"] }),
  });
};

export const useCheckRoom = () => {
  return useMutation({
    mutationFn: async (payload: {
      roomId: string;
      startAt: string;
      endAt: string;
      id?: string;
    }) => {
      const res = await api.post(`${apiUrl.requests}/check-room`, payload);
      if (res.data?.data === true) return true;
      return false;
    },
  });
};
