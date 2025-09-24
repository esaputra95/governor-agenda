// src/app/api/room_requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";
import { RoomRequestCreateDto } from "./type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateRequestNumber } from "@/lib/generateRequestNumber";

// ====== Helpers ======
const ALLOWED_SORT: Record<string, true> = {
  createdAt: true,
  updatedAt: true,
};

function parsePagination(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(parseInt(sp.get("page") || "1", 10), 1);
  const take = Math.min(
    100,
    Math.max(parseInt(sp.get("limit") || sp.get("take") || "10", 10), 1)
  );
  const skip = (page - 1) * take;

  const sortby = sp.get("sortby") || "createdAt";
  const sortdir =
    (sp.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  const orderBy = ALLOWED_SORT[sortby]
    ? { [sortby]: sortdir }
    : { createdAt: "desc" as const };

  const where: Prisma.room_requestsWhereInput = {
    // AND: [
    //   q
    //     ? {
    //         OR: [{ name: { contains: q, mode: "insensitive" } }],
    //       }
    //     : {},
    //   name ? { name: { contains: name, mode: "insensitive" } } : {},
    //   type ? { type: type as ServiceType } : {},
    // ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/room_requests ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, room_requests] = await Promise.all([
      prisma.room_requests.count({ where }),
      prisma.room_requests.findMany({
        orderBy,
        skip,
        take,
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
      }),
    ]);

    const totalPage = Math.max(1, Math.ceil(count / take));
    const nextPage = page * take < count ? page + 1 : null;

    return NextResponse.json(
      {
        status: true,
        message: "Data room_requests Berhasil Diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: room_requests,
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

// POST /api/room_requests
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = RoomRequestCreateDto.parse(body); // ZodError otomatis ditangkap wrap()
  const session = await getServerSession(authOptions);
  const requestNumber = await generateRequestNumber();

  const requestDetailData = parsed?.requestDetails.map((val) => ({
    requestedQty: val.requestedQty,
    serviceId: val.serviceId,
    approvedQty: 0,
  }));

  console.log({ parsed });
  const created = await prisma.room_requests.create({
    data: {
      // required / direct

      roomId: parsed.roomId,
      requesterId: session?.user?.id ?? "",
      requestNumber,
      title: parsed.title,

      // optional string fields -> default ""
      purpose: parsed.purpose ?? "",
      note: parsed.note ?? "",

      // schedule
      startAt: parsed.startAt,
      endAt: parsed.endAt,

      // borrower (optional strings -> "")
      borrowerName: parsed.borrowerName ?? "",
      borrowerOrganization: parsed.borrowerOrganization ?? "",
      borrowerPhone: parsed.borrowerPhone ?? "",
      borrowerEmail: parsed.borrowerEmail ?? "",

      // location
      isOffsite: parsed.isOffsite ?? false,
      addressLine: parsed.addressLine ?? "",
      district: parsed.district ?? "",
      city: parsed.city ?? "",
      province: parsed.province ?? "",
      postalCode: parsed.postalCode ?? "",

      // logistics
      attendeesCount: parsed.attendeesCount ?? null,
      requireCatering: parsed.requireCatering ?? false,
      requireItSupport: parsed.requireItSupport ?? false,
      equipment: parsed.equipment ?? Prisma.JsonNull,
      additionalRequirements: parsed.additionalRequirements ?? "",

      services: {
        createMany: {
          data: requestDetailData,
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return setResponse(created, "Room request berhasil dibuat", 201);
});
