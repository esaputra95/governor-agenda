"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import { useCreateUser, useUpdateUser } from "@/hooks/masters/useUsers";
import { toast } from "react-toastify";
import {
  UserType as FormType,
  UserCreateSchema as FormCreateSchema,
  UserUpdateSchema as FormUpdateSchema,
  UserCreateInputType as CreateInputType,
  UserUpdateInputType as UpdateInputType,
} from "@/types/userSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";
import SelectInput from "@/components/ui/inputs/SelectInput";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<FormType>;
  mode?: "create" | "update" | "view";
};

const UserForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  type FormValues = CreateInputType | UpdateInputType;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      mode === "create" ? FormCreateSchema : FormUpdateSchema
    ),
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
      });
    }
  }, [initialValues, reset]);

  const create = useCreateUser();
  const update = useUpdateUser();

  const onSubmit = async (values: FormValues) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("User berhasil ditambahkan");
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
          toast.success("User berhasil diupdate");
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
      <TextInput
        label="Email"
        type="email"
        disabled={mode === "view"}
        {...register("email")}
        errors={errors.email?.message}
        required
      />
      {!initialValues && (
        <TextInput
          label="Password"
          type="password"
          disabled={mode === "view"}
          {...register("password")}
          errors={errors.password?.message}
          required
        />
      )}

      <SelectInput
        label="Jabatan"
        disabled={mode === "view"}
        {...register("role")}
        option={[
          {
            label: "Super Admin (Full Access)",
            value: "SUPER_ADMIN",
          },
          { label: "Approver", value: "APPROVER" },
          { label: "Admin", value: "ADMIN" },
          { label: "Staff", value: "STAFF" },
          { label: "Gubernur", value: "GUBERNUR" },
          { label: "Wakil Gubernur", value: "WAKIL_GUBERNUR" },
          { label: "Sekda", value: "SEKDA" },
          { label: "Kaba Umum", value: "KABA_UMUM" },
        ]}
        errors={errors.role?.message}
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

export default UserForm;
