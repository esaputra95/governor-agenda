import Button from "@/components/ui/buttons/Button";
import PhoneInputField from "@/components/ui/inputs/PhoneInput";
import TextInput from "@/components/ui/inputs/TextInput";
import { RequestFormStep2, RequestFormStep2Type } from "@/types/requestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Value as PhoneValue } from "react-phone-number-input";

type Props = {
  onNext: (data: RequestFormStep2Type) => void;
  onBack: () => void;
  initialValue?: Partial<RequestFormStep2Type>;
};

const FormStep2: FC<Props> = ({ onNext, onBack, initialValue }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestFormStep2Type>({
    resolver: zodResolver(RequestFormStep2),
  });

  useEffect(() => {
    if (initialValue?.borrowerName) {
      reset(initialValue);
    }
  }, [initialValue, reset]);

  const onSubmit = (data: RequestFormStep2Type) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-4 border p-4 border-sky-100 rounded-2xl">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Nama PIC"
            required
            errors={errors?.borrowerName?.message}
            {...register("borrowerName")}
          />
          <TextInput
            label="Nama Organisasi"
            required
            errors={errors?.borrowerOrganization?.message}
            {...register("borrowerOrganization")}
          />
          <Controller
            name="borrowerPhone"
            control={control}
            rules={{
              required: "Nomor telepon wajib diisi",
              validate: (v) =>
                v?.startsWith("+62") || "Gunakan nomor Indonesia yang valid",
            }}
            render={({ field, fieldState }) => (
              <PhoneInputField
                label="No Telp/HP"
                required
                // disabled={disable}
                value={field.value as PhoneValue} // PhoneValue
                onChange={field.onChange} // (val: PhoneValue) => void
                error={fieldState.error?.message}
                helperText="Awali dengan kode negara. Contoh: +62812xxxxxxx"
                defaultCountry="ID"
                international
              />
            )}
          />
          <TextInput
            label="Email PIC"
            required
            errors={errors?.borrowerEmail?.message}
            {...register("borrowerEmail")}
          />
        </div>
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            type="button"
            variant="outlined"
            color="warning"
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

export default FormStep2;
