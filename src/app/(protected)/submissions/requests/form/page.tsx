"use client";
import Wizard, { WizardHandle } from "@/components/ui/form/FormWizard";
import { Uploaded } from "@/components/ui/inputs/FileInput";
import FormStep1 from "@/features/requests/FormStep1";
import FormStep2 from "@/features/requests/FormStep2";
import FormStep3 from "@/features/requests/FormStep3";
import FormStep4 from "@/features/requests/FormStep4";
import {
  useCreateRequest,
  useUpdateRequest,
} from "@/hooks/submissions/useRequests";
import {
  RequestFormStep1Type,
  RequestFormStep2Type,
  RequestFormStep3Type,
} from "@/types/requestSchema";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import { FaEdit, FaUser, FaFileArchive } from "react-icons/fa";
import { FiCheckSquare } from "react-icons/fi";
import { toast } from "react-toastify";

export type RequestPost = RequestFormStep1Type &
  RequestFormStep2Type &
  RequestFormStep3Type &
  Uploaded & { id?: string };

const toDate = (v?: unknown) =>
  v instanceof Date ? v : v ? new Date(String(v)) : undefined;

type Props = {
  data?: Partial<RequestPost>;
};

const RequestForm: FC<Props> = ({ data }) => {
  const [dataPost, setDataPost] = useState<Partial<RequestPost>>();
  const wizRef = useRef<WizardHandle>(null);
  const router = useRouter();
  const create = useCreateRequest();
  const update = useUpdateRequest();

  useEffect(() => {
    if (data) {
      setDataPost(data);
    }
  }, [data]);

  const handleNext = (
    e:
      | RequestFormStep1Type
      | RequestFormStep2Type
      | RequestFormStep3Type
      | Uploaded
  ) => {
    setDataPost((state) => ({ ...state, ...e }));
    wizRef.current?.next();
  };

  const handleBack = (
    e?:
      | RequestFormStep1Type
      | RequestFormStep2Type
      | RequestFormStep3Type
      | Uploaded
  ) => {
    setDataPost((state) => ({ ...state, ...e }));
    wizRef.current?.prev();
  };

  const handleOnSave = (
    data?:
      | RequestFormStep1Type
      | RequestFormStep2Type
      | RequestFormStep3Type
      | Uploaded
  ) => {
    const dataSend = { ...dataPost, ...data };
    const requestDetailData = dataSend?.services?.map((e) => ({
      requestedQty: e.quantity,
      serviceId: e.serviceId ?? "",
      id: e.id,
    }));

    const dataFinal = {
      id: dataSend?.id,
      startAt: toDate(dataSend.startAt)!,
      endAt: toDate(dataSend.endAt)!,
      title: dataSend?.title ?? "",
      roomId: dataSend?.roomId ?? "",
      borrowerName: dataSend?.borrowerName,
      borrowerEmail: dataSend?.borrowerEmail,
      borrowerPhone: dataSend?.borrowerPhone,
      borrowerOrganization: dataSend?.borrowerOrganization,
      purpose: dataSend?.url,
      requestDetails: requestDetailData ?? [],
    };
    if (!dataSend.id) {
      create.mutate(
        { ...dataFinal },
        {
          onSuccess: () => {
            toast.success("Pengajuan ruangan berhasil disimpan");
            router.push("/submissions/requests");
          },
          onError: (error) => {
            const err = handleErrorResponse(error);
            toast.error(err);
          },
        }
      );
      return;
    }
    update.mutate({
      ...dataFinal,
      id: dataSend.id as string,
    });
  };
  return (
    <div className="p-4">
      <div className="py-4">
        <Wizard
          withButton={false}
          ref={wizRef}
          steps={[
            {
              label: "Informasi Kegiatan",
              icon: FaEdit,
              content: (
                <FormStep1 initialValue={dataPost} onNext={handleNext} />
              ),
            },
            {
              label: "Penaggung Jawab",
              icon: FaUser,
              content: (
                <FormStep2
                  initialValue={dataPost}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              ),
            },
            {
              label: "Layanan Kegiatan",
              icon: FiCheckSquare,
              content: (
                <FormStep3
                  initialValue={dataPost}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              ),
            },
            {
              label: "Dokument Pendukung",
              icon: FaFileArchive,
              content: (
                <FormStep4
                  initialValue={dataPost}
                  onBack={handleBack}
                  onNext={handleOnSave}
                  isLoading={create.isPending || update.isPending}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RequestForm;
