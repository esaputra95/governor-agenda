import Button from "@/components/ui/buttons/Button";
import TextInput from "@/components/ui/inputs/TextInput";
import { useFetchServiceOptions } from "@/hooks/masters/useServices";
import { RequestFormStep3, RequestFormStep3Type } from "@/types/requestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { MultiValue, SingleValue } from "react-select";
import AsyncSelectInput from "@/components/ui/inputs/SelectInputAsync";

type Props = {
  onNext: (data: RequestFormStep3Type) => void;
  onBack: () => void;
  initialValue?: Partial<RequestFormStep3Type>;
};

const FormStep3: FC<Props> = ({ onNext, onBack, initialValue }) => {
  const { serviceOption, options } = useFetchServiceOptions();
  const {
    control,
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormStep3Type>({
    resolver: zodResolver(RequestFormStep3),
  });

  useEffect(() => {
    if (initialValue?.services) {
      reset({ services: initialValue?.services });
    }
  }, [initialValue, reset]);

  const { fields, append } = useFieldArray({
    control,
    name: "services", // kosong karena schema berupa array langsung
  });

  const onSubmit = (data: RequestFormStep3Type) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-4 border p-4 border-sky-100 rounded-2xl">
        <Button onClick={() => append({ quantity: 0, serviceId: "" })}>
          + Layanan
        </Button>
        {fields.map((e, i) => (
          <div className="grid grid-cols-2 gap-4" key={e.id}>
            <Controller
              name={`services.${i}.serviceOption`}
              control={control}
              rules={{ required: "Ruangan/Gedung wajib dipilih" }}
              render={({ field }) => (
                <AsyncSelectInput
                  {...field}
                  label="Layanan"
                  placeholder=""
                  error={errors?.services?.[i]?.serviceId?.message}
                  defaultOptions
                  loadOptions={(inputValue) =>
                    serviceOption({
                      q: inputValue,
                      limit: 10,
                      type: "service",
                    })
                  }
                  value={options?.filter(
                    (e) => e.value === watch(`services.${i}.serviceId`)
                  )}
                  isMulti={false}
                  onChange={(
                    newValue: SingleValue<OptionType> | MultiValue<OptionType>
                  ) => {
                    const selectedValue = newValue as SingleValue<OptionType>;
                    setValue(
                      `services.${i}.serviceId`,
                      selectedValue?.value as string
                    );
                    field.onChange(selectedValue);
                  }}
                />
              )}
            />
            <TextInput
              label="Jumlah"
              required
              errors={errors?.services?.[0]?.quantity?.message}
              {...register(`services.${i}.quantity`, { valueAsNumber: true })}
            />
          </div>
        ))}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outlined"
            color="warning"
            onClick={onBack}
          >
            Kembali
          </Button>
          <Button variant="outlined" color="success">
            Lanjut
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormStep3;
