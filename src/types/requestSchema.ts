import { z } from "zod";
import { OptionSelectSchema } from "./globalSchema";
import { RequestDetailCreateSchema } from "./requestDetailSchema";

/** Enum status sesuai Prisma: sesuaikan jika ada nilai lain */
export const RequestStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "FINISH",
]);

/** Helper */
const MAX = {
  requestNumber: 30,
  title: 150,
  purpose: 255,
  note: 255,
  borrowerName: 100,
  borrowerOrg: 150,
  borrowerPhone: 30,
  borrowerEmail: 150,
  addressLine: 255,
  district: 100,
  city: 100,
  province: 100,
  postalCode: 20,
};

export const AttachmentSchema = z.object({
  id: z.string().optional(),
  url: z.string().optional(),
});

// ---- Skema dasar (sesuai kolom DB) ----
export const RequestSchema = z.object({
  id: z.string().optional(),

  roomId: z.string().uuid().max(36, { message: "roomId tidak valid" }),

  // Identitas & ringkasan
  requestNumber: z.string().trim().min(1).max(MAX.requestNumber).optional(),
  title: z.string().trim().min(1).max(MAX.title),
  purpose: z.string().trim().max(MAX.purpose).nullable().optional(),
  note: z.string().trim().max(MAX.note).nullable().optional(),

  // Jadwal
  startAt: z.date(),
  endAt: z.date(),

  // Peminjam/penanggung jawab (opsional)
  borrowerName: z.string().trim().max(MAX.borrowerName).nullable().optional(),
  borrowerOrganization: z
    .string()
    .trim()
    .max(MAX.borrowerOrg)
    .nullable()
    .optional(),
  borrowerPhone: z
    .string()
    .trim()
    .max(MAX.borrowerPhone)
    .regex(/^[0-9+()\-\s]*$/, { message: "Format nomor tidak valid" })
    .nullable()
    .optional(),
  borrowerEmail: z
    .string()
    .trim()
    .max(MAX.borrowerEmail)
    .email("Email tidak valid")
    .nullable()
    .optional(),

  // Lokasi
  addressLine: z.string().trim().max(MAX.addressLine).nullable().optional(),
  district: z.string().trim().max(MAX.district).nullable().optional(),
  city: z.string().trim().max(MAX.city).nullable().optional(),
  province: z.string().trim().max(MAX.province).nullable().optional(),
  postalCode: z.string().trim().max(MAX.postalCode).nullable().optional(),

  // Logistik
  attendeesCount: z.number().int().positive().nullable().optional(),
  requireCatering: z.boolean().optional(),
  requireItSupport: z.boolean().optional(),
  // equipment: z.any().nullable().optional(), // JSON bebas
  additionalRequirements: z.string().nullable().optional(),

  // // ACC keseluruhan
  status: RequestStatusEnum.optional(),
  approvedById: z.string().uuid().nullable().optional(),
  approvedAt: z.string().nullable().optional(),

  // // Penolakan
  rejectedById: z.string().uuid().nullable().optional(),
  rejectedAt: z.string().nullable().optional(),
  // rejectionReason: z.string().trim().max(255).nullable().optional(),

  // // Audit
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  requestDetails: z.array(RequestDetailCreateSchema),
  attachments: z.array(AttachmentSchema).optional(),
});

export const RequestFormStep1 = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Nama kegiatan tidak boleh kosong" }),
  startAt: z.string().min(1, { message: "Waktu kegiatan tidak boleh kosong" }),
  endAt: z.string().min(1, { message: "Waktu kegiatan tidak boleh kosong" }),
  roomId: z.string().min(1, { message: "Ruangan tidak boleh kosong" }),
  roomOption: OptionSelectSchema.optional(),
  status: RequestStatusEnum,
});

export const RequestFormStep2 = z.object({
  borrowerName: z.string().min(1, { message: "Nama PIC tidak boleh kosong" }),
  borrowerOrganization: z
    .string()
    .min(1, { message: "Nama organisasi tidak boleh kosong" }),
  borrowerPhone: z.string().min(1, { message: "Hp PIC tidak boleh kosong" }),
  borrowerEmail: z.email().optional(),
});

export const RequestFormStep3 = z.object({
  services: z
    .array(
      z.object({
        id: z.string().optional(),
        serviceId: z.string().min(1, { message: "Layanan tidak boleh kosong" }),
        serviceOption: OptionSelectSchema.optional(),
        quantity: z
          .number()
          .int()
          .min(1, { message: "Quantity tidak boleh kosong" }),
      })
    )
    .min(1, { message: "Minimal 1 layanan" }),
});

export const RequestChangeStatus = z.object({
  id: z.string().optional(),
  status: RequestStatusEnum,
  requestDetails: z.array(RequestDetailCreateSchema).optional(),
  images: z
    .array(
      z.object({
        name: z.string().optional(),
      })
    )
    .optional(),
});

export type RequestFormStep1Type = z.infer<typeof RequestFormStep1>;
export type RequestFormStep2Type = z.infer<typeof RequestFormStep2>;
export type RequestFormStep3Type = z.infer<typeof RequestFormStep3>;
export type RequestType = z.infer<typeof RequestSchema>;
export type RequestChangeStatusType = z.infer<typeof RequestChangeStatus>;
export type RequestStatusType = z.infer<typeof RequestStatusEnum>;
