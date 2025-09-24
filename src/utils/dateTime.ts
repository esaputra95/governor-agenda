import dayjs from "dayjs";

export function toDatetimeLocal(input?: string | Date | null): string {
  if (!input) return "";
  return dayjs(input).format("YYYY-MM-DDTHH:mm");
}
