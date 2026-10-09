'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const slides = [
  {
    title: 'Большая распродажа',
    caption: 'до',
    value: '-70%',
    href: '#catalog-products',
    label: 'Смотреть предложения',
  },
  {
    title: 'Электроника',
    caption: 'для',
    value: 'вас',
    href: '/category/smartphones',
    label: 'Смотреть смартфоны',
  },
  {
    title: 'Дом и интерьер',
    caption: 'ваш',
    value: 'уют',
    href: '/category/furniture',
    label: 'Смотреть мебель',
  },
  {
    title: 'Красота',
    caption: 'новый',
    value: 'образ',
    href: '/category/beauty',
    label: 'Смотреть товары',
  },
];

export default function Hero({ onOffers }: { onOffers: () => void }) {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  return (
    <section
      className="hero"
      aria-roledescription="карусель"
      aria-label="Подборки товаров"
    >
      <button
        className="hero__arrow hero__arrow--left"
        type="button"
        aria-label="Предыдущий слайд"
        onClick={() => setActive((active + slides.length - 1) % slides.length)}
      >
        ‹
      </button>
      <div className="hero__content">
        <div className="hero__text">
          <div className="hero__brand">
            <Image
              src="/ORVIX-LOGO.png"
              alt="Orvix"
              width={260}
              height={100}
              priority
              className="hero__brand-image"
            />
          </div>
          <p className="hero__subtitle" aria-live="polite">
            {slide.title}
          </p>
          <div className="hero__discount">
            <span>{slide.caption}</span>
            <strong>{slide.value}</strong>
          </div>
          <Link
            href={slide.href}
            className="hero__cta"
            onClick={() => {
              if (active === 0) onOffers();
            }}
          >
            {slide.label}
          </Link>
        </div>
        <div className="hero__visual">
          <div className="hero-card hero-card--phone" />
          <div className="hero-card hero-card--watch" />
          <div className="hero-card hero-card--headphones" />
          <div className="hero-card hero-card--gamepad" />
        </div>
      </div>
      <div className="hero__dots">
        {slides.map((item, index) => (
          <button
            key={item.href}
            type="button"
            className={`hero__dot ${active === index ? 'hero__dot--active' : ''}`}
            aria-label={`Слайд ${index + 1}`}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
      <button
        className="hero__arrow hero__arrow--right"
        type="button"
        aria-label="Следующий слайд"
        onClick={() => setActive((active + 1) % slides.length)}
      >
        ›
      </button>
    </section>
  );
}
