// app/components/LabelFromPath.tsx
"use client";

import { usePathname } from "next/navigation";

function toLabel(seg?: string) {
  if (!seg) return "";
  const s = decodeURIComponent(seg).replace(/-/g, " ");
  return s.replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
}

export default function LabelFromPath() {
  const pathname = usePathname(); // "/reports/schedule-reports"
  const last = pathname.split("/").filter(Boolean).pop(); // "schedule-reports"
  const label = toLabel(last); // "Schedule Reports"

  return <>{label}</>;
}
