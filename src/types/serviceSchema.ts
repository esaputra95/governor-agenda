import { z } from "zod";

// batas sesuai schema Prisma
const NAME_MAX = 100;
const DESC_MAX = 255;
const UNIT_MAX = 30;

export type FormMode = "create" | "edit";

export const ServiceTypeEnum = z.enum(["service", "room"]);

// ---- Skema dasar (sesuai kolom DB) ----
export const ServiceSchema = z.object({
  id: z.string().optional(), // di DB @default(uuid())
  name: z.string().trim().min(1, "Nama wajib diisi").max(NAME_MAX),
  description: z.string().trim().max(DESC_MAX).nullable().optional(),
  unit: z.string().trim().max(UNIT_MAX).nullable().optional(),
  active: z.boolean().optional(), // di DB default(true)
  maxPerRequest: z.number().int().positive().nullable().optional(),
  type: ServiceTypeEnum.optional(), // di DB default("service")
  // timestamp (sesuaikan preferensi: string/Date). Di contoh kamu pakai string:
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ServiceType = z.infer<typeof ServiceSchema>;
