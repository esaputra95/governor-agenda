"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import TextInput from "@/components/ui/inputs/TextInput";
import {
  useCreateSchedules,
  useUpdateSchedules,
} from "@/hooks/submissions/useSchedules";
import { toast } from "react-toastify";
import {
  SchedulesType as FormType,
  SchedulesSchema as FormSchema,
} from "@/types/scheduleSchema";
import Button from "@/components/ui/buttons/Button";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { FC, useEffect } from "react";
import AsyncSelectInput from "@/components/ui/inputs/SelectInputAsync";
import { useFetchUserOptions } from "@/hooks/masters/useUsers";
import { MultiValue, SingleValue } from "react-select";
import { toDatetimeLocal } from "@/utils/dateTime";

type Props = {
  onCancel?: () => void;
  initialValues?: Partial<FormType>;
  mode?: "create" | "update" | "view";
};

const SchedulesForm: FC<Props> = ({ onCancel, initialValues, mode }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });

  console.log({ errors });

  const { options, schedulesOption } = useFetchUserOptions();

  useEffect(() => {
    if (initialValues) {
      console.log({ initialValues });

      reset({
        ...initialValues,
        startAt: toDatetimeLocal(initialValues.startAt),
        endAt: toDatetimeLocal(initialValues.endAt),
      });
    }
  }, [initialValues, reset]);

  const create = useCreateSchedules();
  const update = useUpdateSchedules();

  const onSubmit = async (values: FormType) => {
    if (mode === "create") {
      create.mutate(values, {
        onSuccess: () => {
          toast.success("Schedules berhasil ditambahkan");
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
          toast.success("Schedules berhasil diupdate");
          onCancel?.();
        },
        onError: (e) => toast.error(handleErrorResponse(e)),
      }
    );
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Waktu Mulai"
        {...register("startAt")}
        disabled={mode === "view"}
        type="datetime-local"
        errors={errors.startAt?.message}
        required
      />
      <TextInput
        label="Waktu Selesai"
        {...register("endAt")}
        type="datetime-local"
        disabled={mode === "view"}
        errors={errors.endAt?.message}
        required
      />
      <Controller
        name="userOption"
        control={control}
        disabled={mode === "view"}
        rules={{ required: "Pengguna/Pegawai wajib dipilih" }}
        render={({ field }) => (
          <AsyncSelectInput
            {...field}
            label="Pengguna/Pegawai"
            placeholder=""
            isDisabled={mode === "view"}
            error={errors?.userId?.message}
            defaultOptions
            loadOptions={(inputValue) =>
              schedulesOption({
                q: inputValue,
                limit: 10,
                type: "room",
              })
            }
            value={options?.filter((e) => e.value === watch("userId"))}
            // value={getValues('roomId')}
            isMulti={false}
            onChange={(
              newValue: SingleValue<OptionType> | MultiValue<OptionType>
            ) => {
              const selectedValue = newValue as SingleValue<OptionType>;
              setValue("userId", selectedValue?.value as string);
              field.onChange(selectedValue);
            }}
          />
        )}
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

export default SchedulesForm;
