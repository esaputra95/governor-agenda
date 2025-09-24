// app/api/requests/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { RoomRequestUpdateDto } from "../type";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

// util: cek key pada object unknown
const has = <K extends string>(o: unknown, k: K): o is Record<K, unknown> =>
  !!o && typeof o === "object" && k in o;

// util: coerce Date atau ISO string -> Date
const toDate = (v: unknown): Date | undefined => {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  const s = String(v);
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
};

// GET /api/requests/[id]
export const GET = wrap(
  async (
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> } // Next.js 15.5: params adalah Promise
  ) => {
    const { id } = await ctx.params;

    const data = await prisma.room_requests.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!data) {
      throw new AppError("Data tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(data, "Detail Request");
  }
);

// PUT /api/requests/[id]
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    // --- Parse & validasi body
    const body = await req.json();
    const parsed = RoomRequestUpdateDto.parse(body);

    // --- Build data update secara “pick only defined”
    const dataToUpdate: Prisma.room_requestsUpdateInput = {};

    if (has(parsed, "roomId") && parsed.roomId) {
      dataToUpdate.rooms = { connect: { id: String(parsed.roomId) } };
    }
    if (has(parsed, "title") && parsed.title !== undefined) {
      dataToUpdate.title = String(parsed.title);
    }
    if (has(parsed, "purpose") && parsed.purpose !== undefined) {
      dataToUpdate.purpose = String(parsed.purpose);
    }
    if (has(parsed, "note") && parsed.note !== undefined) {
      dataToUpdate.note = String(parsed.note);
    }

    const startAt = has(parsed, "startAt") ? toDate(parsed.startAt) : undefined;
    const endAt = has(parsed, "endAt") ? toDate(parsed.endAt) : undefined;
    if (startAt) dataToUpdate.startAt = startAt;
    if (endAt) dataToUpdate.endAt = endAt;

    if (has(parsed, "borrowerName") && parsed.borrowerName !== undefined) {
      dataToUpdate.borrowerName = String(parsed.borrowerName);
    }
    if (
      has(parsed, "borrowerOrganization") &&
      parsed.borrowerOrganization !== undefined
    ) {
      dataToUpdate.borrowerOrganization = String(parsed.borrowerOrganization);
    }
    if (has(parsed, "borrowerPhone") && parsed.borrowerPhone !== undefined) {
      dataToUpdate.borrowerPhone = String(parsed.borrowerPhone);
    }
    if (has(parsed, "borrowerEmail") && parsed.borrowerEmail !== undefined) {
      dataToUpdate.borrowerEmail = String(parsed.borrowerEmail);
    }

    if (has(parsed, "status") && parsed.status !== undefined) {
      dataToUpdate.status = parsed.status;
    }

    if (has(parsed, "isOffsite") && parsed.isOffsite !== undefined) {
      dataToUpdate.isOffsite = !!parsed.isOffsite;
    }
    if (has(parsed, "addressLine") && parsed.addressLine !== undefined) {
      dataToUpdate.addressLine = String(parsed.addressLine);
    }
    if (has(parsed, "district") && parsed.district !== undefined) {
      dataToUpdate.district = String(parsed.district);
    }
    if (has(parsed, "city") && parsed.city !== undefined) {
      dataToUpdate.city = String(parsed.city);
    }
    if (has(parsed, "province") && parsed.province !== undefined) {
      dataToUpdate.province = String(parsed.province);
    }
    if (has(parsed, "postalCode") && parsed.postalCode !== undefined) {
      dataToUpdate.postalCode = String(parsed.postalCode);
    }

    if (has(parsed, "attendeesCount") && parsed.attendeesCount !== undefined) {
      dataToUpdate.attendeesCount = Number(parsed.attendeesCount);
    }
    if (
      has(parsed, "requireCatering") &&
      parsed.requireCatering !== undefined
    ) {
      dataToUpdate.requireCatering = !!parsed.requireCatering;
    }
    if (
      has(parsed, "requireItSupport") &&
      parsed.requireItSupport !== undefined
    ) {
      dataToUpdate.requireItSupport = !!parsed.requireItSupport;
    }
    if (
      has(parsed, "additionalRequirements") &&
      parsed.additionalRequirements !== undefined
    ) {
      dataToUpdate.additionalRequirements = String(
        parsed.additionalRequirements
      );
    }

    // Apakah requestDetails dikirim (untuk replace)
    const detailsProvided = has(parsed, "requestDetails");

    // --- Jalankan transaksi
    const result = await prisma.$transaction(async (tx) => {
      // Pastikan header ada (agar error 404 jadi konsisten)
      const current = await tx.room_requests.findUnique({ where: { id } });
      if (!current) {
        throw new AppError("Data tidak ditemukan", {
          code: "NOT_FOUND",
          status: 404,
        });
      }

      const header = await tx.room_requests.update({
        where: { id },
        data: dataToUpdate,
        select: {
          id: true,
          roomId: true,
          title: true,
          startAt: true,
          endAt: true,
          status: true,
          borrowerName: true,
          borrowerEmail: true,
          updatedAt: true,
        },
      });

      // attachments (opsional)
      if (has(body, "images") && Array.isArray(body.images)) {
        const images = (body.images as Array<{ name?: string; url?: string }>)
          .map((img) => img?.url ?? img?.name)
          .filter(Boolean) as string[];

        if (images.length) {
          await tx.request_attachments.createMany({
            data: images.map((url) => ({
              roomRequestId: header.id,
              url,
              type: "IMAGE",
            })),
            skipDuplicates: true, // pastikan ada unique index yg cocok kalau mau efektif
          });
        }
      }

      // detail services (opsional): replace jika dikirim
      if (detailsProvided) {
        type IncomingDetail = {
          serviceId: string;
          requestedQty: number;
          approvedQty?: number | null;
          status?: "PENDING" | "APPROVED" | "REJECTED" | "PARTIALLY_APPROVED";
          approverId?: string | null;
          approvalNote?: string | null;
        };

        const requestDetailData: IncomingDetail[] =
          parsed.requestDetails?.map((val) => ({
            serviceId: String(val.serviceId),
            requestedQty: Number(val.requestedQty),
            approvedQty:
              val.approvedQty === null || val.approvedQty === undefined
                ? 0
                : Number(val.approvedQty),
            status: val.status,
            approverId: val.approverId ?? null,
            approvalNote: val.approvalNote ?? null,
          })) ?? [];

        // dedup by serviceId
        const uniqueDetails = Object.values(
          requestDetailData.reduce<Record<string, IncomingDetail>>((acc, d) => {
            acc[d.serviceId] = d;
            return acc;
          }, {})
        );

        // replace strategy: hapus semua lalu createMany ulang
        await tx.room_request_services.deleteMany({
          where: { roomRequestId: header.id },
        });

        if (uniqueDetails.length) {
          await tx.room_request_services.createMany({
            data: uniqueDetails.map((d) => ({
              roomRequestId: header.id,
              serviceId: d.serviceId,
              requestedQty: d.requestedQty,
              approvedQty: d.approvedQty ?? 0,
              status: d.status,
              approverId: d.approverId ?? null,
              approvalNote: d.approvalNote ?? null,
            })),
            skipDuplicates: true,
          });
        }
      }

      return header;
    });

    return setResponse(result, "Request diupdate");
  }
);

// DELETE /api/requests/[id]
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    // Jika mau soft delete: ganti ke update { deletedAt: new Date() }
    const deleted = await prisma.room_requests.delete({ where: { id } });
    return setResponse(deleted, "Request dihapus");
  }
);
