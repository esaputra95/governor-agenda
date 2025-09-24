// app/api/services/[id]/route.ts
import { AppError, wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextRequest } from "next/server";

// Schema yang sesuai model `services`
const UpdateSchema = z
  .object({
    name: z.string().min(1).max(150).optional(),
    type: z.string().max(50).optional(),
    description: z.string().max(10_000).optional(),
  })
  .strict();

// GET /api/services/[id]
export const GET = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const service = await prisma.services.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!service) {
      throw new AppError("Service tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return setResponse(service, "Detail Service");
  }
);

// PUT /api/services/[id]  (partial update)
export const PUT = wrap(
  async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    const body = await req.json();
    const parsed = UpdateSchema.parse(body);

    // Pick only defined keys → hindari overwrite tak sengaja
    const data: Record<string, unknown> = {};
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.type !== undefined) data.type = parsed.type;
    if (parsed.description !== undefined) data.description = parsed.description;

    // Pastikan record ada → kasih 404 yang rapi kalau tidak
    const exists = await prisma.services.findUnique({ where: { id } });
    if (!exists) {
      throw new AppError("Service tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const updated = await prisma.services.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return setResponse(updated, "Service diupdate");
  }
);

// DELETE /api/services/[id]
export const DELETE = wrap(
  async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
    const { id } = await ctx.params;

    // kalau ingin soft delete: ganti ke update { deletedAt: new Date() }
    const deleted = await prisma.services.delete({
      where: { id },
    });

    return setResponse(deleted, "Service dihapus");
  }
);
