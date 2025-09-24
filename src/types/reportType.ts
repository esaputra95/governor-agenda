import z from "zod";

export type DataReportType = string[];

export const reportSchema = z.object({
  startAt: z.string().min(1, { message: "Tanggal mulai wajib diisi" }),
  endAt: z.string().min(1, { message: "Tanggal selesai wajib diisi" }),
});

export type ReportType = z.infer<typeof reportSchema>;
