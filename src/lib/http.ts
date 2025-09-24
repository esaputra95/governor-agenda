import { NextResponse } from "next/server";

export function setResponse<T>(data: T, message = "OK", status = 200) {
  return NextResponse.json({ ok: true, message, data }, { status });
}

export function fail(
  message: string,
  opts?: { code?: string; field?: string; status?: number; details?: unknown }
) {
  const { code, field, status = 400, details } = opts ?? {};
  return NextResponse.json(
    { ok: false, error: { code, message, field, details } },
    { status }
  );
}
