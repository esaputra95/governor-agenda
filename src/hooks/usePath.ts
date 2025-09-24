"use client";

import { usePathname } from "next/navigation";

/**
 * Hook untuk mengambil path aktif.
 * Contoh:
 *   /masters/service-and-rooms → "masters/service-and-rooms"
 */
export function useCurrentPath() {
  const pathname = usePathname(); // "/masters/service-and-rooms"

  // hapus slash pertama → "masters/service-and-rooms"
  const cleanPath = pathname.replace(/^\//, "");

  return cleanPath;
}
