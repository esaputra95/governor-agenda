"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ReactNode } from "react";

type Item = {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
};

interface CarouselProps {
  children: ReactNode;
  swiperProps?: React.ComponentProps<typeof Swiper>; // ✅ tambahan props
}

export default function Carousel({ swiperProps, children }: CarouselProps) {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        className="!px-2"
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
          1280: { slidesPerView: 2 },
        }}
        // navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        a11y={{ enabled: true }}
        loop={true}
        {...swiperProps} // ✅ merge props tambahan
      >
        {children}
      </Swiper>
    </div>
  );
}
