import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 00:00:00

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  try {
    const data = await prisma.room_requests.findMany({
      where: {
        startAt: {
          gte: today,
          lte: tomorrow,
        },
      },
      include: {
        rooms: true,
      },
    });

    const schedule = await prisma.schedules.findMany({
      where: {
        startAt: {
          gte: today,
          lte: tomorrow,
        },
      },
      include: {
        users: true,
      },
    });

    const roomResponse = data?.map((val) => ({
      id: val.id,
      title: val.title,
      startAt: dayjs(val.startAt).format("YYYY-MM-DD hh:mm"),
      endAt: dayjs(val.endAt).format("YYYY-MM-DD hh:mm"),
      name: val.borrowerName,
      organization: val.borrowerOrganization,
      room: val.rooms?.name,
    }));

    const scheduleResponse = schedule?.map((val) => ({
      id: val.id,
      startAt: dayjs(val.startAt).format("YYYY-MM-DD hh:mm"),
      endAt: dayjs(val.endAt).format("YYYY-MM-DD hh:mm"),
      title: val.description,
      user: val.users?.name,
      role: val?.users?.role,
    }));

    return NextResponse.json(
      {
        status: true,
        message: "Data room_requests Berhasil Diambil",
        data: {
          room: roomResponse,
          schedule: scheduleResponse,
        },
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
