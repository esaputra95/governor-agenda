import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { fail } from "./http";
import { NextRequest, NextResponse } from "next/server";

export class AppError extends Error {
  code?: string;
  field?: string;
  status: number;
  details?: unknown;

  constructor(
    message: string,
    opts?: { code?: string; field?: string; status?: number; details?: unknown }
  ) {
    super(message);
    this.name = "AppError";
    this.code = opts?.code;
    this.field = opts?.field;
    this.status = opts?.status ?? 400;
    this.details = opts?.details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** Ubah error apapun menjadi NextResponse JSON yang konsisten */
export function toErrorResponse(err: unknown) {
  // Zod
  if (err instanceof ZodError) {
    const first = err.issues[0];
    return fail(first?.message || "Validasi gagal", {
      code: "VALIDATION",
      field: String(first?.path?.[0] ?? ""),
      status: 400,
      details: err.issues,
    });
  }

  // AppError custom
  if (err instanceof AppError) {
    return fail(err.message, {
      code: err.code,
      field: err.field,
      status: err.status,
      details: err.details,
    });
  }

  // Prisma Known
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = err.meta as Record<string, unknown> | undefined;
    const field = String(meta?.target ?? meta?.field_name ?? "");
    switch (err.code) {
      case "P2002":
        return fail("Data sudah ada / unik duplikat", {
          code: err.code,
          field,
          status: 409,
        });
      case "P2003":
        return fail("Melanggar relasi/foreign key", {
          code: err.code,
          field,
          status: 400,
        });
      case "P2025":
        return fail("Data tidak ditemukan", {
          code: err.code,
          field,
          status: 404,
        });
      default:
        return fail("Kesalahan database", {
          code: err.code,
          field,
          status: 500,
          details: meta,
        });
    }
  }

  // Prisma Validation
  if (err instanceof Prisma.PrismaClientValidationError) {
    return fail("Input tidak valid untuk database", {
      code: "PRISMA_VALIDATION",
      status: 400,
    });
  }

  // Fallback
  if (err instanceof Error) {
    return fail(err.message, { code: "INTERNAL", status: 500 });
  }

  return fail("Internal Server Error", { code: "INTERNAL", status: 500 });
}

export function wrap<
  TCtx extends Record<string, unknown> = Record<string, unknown>
>(
  handler: (
    req: NextRequest,
    ctx: TCtx
  ) => Response | NextResponse | Promise<Response | NextResponse>
) {
  return async (req: NextRequest, ctx: TCtx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      console.error(err);
      return toErrorResponse(err);
    }
  };
}
