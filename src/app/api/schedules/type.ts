import { z } from "zod";

export const uuid36 = z.string().uuid();

/** Util: DateTime dalam payload API → string ISO */
export const isoDateTime = z.string().datetime({ offset: true });

export const ServiceTypeEnum = z.enum(["service", "room"]);

export const CreateSchema = z.object({
  userId: uuid36,
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  description: z.string().min(1, "Description is required"),
  userCreate: z.string().optional(),
});

export const ScheduleUpdateSchema = z
  .object({
    userId: uuid36.optional(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    description: z.string().min(1).optional(),
    // biasanya tidak mengubah userCreate; kalau perlu, buka komentar:
    // userCreate: uuid36.optional(),
    // soft-delete toggle or set value
    deletedAt: z.coerce.date(),
  })
  .refine(
    (v) => {
      if (!v.startAt || !v.endAt) return true; // hanya validasi jika keduanya ada
      return new Date(v.startAt).getTime() <= new Date(v.endAt).getTime();
    },
    {
      path: ["endAt"],
      message: "endAt must be greater than or equal to startAt",
    }
  );
