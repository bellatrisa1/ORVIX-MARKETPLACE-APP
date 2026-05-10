'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import CityModal from './CityModal';

export default function TopBar() {
  const [isCityOpen, setIsCityOpen] = useState(false);
  const city = useStore((state) => state.user?.city || 'Санкт-Петербург');

  return (
    <>
      <header className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__left">
            <button
              className="city-btn"
              type="button"
              onClick={() => setIsCityOpen(true)}
            >
              <span className="icon">📍</span>
              <span>{city}</span>
              <span className="chevron">⌄</span>
            </button>
          </div>

          <nav className="topbar__nav">
            <Link href="/mobile">Мобильное приложение</Link>
            <Link href="/support">Поддержка</Link>
            <Link href="/gift-cards">Подарочные карты</Link>
            <Link href="/business">Для бизнеса</Link>
          </nav>

          <div className="topbar__right">
            <a className="phone-link" href="tel:+78125558972">
              +7 812 555-89-72
            </a>
          </div>
        </div>
      </header>

      <CityModal isOpen={isCityOpen} onClose={() => setIsCityOpen(false)} />
    </>
  );
}
