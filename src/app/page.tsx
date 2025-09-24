"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Carousel from "@/components/ui/swiper/Carousel";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/dashboard/useDashboard";

const data = [
  {
    id: 1,
    title: "Menghadiri Rapat dengan Bupati ABC",
    description: "",
    startAt: "25-10-2025 08:30",
    endAt: "25-10-2025 10:30",
    name: "Eko Saputra",
    role: "Gubernur",
    image: "/images/a.jpg",
  },

  {
    id: 2,
    title: "Menghadiri Rapat dengan Bupati ABC",
    description: "",
    startAt: "25-10-2025 08:30",
    endAt: "25-10-2025 10:30",
    name: "Eko Saputra",
    role: "Gubernur",
    image: "/images/a.jpg",
  },

  {
    id: 3,
    title: "Menghadiri Rapat dengan Bupati ABC",
    description: "",
    startAt: "25-10-2025 08:30",
    endAt: "25-10-2025 10:30",
    name: "Eko Saputra",
    role: "Gubernur",
    image: "/images/a.jpg",
  },

  {
    id: 4,
    title: "Menghadiri Rapat dengan Bupati ABC",
    description: "",
    startAt: "25-10-2025 08:30",
    endAt: "25-10-2025 10:30",
    name: "Eko Saputra",
    role: "Gubernur",
    image: "/images/a.jpg",
  },
  {
    id: 5,
    title: "Menghadiri Rapat dengan Bupati ABC",
    description: "",
    startAt: "25-10-2025 08:30",
    endAt: "25-10-2025 10:30",
    name: "Eko Saputra",
    role: "Gubernur",
    image: "/images/a.jpg",
  },
  {
    id: 6,
    title: "Menghadiri Rapat dengan Bupati ABC",
    description: "",
    startAt: "25-10-2025 08:30",
    endAt: "25-10-2025 10:30",
    name: "Eko Saputra",
    role: "Gubernur",
    image: "/images/a.jpg",
  },
];

export default function Home() {
  const router = useRouter();
  const { data } = useDashboard();
  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <div className="w-full h-screen bg-black">
      <div className="grid grid-cols-2 h-6/12 border-b border-gray-400">
        <div className="w-full  flex items-center justify-center p-10">
          <label className="text-5xl font-extrabold text-cyan-500 leading-snug">
            PUSAT INFORMASI KEGIATAN KANTOR GUBERNUR PROVINSI RIAU
          </label>
        </div>

        <div className="w-full rounded-r-md h-full flex flex-col items-center justify-center">
          <Carousel swiperProps={{ autoplay: { delay: 4000 } }}>
            {data?.data?.room?.length === 0 && (
              <div className="w-full h-64 border border-gray-500 rounded-2xl flex items-center justify-center">
                <label className="text-gray-500">
                  Tidak ada data ruangan hari ini
                </label>
              </div>
            )}
            {data?.data?.room?.map((it) => (
              <SwiperSlide key={it.id}>
                <article className="rounded-2xl border border-gray-200 dark:border-white shadow-sm bg-white h-64 space-y-2 ">
                  <div className="bg-green-700 p-4 rounded-t-2xl">
                    <label className="text-xl text-white font-semibold">
                      {it.title}
                    </label>
                  </div>
                  <div className="px-4 flex flex-col space-y-2">
                    <div className="w-full flex flex-row justify-between">
                      <label className="text-gray-600 font-mono">
                        Nama PIC:
                      </label>
                      <label className="text-gray-600 font-mono">
                        {it?.name}
                      </label>
                    </div>
                    <div className="w-full flex flex-row justify-between">
                      <label className="text-gray-600 font-mono">
                        Organisasi:
                      </label>
                      <label className="text-gray-600 font-mono">
                        {it?.organization}
                      </label>
                    </div>
                    <div className="w-full flex flex-row justify-between">
                      <label className="text-gray-600 font-mono">Lokasi:</label>
                      <label className="text-gray-600 font-mono">
                        {it?.room}
                      </label>
                    </div>
                    <div className="w-full flex flex-row justify-between">
                      <label className="text-gray-600 font-mono">Mulai:</label>
                      <label className="text-gray-600 font-mono">
                        {it?.startAt}
                      </label>
                    </div>
                    <div className="w-full flex flex-row justify-between">
                      <label className="text-gray-600 font-mono">
                        Selesai:
                      </label>
                      <label className="text-gray-600 font-mono">
                        {it?.endAt}
                      </label>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Carousel>
          <div className="py-1 my-2 w-full bg-green-700 rounded-full flex justify-center items-center">
            <label className="text-white text-center">
              Informasi Peminjaman Ruangan
            </label>
          </div>
        </div>
      </div>
      <div className=" pt-8 h-6/12">
        <Carousel
          swiperProps={{
            breakpoints: {
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            },
            autoplay: {
              delay: 5000,
            },
          }}
        >
          {data?.data?.schedule?.length === 0 && (
            <div className="w-full h-64 border border-gray-500 rounded-2xl flex items-center justify-center">
              <label className="text-gray-500">
                Tidak ada data jadwal hari ini
              </label>
            </div>
          )}
          {data?.data?.schedule?.map((it) => (
            <SwiperSlide key={it.id}>
              <article className="rounded-2xl border border-gray-200 dark:border-white shadow-sm bg-white h-64 space-y-2 ">
                <div className="bg-orange-400 p-4 rounded-t-2xl">
                  <label className="text-xl text-white font-semibold">
                    {it.title}
                  </label>
                </div>
                <div className="px-4 flex flex-col space-y-2">
                  <div className="w-full flex flex-row justify-between">
                    <label className="text-gray-600 font-mono">Nama:</label>
                    <label className="text-gray-600 font-mono">
                      {it?.user}
                    </label>
                  </div>
                  <div className="w-full flex flex-row justify-between">
                    <label className="text-gray-600 font-mono">Jabatan:</label>
                    <label className="text-gray-600 font-mono">
                      {it?.role ?? "-"}
                    </label>
                  </div>
                  <div className="w-full flex flex-row justify-between">
                    <label className="text-gray-600 font-mono">Mulai:</label>
                    <label className="text-gray-600 font-mono">
                      {it?.startAt ?? "-"}
                    </label>
                  </div>
                  <div className="w-full flex flex-row justify-between">
                    <label className="text-gray-600 font-mono">Selesai:</label>
                    <label className="text-gray-600 font-mono">
                      {it?.endAt ?? "-"}
                    </label>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Carousel>
        <div className="py-1 my-2 w-full bg-orange-400 rounded-full flex justify-center items-center">
          <label className="text-white text-center">
            Informasi Jadwal Gubernur dan staff
          </label>
        </div>
        <div className="w-full px-4 py-4 flex justify-end">
          <FaHome
            onClick={() => router.push("/masters")}
            className="text-white hover:cursor-pointer"
          />
        </div>
      </div>
      {/* <div className="absolute bottom-0 w-screen">
        <div className="w-full bg-yellow-400 py-3">
          <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={50}
            loop={true}
            loopAdditionalSlides={4} // buffer biar mulus
            allowTouchMove={false}
            speed={14000} // atur kecepatan stabil
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            className="marquee-swiper"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SwiperSlide key={i} className="!w-auto">
                <span className="text-red-500 text-4xl font-bold whitespace-nowrap">
                  SELAMAT DATANG PUSAT INFORMASI KEGIATAN KANTOR GUBERNUR RIAU
                  TAHUN 2025
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div> */}
    </div>
    // </div>
  );
}
