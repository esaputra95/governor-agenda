// app/api/schedules/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Helper: boleh kirim number sebagai status
function json(data: unknown, init?: number | ResponseInit) {
  if (typeof init === "number")
    return NextResponse.json(data, { status: init });
  return NextResponse.json(data, init);
}

const updateSchema = z
  .object({
    userId: z.string().min(1).optional(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    description: z.string().optional(),
    hardDelete: z.boolean().optional(), // hanya dipakai di DELETE kalau kirim via body
  })
  .refine((d) => (d.startAt && d.endAt ? d.endAt > d.startAt : true), {
    message: "endAt must be after startAt",
    path: ["endAt"],
  });

// NOTE: Next.js 15.5 expects params as a Promise<{ id: string }>
type Ctx = { params: Promise<{ id: string }> };

// GET /api/schedules/:id
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const schedule = await prisma.schedules.findFirst({
    where: { id, deletedAt: null },
    include: { users: true },
  });

  if (!schedule) return json({ message: "Schedule not found" }, 404);
  return json(schedule);
}

// PATCH /api/schedules/:id
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { message: "Validation error", errors: parsed.error.flatten() },
      400
    );
  }

  const exists = await prisma.schedules.findFirst({
    where: { id, deletedAt: null },
  });
  if (!exists) return json({ message: "Schedule not found" }, 404);

  // buang hardDelete bila ikut terkirim
  const { userId, startAt, endAt, description } = parsed.data;
  const data = {
    ...(userId !== undefined && { userId }),
    ...(startAt !== undefined && { startAt }),
    ...(endAt !== undefined && { endAt }),
    ...(description !== undefined && { description }),
  };

  const updated = await prisma.schedules.update({
    where: { id },
    data,
  });
  return json(updated);
}

// DELETE /api/schedules/:id
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  // default dari query ?hard=true
  let hard = req.nextUrl.searchParams.get("hard") === "true";

  // kalau body kirim { hardDelete: boolean }, override nilai dari query
  try {
    const body = await req.json();
    if (typeof body?.hardDelete === "boolean") {
      hard = body.hardDelete;
    }
  } catch {
    // tidak ada body -> abaikan
  }

  const existing = await prisma.schedules.findUnique({ where: { id } });
  if (!existing) return json({ message: "Schedule not found" }, 404);

  if (hard) {
    await prisma.schedules.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  }

  if (existing.deletedAt) {
    // idempotent
    return new NextResponse(null, { status: 204 });
  }

  await prisma.schedules.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return new NextResponse(null, { status: 204 });
}
