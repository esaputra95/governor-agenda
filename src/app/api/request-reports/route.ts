import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const startAt = (sp.get("startAt") || "").trim();
  const endAt = (sp.get("endAt") || "").trim();
  try {
    const data = await prisma.room_requests.findMany({
      where: {
        startAt: {
          gte: new Date(startAt as string),
          lte: new Date(endAt as string),
        },
      },
      include: {
        requester: true,
        approvedBy: true,
        rooms: true,
        attachments: true,
        services: {
          include: {
            service: true,
          },
        },
        rejectedBy: true,
      },
    });

    let response = data?.map((val) => [
      val?.borrowerName?.toString() ?? "",
      val?.borrowerOrganization ?? "",
      val?.borrowerPhone ?? "",
      val?.status,
      dayjs(val?.startAt).format("DD/MM/YYYY hh:mm"),
      dayjs(val?.endAt).format("DD/MM/YYYY hh:mm"),
    ]);

    response = [
      ["Nama PIC", "Organisasi", "Phone", "Status", "Mulai", "Akhir"],
      ...response,
    ];

    return NextResponse.json(
      {
        status: true,
        message: "Data room_requests Berhasil Diambil",
        data: response,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/room_requests error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data room_requests" },
      { status: 500 }
    );
  }
}
