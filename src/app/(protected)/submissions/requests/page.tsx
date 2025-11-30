"use client";

import TitleContent from "@/components/layouts/TitleContent";
import ChangeStatus from "@/features/requests/ChangeStatus";
import RequestTable from "@/features/requests/RequestTable";
import {
  useDeleteAttachmentRequest,
  useDeleteRequest,
  useRequests,
} from "@/hooks/submissions/useRequests";
import { RequestDetailTable } from "@/types/requestDetailSchema";
import {
  RequestChangeStatusType,
  RequestStatusType,
} from "@/types/requestSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const SubmissionRequest = () => {
  const [dataStatus, setDataStatus] = useState<{
    visible: boolean;
    data?: {
      id: string;
      status: RequestStatusType;
      details?: RequestDetailTable[];
    };
  }>({ visible: false });
  const router = useRouter();
  const session = useSession();
  const { data, isLoading, isError, error } = useRequests();
  const deleteRequest = useDeleteRequest();
  const deleteAttachment = useDeleteAttachmentRequest();

  useEffect(() => {
    if (error) {
      toast.error(String(error));
    }
  }, [isError, error]);

  const onDelete = (id?: string) => {
    if (!id) return;
    Swal.fire({
      title: "Yakin?",
      text: "Data ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e42c2c",
      cancelButtonColor: "#3278A0",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          await new Promise<void>((resolve, reject) => {
            deleteRequest.mutate(
              { id },
              {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
              }
            );
          });
        } catch (err) {
          Swal.showValidationMessage(handleErrorResponse(err));
          throw err;
        }
      },
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        router.push("/submissions/requests");
      }
    });
  };

  const onUpdate = (id?: string) => {
    router.push(`/submissions/requests/form/${id}`);
  };

  const onChangeStatus = async (
    id?: string,
    status?: RequestStatusType,
    details?: RequestDetailTable[]
  ) => {
    setDataStatus((state) => ({
      ...state,
      visible: true,
      data: {
        id: id as string,
        status: status as RequestStatusType,
        details: details ?? [],
      },
    }));
  };

  const onDeleteImage = (id: string) => {
    Swal.fire({
      title: "Hapus Gambar?",
      text: "Data ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e42c2c",
      cancelButtonColor: "#3278A0",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      showLoaderOnConfirm: true, // ← loader di tombol confirm
      allowOutsideClick: () => !Swal.isLoading(), // ← kunci modal saat loading
      preConfirm: async () => {
        try {
          // bungkus mutate ke Promise biar SweetAlert tunggu sampai selesai
          await new Promise<void>((resolve, reject) => {
            deleteAttachment.mutate(
              { id },
              {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
              }
            );
          });
        } catch (err) {
          Swal.showValidationMessage(handleErrorResponse(err));
        }
      },
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        router.push("/submissions/requests");
      }
    });
  };

  return (
    <div className="p-4 ">
      <ChangeStatus
        data={dataStatus.data as RequestChangeStatusType}
        visible={dataStatus.visible}
        onClose={() => setDataStatus((state) => ({ ...state, visible: false }))}
      />
      <TitleContent
        title="+ Pengajuan Kegiatan"
        titleButton={
          session?.data?.user?.role === "SUPER_ADMIN" ||
          session?.data?.user?.role === "ADMIN" ||
          session?.data?.user?.role === "STAFF"
            ? "+ Pengajuan Kegiatan"
            : ""
        }
        onClickButton={() => router.push("/submissions/requests/form")}
      />

      <RequestTable
        isLoading={isLoading}
        data={data?.data}
        totalPages={data?.metaData?.totalPage}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onChangeStatus={onChangeStatus}
        onDeleteImage={onDeleteImage}
      />
      {/* </div> */}
    </div>
  );
};

export default SubmissionRequest;
