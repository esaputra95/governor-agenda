"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useGetParams = () => {
  const searchParams = useSearchParams(); // langsung object, bukan array

  const queryParams = useMemo(() => {
    const obj: Record<string, string> = {};
    // Next.js 13+ searchParams support .forEach
    searchParams?.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  return queryParams;
};

export default useGetParams;
