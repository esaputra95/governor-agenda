"use client";

import { useState, useEffect, ReactNode } from "react";
import { SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Module wajib diimport
import Carousel from "@/components/ui/swiper/Carousel";
import {
  FaHome,
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaBuilding,
  FaSitemap,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/dashboard/useDashboard";

// --- TYPES / INTERFACES ---

interface InfoRowProps {
  label: string;
  value?: string | null;
  icon?: ReactNode;
  highlight?: boolean;
}

interface RoomItem {
  id: number | string;
  title?: string;
  name?: string;
  organization?: string;
  room?: string;
  startAt?: string;
  endAt?: string;
}

interface ScheduleItem {
  id: number | string;
  title?: string;
  user?: string;
  role?: string;
  startAt?: string;
  endAt?: string;
}

// --- COMPONENTS ---

const DigitalClock = () => {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => setTime(new Date()), []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="flex flex-col items-end text-slate-800 min-w-[200px]">
      <span className="text-4xl font-bold font-mono tracking-wider leading-none">
        {time.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      <span className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
        {time.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  );
};

const InfoRow = ({ label, value, icon, highlight = false }: InfoRowProps) => (
  <div className="flex flex-row justify-between items-start border-b border-dashed border-slate-200 pb-1.5 last:border-0 last:pb-0">
    <div className="flex items-center gap-2 mt-0.5">
      {icon ? (
        <span className="text-[10px] opacity-60 text-slate-500">{icon}</span>
      ) : (
        <span className="w-3" />
      )}
      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">
        {label}
      </span>
    </div>
    <span
      className={`text-xs md:text-sm font-semibold text-right leading-tight max-w-[65%] truncate ${
        highlight ? "text-emerald-700" : "text-slate-700"
      }`}
    >
      {value || "-"}
    </span>
  </div>
);

// --- MAIN PAGE (LIGHT THEME) ---

export default function Home() {
  const router = useRouter();
  const { data: dashboardData } = useDashboard();

  const roomData: RoomItem[] = dashboardData?.data?.room || [];
  const scheduleData: ScheduleItem[] = dashboardData?.data?.schedule || [];

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col overflow-hidden font-sans select-none text-slate-800">
      {/* 1. HEADER */}
      <header className="flex-none h-[12%] flex items-center justify-between px-6 border-b border-slate-200 bg-white relative z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center shadow-md shadow-yellow-500/30">
            <span className="text-2xl font-black text-white">R</span>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              PUSAT INFORMASI KEGIATAN
            </h1>
            <h2 className="text-sm md:text-base text-slate-500 font-semibold tracking-widest uppercase">
              Kantor Gubernur Provinsi Riau
            </h2>
          </div>
        </div>
        <DigitalClock />
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-0 p-4 gap-4">
        {/* SECTION TOP: ROOM */}
        <section className="flex-1 min-h-0 min-w-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-3 relative">
          <div className="flex items-center gap-2 mb-2 px-1 shrink-0 h-8 border-b border-slate-100 pb-2">
            <div className="p-1.5 bg-emerald-100 rounded-md">
              <FaBuilding className="text-emerald-600 text-xs" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 tracking-tight">
              Jadwal Ruangan
            </h3>
          </div>

          <div className="flex-1 min-h-0 w-full relative pt-1">
            <Carousel
              swiperProps={{
                // PENTING: Daftarkan module Autoplay disini agar jalan otomatis
                modules: [Autoplay],
                slidesPerView: 1,
                spaceBetween: 14,
                breakpoints: {
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1400: { slidesPerView: 4 },
                },
                autoplay: {
                  delay: 4000,
                  disableOnInteraction: false, // Tetap jalan walau disentuh
                  pauseOnMouseEnter: false, // Tetap jalan walau mouse diatasnya
                },
                className: "h-full w-full !pb-4",
              }}
            >
              {roomData.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-sm font-medium">
                    Tidak ada data ruangan
                  </span>
                </div>
              )}
              {roomData.map((it) => (
                <SwiperSlide key={it.id} className="!h-auto">
                  <article className="h-full bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 border-l-[5px] border-l-emerald-500 flex flex-col hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 h-[3.2rem] flex items-center">
                      <h4 className="text-sm text-slate-800 font-bold leading-tight line-clamp-2">
                        {it.title}
                      </h4>
                    </div>
                    <div className="p-3 flex flex-col gap-2 flex-1">
                      <InfoRow
                        label="PIC"
                        value={it?.name}
                        icon={<FaUserTie />}
                      />
                      <InfoRow
                        label="Divisi"
                        value={it?.organization}
                        icon={<FaSitemap />}
                      />
                      <InfoRow
                        label="Lokasi"
                        value={it?.room}
                        icon={<FaMapMarkerAlt className="text-red-500" />}
                        highlight
                      />

                      <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center bg-white -mx-3 px-3 pb-0.5">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase font-bold">
                            Mulai
                          </span>
                          <span className="text-emerald-700 font-mono font-bold text-base">
                            {it?.startAt?.split(" ")[1] || "-"}
                          </span>
                        </div>
                        <div className="text-slate-300 text-xs">-</div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-slate-400 uppercase font-bold">
                            Selesai
                          </span>
                          <span className="text-emerald-700 font-mono font-bold text-base">
                            {it?.endAt?.split(" ")[1] || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Carousel>
          </div>
        </section>

        {/* SECTION BOTTOM: SCHEDULE */}
        <section className="flex-1 min-h-0 min-w-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-3 relative">
          <div className="flex justify-between items-center mb-2 px-1 shrink-0 h-8 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-md">
                <FaUserTie className="text-orange-600 text-xs" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 tracking-tight">
                Agenda Pimpinan
              </h3>
            </div>
            <button
              onClick={() => router.push("/masters")}
              className="p-1.5 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            >
              <FaHome size={12} />
            </button>
          </div>

          <div className="flex-1 min-h-0 w-full relative pt-1">
            <Carousel
              swiperProps={{
                slidesPerView: 1,
                spaceBetween: 14,
                breakpoints: {
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1400: { slidesPerView: 4 },
                },
                autoplay: {
                  delay: 1000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                },
                className: "h-full w-full !pb-4",
              }}
            >
              {scheduleData.length === 0 ? (
                <SwiperSlide className="!h-auto">
                  <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 text-sm font-medium">
                      Tidak ada agenda pimpinan
                    </span>
                  </div>
                </SwiperSlide>
              ) : (
                scheduleData.map((it) => (
                  <SwiperSlide key={it.id} className="!h-auto">
                    <article className="h-full bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 flex flex-col relative hover:shadow-md transition-shadow">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 h-[2.8rem] flex items-center shrink-0">
                        <h4 className="text-white text-sm font-bold line-clamp-1 w-full drop-shadow-sm">
                          {it.title || "Agenda Kegiatan"}
                        </h4>
                      </div>
                      <div className="p-3 flex flex-col gap-1 text-slate-700 flex-1 min-h-0">
                        <div className="flex flex-col border-b border-slate-100 pb-2">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                            Pejabat
                          </span>
                          <span className="font-bold text-sm text-slate-800 line-clamp-1">
                            {it?.user}
                          </span>
                          <span className="text-[10px] text-orange-600 font-semibold line-clamp-1">
                            {it?.role ?? "-"}
                          </span>
                        </div>

                        <div className="mt-auto bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
                          <FaClock className="text-orange-500 text-sm" />
                          <div className="flex flex-col leading-none">
                            <span className="text-slate-400 text-[8px] uppercase mb-0.5 font-bold">
                              Waktu Pelaksanaan
                            </span>
                            <span className="font-mono font-bold text-slate-700 text-sm">
                              {it?.startAt?.split(" ")[1] || "00:00"} -{" "}
                              {it?.endAt?.split(" ")[1] || "00:00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))
              )}
            </Carousel>
          </div>
        </section>
      </main>

      {/* 3. FOOTER MARQUEE */}
      <footer className="flex-none h-[5%] bg-yellow-400 flex items-center relative overflow-hidden z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] border-t border-yellow-500">
        <div className="bg-red-600 h-full flex items-center px-6 absolute left-0 z-20 shadow-lg skew-x-12 -ml-6 min-w-[220px]">
          <span className="text-white font-bold text-xs md:text-sm -skew-x-12 uppercase tracking-wider ml-4">
            Informasi Terkini
          </span>
        </div>

        {/* <div className="w-full h-full flex items-center pl-[230px]">
          <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={50}
            loop={true}
            speed={8000} // Kecepatan gerakan text
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            allowTouchMove={false}
            className="w-full h-full flex items-center"
          >
            {[1, 2, 3, 4].map((i) => (
              <SwiperSlide key={i} className="!w-auto flex items-center h-full">
                <span className="text-slate-900 text-base md:text-lg font-bold whitespace-nowrap uppercase flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span>
                  SELAMAT DATANG DI PUSAT INFORMASI KEGIATAN KANTOR GUBERNUR
                  RIAU
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span>
                  JAGA KEBERSIHAN DAN KETERTIBAN LINGKUNGAN KANTOR
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div> */}
      </footer>
    </div>
  );
}
