import Button from "@/components/ui/buttons/Button";
import SelectInput from "@/components/ui/inputs/SelectInput";
import AsyncSelectInput from "@/components/ui/inputs/SelectInputAsync";
import TextInput from "@/components/ui/inputs/TextInput";
import { useFetchServiceOptions } from "@/hooks/masters/useServices";
import { useCheckRoom } from "@/hooks/submissions/useRequests";
import { RequestFormStep1, RequestFormStep1Type } from "@/types/requestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { MultiValue, SingleValue } from "react-select";
import { toast } from "react-toastify";
type Props = {
  onNext: (data: RequestFormStep1Type) => void;
  initialValue?: Partial<RequestFormStep1Type>;
};

const FormStep1: FC<Props> = ({ onNext, initialValue }) => {
  const checkRoom = useCheckRoom();
  const { options, serviceOption } = useFetchServiceOptions();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RequestFormStep1Type>({
    resolver: zodResolver(RequestFormStep1),
    defaultValues: {
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (initialValue?.title) {
      reset(initialValue);
    }
  }, [initialValue, reset]);

  const onSubmit = async (data: RequestFormStep1Type) => {
    if (watch("status") !== "CANCELLED") {
      const room = await checkRoom.mutateAsync({
        startAt: data.startAt,
        endAt: data.endAt,
        roomId: data.roomId,
        id: data?.id,
      });
      if (room) {
        toast.error("Ruangan tidak tersedia lagi");
        return;
      }
    }

    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-4 border p-4 border-sky-100 rounded-2xl">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Waktu Mulai"
            type="datetime-local"
            required
            errors={errors?.startAt?.message}
            {...register("startAt")}
          />
          <TextInput
            label="Waktu Selesai"
            type="datetime-local"
            required
            errors={errors?.endAt?.message}
            {...register("endAt")}
          />
          <TextInput
            label="Nama Kegiatan"
            required
            errors={errors?.title?.message}
            {...register("title")}
          />
          <Controller
            name="roomOption"
            control={control}
            rules={{ required: "Ruangan/Gedung wajib dipilih" }}
            render={({ field }) => (
              <AsyncSelectInput
                {...field}
                label="Ruangan/Gedung"
                placeholder=""
                error={errors?.roomId?.message}
                defaultOptions
                loadOptions={(inputValue) =>
                  serviceOption({
                    q: inputValue,
                    limit: 10,
                    type: "room",
                  })
                }
                value={options?.filter((e) => e.value === watch("roomId"))}
                // value={getValues('roomId')}
                isMulti={false}
                onChange={(
                  newValue: SingleValue<OptionType> | MultiValue<OptionType>
                ) => {
                  const selectedValue = newValue as SingleValue<OptionType>;
                  setValue("roomId", selectedValue?.value as string);
                  field.onChange(selectedValue);
                }}
              />
            )}
          />
          <SelectInput
            label="Status Pengajuan"
            {...register("status")}
            option={[
              { label: "PENDING", value: "PENDING" },
              { label: "APPROVE", value: "APPROVED" },
              { label: "SELESAI", value: "FINISH" },
              { label: "BATAL", value: "CANCELLED" },
            ]}
          />
        </div>
        <div className="flex justify-end">
          <Button
            isLoading={checkRoom.isPending}
            variant="outlined"
            color="success"
          >
            Lanjut
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormStep1;
