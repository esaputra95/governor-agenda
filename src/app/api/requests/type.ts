// features/room-requests/dto.ts
import { z } from "zod";
import { ServiceApprovalStatus } from "@prisma/client";

export const RequestStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "FINISH",
]);
export const ServiceApprovalStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

const MAX = {
  id: 36,
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
  rejectionReason: 255,
  approvalNote: 255,
};

const ZServiceApprovalStatus = z.nativeEnum(ServiceApprovalStatus);
// Jika TIDAK pakai Prisma enum, gunakan fallback di bawah:
// const ZServiceApprovalStatus = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const RequestDetailCreateSchema = z
  .object({
    id: z.string().uuid().max(MAX.id).optional(),

    roomRequestId: z.string().uuid().max(MAX.id).optional(),
    serviceId: z.string().uuid().max(MAX.id),

    requestedQty: z.number().int().min(1, "Qty diminta minimal 1"),
    approvedQty: z.number().int().nullable().optional(),

    status: ZServiceApprovalStatus.optional(),

    approverId: z.string().uuid().max(MAX.id).nullable().optional(),
    approvalNote: z.string().trim().max(MAX.approvalNote).nullable().optional(),

    // attachments dikelola schema terpisah bila perlu
  })
  .superRefine((v, ctx) => {
    if (v.approvedQty != null && v.approvedQty > v.requestedQty) {
      ctx.addIssue({
        code: "custom",
        path: ["approvedQty"],
        message: "Qty disetujui tidak boleh melebihi qty diminta",
      });
    }
  });

export const ServiceItemCreateDto = z.object({
  serviceId: z.string().uuid().max(MAX.id),
  requestedQty: z.coerce.number().int().positive(),
  // optional fields kalau dipakai saat update layanan
  approvedQty: z.coerce.number().int().positive().nullable().optional(),
  status: ServiceApprovalStatusEnum.default("PENDING"),
  approverId: z.string().uuid().max(MAX.id).nullable().optional(),
  approvalNote: z.string().trim().max(MAX.approvalNote).nullable().optional(),
});

export const RoomRequestCreateDto = z
  .object({
    // relasi wajib
    roomId: z.string().uuid().max(MAX.id),
    requesterId: z.string().uuid().max(MAX.id).optional(),

    // identitas
    requestNumber: z.string().trim().min(1).max(MAX.requestNumber).optional(),
    title: z.string().trim().min(1).max(MAX.title),
    purpose: z.string().trim().max(MAX.purpose).nullable().optional(),
    note: z.string().trim().max(MAX.note).nullable().optional(),

    // jadwal
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),

    // borrower (opsional)
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
      .regex(/^[0-9+()\-\s]*$/, "Format nomor tidak valid")
      .nullable()
      .optional(),
    borrowerEmail: z
      .string()
      .trim()
      .max(MAX.borrowerEmail)
      .email("Email tidak valid")
      .nullable()
      .optional(),

    // lokasi
    isOffsite: z.boolean().default(false),
    addressLine: z.string().trim().max(MAX.addressLine).nullable().optional(),
    district: z.string().trim().max(MAX.district).nullable().optional(),
    city: z.string().trim().max(MAX.city).nullable().optional(),
    province: z.string().trim().max(MAX.province).nullable().optional(),
    postalCode: z.string().trim().max(MAX.postalCode).nullable().optional(),

    // logistik
    attendeesCount: z.coerce.number().int().positive().nullable().optional(),
    requireCatering: z.boolean().default(false),
    requireItSupport: z.boolean().default(false),
    equipment: z.any().nullable().optional(),
    additionalRequirements: z.string().nullable().optional(),

    // status awal
    status: RequestStatusEnum.default("PENDING"),

    // detail (opsional)
    services: z
      .array(ServiceItemCreateDto)
      .min(1, "Minimal 1 layanan")
      .optional(),
    requestDetails: z.array(RequestDetailCreateSchema),
  })
  .superRefine((v, ctx) => {
    if (v.endAt < v.startAt) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "Selesai harus ≥ Mulai",
      });
    }
  });

export const RoomRequestUpdateDto = RoomRequestCreateDto.partial()
  .extend({
    id: z.string().uuid().max(MAX.id).optional(),
    images: z.array(z.object({ name: z.string() })).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.startAt && v.endAt && v.endAt < v.startAt) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "Selesai harus ≥ Mulai",
      });
    }
  });

export type RoomRequestCreate = z.infer<typeof RoomRequestCreateDto>;
export type RoomRequestUpdate = z.infer<typeof RoomRequestUpdateDto>;
