"use client";

import { useEffect, useState } from "react";

/** utils/fileAccept.ts (boleh dipisah ke file sendiri) */
export type AcceptType = "documents" | "images" | "docAndImg";

export const ACCEPTS: Record<AcceptType, string> = {
  documents:
    ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv," +
    "application/pdf,application/msword," +
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
    "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
    "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation," +
    "text/plain,text/csv",
  images: ".jpg,.jpeg,.png,.gif,.webp,.svg,image/*",
  docAndImg:
    ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv," +
    "application/pdf,application/msword," +
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
    "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
    "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation," +
    "text/plain,text/csv," +
    ".jpg,.jpeg,.png,.gif,.webp,.svg,image/*",
};

export type Uploaded = { name?: string; url: string; type?: string };

type Props = {
  response?: (data: Uploaded) => void;
  initialValue?: string;
  /** bisa pakai preset ("documents" | "images" | "docAndImg") atau custom string accept */
  accept?: AcceptType | string;
  multiple?: boolean;
};

// tipe sesuai respons API
type ApiFile = {
  originalName: string;
  storedName: string;
  url: string;
  size: number;
  type: string;
};

type ApiResponse = {
  ok: boolean;
  files: ApiFile[];
  message?: string;
};

export default function LocalUploader({
  response,
  initialValue,
  accept = "documents",
  multiple = true,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<Uploaded[]>([]);

  useEffect(() => {
    if (initialValue) {
      setFiles([{ url: initialValue }]);
    } else {
      setFiles([]);
    }
  }, [initialValue]);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list?.length) return;

    const fd = new FormData();
    Array.from(list).forEach((f) => fd.append("file", f)); // name "file"

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data: ApiResponse = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data?.message ?? "Upload gagal");
      }

      // callback single file tetap (ambil pertama)
      if (data.files.length > 0) {
        response?.({
          name: data.files[0].originalName,
          type: data.files[0].type,
          url: data.files[0].url,
        });
      }

      setFiles(
        data.files.map((f) => ({
          name: f.originalName,
          url: f.url,
          type: f.type,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
      e.target.value = ""; // reset input
    }
  }

  // petakan prop accept → string untuk atribut input
  const acceptString = typeof accept === "string" ? accept : ACCEPTS[accept];

  return (
    <div className="space-y-3">
      <input
        type="file"
        multiple={multiple}
        accept={acceptString}
        onChange={handleChange}
        disabled={busy}
        className="block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-white hover:file:bg-sky-700"
      />
      {busy && <p className="text-sm text-slate-600">Mengunggah…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="text-sm list-disc pl-5">
        {files.map((f) => (
          <li key={f.url}>
            {f.name ?? "file"} —{" "}
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 underline"
            >
              buka
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
