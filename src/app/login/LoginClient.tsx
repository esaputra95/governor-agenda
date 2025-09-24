"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

type FormValues = { email: string; password: string };
const DEFAULT_AFTER_LOGIN = "/";

export default function LoginClient() {
  const { register, handleSubmit } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const { status } = useSession();

  // jika sudah login dan nyasar ke /login → lempar ke dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(DEFAULT_AFTER_LOGIN);
    }
  }, [status, router]);

  // (opsional) bersihkan ?callbackUrl= (kosong) jika masih ada
  useEffect(() => {
    const raw = sp.get("callbackUrl");
    if (raw !== null && raw.trim() === "") {
      router.replace("/login");
    }
  }, [sp, router]);

  const callbackUrl = useMemo(() => {
    const raw = sp.get("callbackUrl");
    if (!raw || raw.trim() === "") return DEFAULT_AFTER_LOGIN;

    try {
      const url = raw.startsWith("http")
        ? new URL(raw)
        : new URL(raw, window.location.origin);
      const sameOrigin = url.origin === window.location.origin;
      const bad =
        !sameOrigin ||
        url.pathname === "/login" ||
        url.pathname.startsWith("/api/auth");
      if (bad) return DEFAULT_AFTER_LOGIN;

      url.searchParams.delete("callbackUrl"); // buang nesting
      const qs = url.searchParams.toString();
      return qs ? `${url.pathname}?${qs}` : url.pathname;
    } catch {
      if (raw.startsWith("/") && !raw.startsWith("/login")) return raw;
      return DEFAULT_AFTER_LOGIN;
    }
  }, [sp]);

  const onSubmit = async (v: FormValues) => {
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", {
      ...v,
      redirect: false, // kontrol manual
      callbackUrl,
    });
    setLoading(false);

    if (!res) return setErr("Unexpected error");
    if (res.error) return setErr("Email atau password salah");

    router.replace(res.url ?? callbackUrl);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <h1 className="text-xl font-semibold">Sign In</h1>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="space-y-1">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full border rounded p-2"
            {...register("email", { required: true })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full border rounded p-2"
            {...register("password", { required: true })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
