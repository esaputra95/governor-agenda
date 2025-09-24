"use client";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Button from "../buttons/Button";
import Image from "next/image";

type Uploaded = { name?: string; url: string; type?: string };

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

export default function DropzoneImages({
  onUploaded,
}: {
  onUploaded?: (files: Uploaded[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: (accepted) => setFiles((prev) => [...prev, ...accepted]),
  });

  async function uploadAll() {
    if (!files.length) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("file", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });

      const data: ApiResponse = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.message ?? "Upload gagal");

      const uploaded: Uploaded[] = data.files.map((f) => ({
        name: f.originalName,
        url: f.url,
        type: f.type,
      }));
      onUploaded?.(uploaded);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? "border-sky-500" : ""
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-slate-600">
          Drag & drop atau klik untuk pilih gambar
        </p>
      </div>

      {!!files.length && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((f, i) => (
              <Image
                key={i}
                src={URL.createObjectURL(f)}
                alt={f.name}
                height={100}
                width={100}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
          <Button
            size="small"
            onClick={uploadAll}
            isLoading={busy}
            type="button"
          >
            {busy ? "Mengunggah…" : "Upload Semua"}
          </Button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </>
      )}
    </div>
  );
}
