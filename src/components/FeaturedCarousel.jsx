import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import GameCard from './GameCard';

export default function FeaturedCarousel({ games = [] }) {
  if (!games || games.length === 0) return <p className="text-muted">Aucun jeu en vedette.</p>;

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
      }}
      navigation
      pagination={{ clickable: true }}
    >
      {games.map((g) => (
        <SwiperSlide key={g.id}>
          <div style={{ padding: 8 }}>
            <GameCard game={g} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
