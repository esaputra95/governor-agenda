import { z } from "zod";
import { UserType } from "./userSchema";
import { OptionSelectSchema } from "./globalSchema";

// batas sesuai schema Prisma
const DESC_MAX = 255;

export type FormMode = "create" | "edit";

export const SchedulesTypeEnum = z.enum(["Schedules", "room"]);

// ---- Skema dasar (sesuai kolom DB) ----
export const SchedulesSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, { message: "Pengguna/Pegawai wajib diisi" }),
  userOption: OptionSelectSchema.optional(),
  description: z.string().trim().max(DESC_MAX).nullable().optional(),
  startAt: z.string().min(1, { message: "Waktu kegiatan tidak boleh kosong" }),
  endAt: z.string().min(1, { message: "Waktu kegiatan tidak boleh kosong" }),
  userCreate: z.string().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

export type SchedulesType = z.infer<typeof SchedulesSchema>;
export type ScheduleTableType = SchedulesType & {
  users?: UserType;
};
