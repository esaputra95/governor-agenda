import apiUrl from "@/lib/apiUrl";
import { getData } from "@/lib/fatching";
import { BaseApiResponse } from "@/types/apiType";
import { useQuery } from "@tanstack/react-query";

export type RoomResponse = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  name: string;
  room?: string;
  organization?: string;
};

export type ScheduleResponse = {
  id: string;
  startAt: string;
  endAt: string;
  title: string;
  user?: string;
  role?: string;
};

export type DashboardType = {
  room: RoomResponse[];
  schedule: ScheduleResponse[];
};

export function useDashboard() {
  return useQuery<BaseApiResponse<DashboardType>>({
    queryKey: ["Services"],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<DashboardType>>(
        apiUrl.dashboard
      ),
  });
}
