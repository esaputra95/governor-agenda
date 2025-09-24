import axios from "axios";

interface ErrorItem {
  msg?: string;
  path?: string;
  field?: string;
  message?: string;
}

interface ErrorResponse {
  error?: {
    message?: string;
    field?: string;
  };
  message?: string;
  errors?: ErrorItem[];
}

export const handleErrorResponse = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined;

    // 1. Jika ada field + message di root error
    if (data?.error?.field && data.error.message) {
      return `${data.error.field.toLocaleUpperCase()}: ${data.error.message}`;
    }

    // 2. Jika ada error.message biasa
    if (data?.error?.message) return data.error.message;

    // 3. Jika ada message di root
    if (data?.message) return data.message;

    // 4. Jika ada array errors
    if (Array.isArray(data?.errors) && data.errors[0]) {
      const first = data.errors[0];
      if (first.field && first.message) {
        return `${first.field}: ${first.message}`;
      }
      if (first.path && first.msg) {
        return `${first.path}: ${first.msg}`;
      }
      if (first.msg) return first.msg;
    }

    return error.message || "Terjadi kesalahan dari server";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan dari server";
};
