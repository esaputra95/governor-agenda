"use client";
import React, { useEffect, useState } from "react";
import RequestForm, { RequestPost } from "../page";
import { useParams } from "next/navigation";
import { useGetDetailRequests } from "@/hooks/submissions/useRequests";
import { RequestTableType } from "@/features/requests/RequestTable";
import { toDatetimeLocal } from "@/utils/dateTime";
import Spinner from "@/components/ui/loading/Spinner";
const RequestUpdate = () => {
  const [dataPost, setDataPost] = useState<Partial<RequestPost>>();
  const { id } = useParams<{ id: string }>();
  const { data, isFetching } = useGetDetailRequests(id);

  useEffect(() => {
    if (data?.data) {
      handleSetData(data.data);
    }
  }, [data]);

  const handleSetData = (data: RequestTableType) => {
    const services = data?.services.map((e) => ({
      id: e.id as string,
      serviceId: e.serviceId,
      quantity: e.requestedQty,
    }));
    setDataPost({
      id: data?.id,
      title: data?.title,
      startAt: toDatetimeLocal(data.startAt),
      endAt: toDatetimeLocal(data.endAt),
      roomId: data?.roomId,

      borrowerName: data?.borrowerName ?? "",
      borrowerEmail: data?.borrowerEmail ?? "",
      borrowerOrganization: data?.borrowerOrganization ?? "",
      borrowerPhone: data?.borrowerPhone ?? "",

      services: services,
      url: data?.purpose ?? "",
    });
  };
  if (isFetching) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <RequestForm data={dataPost} />;
};

export default RequestUpdate;
