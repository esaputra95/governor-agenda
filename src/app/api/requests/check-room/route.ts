import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, startAt, endAt, id } = body as {
      roomId: string;
      startAt: string;
      endAt: string;
      id?: string;
    };

    if (!startAt || !endAt || !roomId) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const data = await prisma.room_requests.findFirst({
      where: {
        roomId,
        startAt: { lte: new Date(endAt) },
        endAt: { gte: new Date(startAt) },
        status: { in: ["PENDING", "APPROVED"] },
        id: {
          not: id,
        },
      },
    });

    console.log({ data });

    return NextResponse.json({ data: data ? true : false }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
