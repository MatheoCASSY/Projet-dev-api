import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/navigation";
import './CategoryCarousel.css';
import { Link } from 'react-router-dom';

export default function CategoryCarousel({ categories = [], onCategoryClick }) {
  if (!categories || categories.length === 0) return <p className="text-muted">Aucune catégorie.</p>;

  return (
    <Swiper
      spaceBetween={8}
      slidesPerView={'auto'}
      className="my-category-swiper"
    >
      {categories.map((c) => {
        // c can be either a string (legacy) or an object { name, slug }
        const label = typeof c === 'string' ? c : c.name;
        const value = typeof c === 'string' ? c : c.slug;
        return (
          <SwiperSlide key={value} style={{ width: 'auto' }}>
            {onCategoryClick ? (
              <button type="button" className="btn btn-outline-light btn-sm category-pill" onClick={() => onCategoryClick(value)}>
                {label}
              </button>
            ) : (
              <Link to={`/store?genre=${encodeURIComponent(value)}`} className="btn btn-outline-light btn-sm category-pill">
                {label}
              </Link>
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
