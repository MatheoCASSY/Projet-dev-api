import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/navigation";
import './CategoryCarousel.css';
import { Link } from 'react-router-dom';

export default function CategoryCarousel({ categories = [] }) {
  if (!categories || categories.length === 0) return <p className="text-muted">Aucune catégorie.</p>;

  return (
    <Swiper
      spaceBetween={8}
      slidesPerView={'auto'}
      className="my-category-swiper"
    >
      {categories.map((c) => (
        <SwiperSlide key={c} style={{ width: 'auto' }}>
          <Link to={`/store?genre=${encodeURIComponent(c)}`} className="btn btn-outline-light btn-sm category-pill">
            {c}
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
