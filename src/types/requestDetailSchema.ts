import { z } from "zod";
// Jika kamu punya enum Prisma:
import { ServiceApprovalStatus } from "@prisma/client"; // <-- hapus baris ini jika tidak pakai Prisma enum
import { ServiceType } from "./serviceSchema";

// Batas panjang field (mengikuti @db.VarChar)
const MAX = {
  id: 36,
  approvalNote: 255,
};

// Enum status approval
// Jika pakai Prisma enum:
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

export type RoomRequestServiceCreate = z.infer<
  typeof RequestDetailCreateSchema
>;

// Update: semua optional, tapi butuh `id`
export const RoomRequestServiceUpdateSchema =
  RequestDetailCreateSchema.partial()
    .extend({
      id: z.string().uuid().max(MAX.id), // wajib saat update
    })
    .superRefine((v, ctx) => {
      // Validasi konsisten jika keduanya tersedia
      if (
        v.requestedQty != null &&
        v.approvedQty != null &&
        v.approvedQty > v.requestedQty
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["approvedQty"],
          message: "Qty disetujui tidak boleh melebihi qty diminta",
        });
      }
    });

export type RoomRequestServiceUpdate = z.infer<
  typeof RoomRequestServiceUpdateSchema
>;

// Kalau kamu butuh input berupa array items (mis. create banyak sekaligus)
export const RoomRequestServiceBulkCreateSchema = z
  .array(RequestDetailCreateSchema)
  .min(1, "Minimal 1 layanan");

export type RoomRequestServiceBulkCreate = z.infer<
  typeof RoomRequestServiceBulkCreateSchema
>;

export type RequestDetailTable = RoomRequestServiceCreate & {
  service: ServiceType;
};
