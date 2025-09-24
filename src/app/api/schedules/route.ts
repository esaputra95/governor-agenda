// src/app/api/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateSchema } from "./type";
import { Prisma } from "@prisma/client";
import { setResponse } from "@/lib/http";
import { wrap } from "@/lib/errorApi";

// ====== Helpers ======
const ALLOWED_SORT: Record<string, true> = {
  name: true,
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

  // filters
  const userId = (sp.get("userId") || "").trim();

  const where: Prisma.schedulesWhereInput = {
    AND: [
      userId
        ? {
            OR: [
              {
                users: {
                  name: {
                    contains: userId,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {},
    ],
  };

  return { page, take, skip, orderBy, where, sortby, sortdir };
}

// ====== GET /api/services ======
export async function GET(req: NextRequest) {
  try {
    const { page, take, skip, orderBy, where, sortby, sortdir } =
      parsePagination(req);

    const [count, services] = await Promise.all([
      prisma.schedules.count({ where }),
      prisma.schedules.findMany({
        select: {
          startAt: true,
          endAt: true,
          description: true,
          userId: true,
          users: true,
          id: true,
        },
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    const totalPage = Math.max(1, Math.ceil(count / take));
    const nextPage = page * take < count ? page + 1 : null;

    return NextResponse.json(
      {
        status: true,
        message: "Data services Berhasil Diambil",
        metaData: {
          page,
          limit: take,
          total: count,
          nextPage,
          totalPage,
          sortby,
          sort: sortdir,
        },
        data: services,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/services error:", err);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data services" },
      { status: 500 }
    );
  }
}

// POST /api/services
export const POST = wrap(async (req: Request) => {
  const body = await req.json();
  const parsed = CreateSchema.parse(body); // ZodError otomatis ditangkap wrap()

  const conflict = await prisma.schedules.findFirst({
    where: {
      userId: parsed.userId,
      AND: [
        { startAt: { lt: parsed.endAt } }, // existing mulai sebelum jadwal baru selesai
        { endAt: { gt: parsed.startAt } }, // existing selesai setelah jadwal baru mulai
      ],
    },
  });

  if (conflict) {
    return setResponse(
      null,
      "User sudah punya jadwal yang bentrok di rentang waktu tersebut",
      400
    );
  }

  const created = await prisma.schedules.create({
    data: { ...parsed },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return setResponse(created, "User berhasil dibuat", 201);
});
