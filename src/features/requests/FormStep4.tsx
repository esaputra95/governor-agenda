import Button from "@/components/ui/buttons/Button";
import { FC, useEffect, useState } from "react";
import LocalUploader, { Uploaded } from "@/components/ui/inputs/FileInput";
import { toast } from "react-toastify";

type Props = {
  onNext: (data: Uploaded) => void;
  onBack: (data?: Uploaded) => void;
  initialValue?: Partial<Uploaded>;
  isLoading?: boolean;
};

const FormStep4: FC<Props> = ({ onNext, onBack, initialValue, isLoading }) => {
  const [dataUpload, setDataUpload] = useState<Uploaded>();
  const onSubmit = (data?: Uploaded) => {
    if (!data) {
      toast.error("Dokument wajib dipilih");
      return;
    }
    onNext(data);
  };

  useEffect(() => {
    if (initialValue) {
      setDataUpload(initialValue as Uploaded);
    }
  }, [initialValue]);

  return (
    <div className="flex flex-col space-y-4 border p-4 border-sky-100 rounded-2xl">
      <LocalUploader
        initialValue={initialValue?.url}
        response={(data) => setDataUpload(data)}
      />

      <div className="flex justify-between">
        <Button
          variant="outlined"
          color="warning"
          onClick={() => onBack(dataUpload)}
        >
          Kembali
        </Button>
        <Button
          variant="outlined"
          color="success"
          isLoading={isLoading}
          onClick={() => onSubmit(dataUpload)}
        >
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default FormStep4;
