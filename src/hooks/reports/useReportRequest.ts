import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useGetReport = (url: string) => {
  return useMutation({
    mutationFn: async (payload: Partial<{ startAt: string; endAt: string }>) =>
      (await api.get(`${url}`, { params: payload })).data,
  });
};
