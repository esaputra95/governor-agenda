"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import {
  useCreateService,
  useUpdateService,
} from "@/hooks/masters/useServices";
import { toast } from "react-toastify";
import {
  ServiceType as FormType,
  ServiceSchema as FormSchema,
} from "@/types/serviceSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";
import SelectInput from "@/components/ui/inputs/SelectInput";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<FormType>;
  mode?: "create" | "update" | "view";
};

const ServiceForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
      });
    }
  }, [initialValues, reset]);

  const create = useCreateService();
  const update = useUpdateService();

  const onSubmit = async (values: FormType) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Service berhasil ditambahkan");
          onCancel?.();
        },
        onError: (error) => {
          const err = handleErrorResponse(error);
          toast.error(err);
        },
      });
      return;
    }

    update.mutate(
      { id: values?.id as string, ...values },
      {
        onSuccess: () => {
          toast.success("Service berhasil diupdate");
          onCancel?.();
        },
        onError: (e) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Nama"
        {...register("name")}
        disabled={mode === "view"}
        errors={errors.name?.message}
        required
      />
      <SelectInput
        {...register("type")}
        label="Tipe Layanan"
        required
        option={[
          { value: "service", label: "Layanan" },
          { value: "room", label: "Ruangan" },
        ]}
      />
      <TextInput
        label="Deskripsi"
        {...register("description")}
        disabled={mode === "view"}
        errors={errors.description?.message}
        required
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onCancel} type="button" color="error">
          Batal
        </Button>
        <Button disabled={create.isPending}>
          {create.isPending || update.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
