import { prisma } from "./prisma";

export const generateRequestNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();

  // Cari request terakhir di tahun ini
  const lastRequest = await prisma.room_requests.findFirst({
    where: {
      requestNumber: {
        startsWith: `RR-${year}-`,
      },
    },
    orderBy: { requestNumber: "desc" },
    select: { requestNumber: true },
  });

  let seq = 1;
  if (lastRequest?.requestNumber) {
    // Ambil bagian terakhir (angka)
    const parts = lastRequest.requestNumber.split("-");
    const lastSeq = parseInt(parts[2], 10);
    seq = lastSeq + 1;
  }

  // Format ke 6 digit (padStart)
  const seqStr = String(seq).padStart(6, "0");

  return `RR-${year}-${seqStr}`;
};
