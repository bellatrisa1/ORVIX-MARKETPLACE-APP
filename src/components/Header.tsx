'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';
import CatalogMenu from './CatalogMenu';
import { useDialogFocus } from '@/hooks/useDialogFocus';

export default function Header() {
  const cartItemsCount = useStore((state) =>
    state.cartItems.reduce((count, item) => count + item.cartQuantity, 0),
  );
  const favoriteItems = useStore((state) => state.favoriteIds);

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Электроника');

  const closeCatalog = useCallback(() => setIsCatalogOpen(false), []);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useDialogFocus(isCatalogOpen, menuRef, closeCatalog);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsCatalogOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="container header__wrapper" ref={headerRef}>
        <div className="header__inner">
          <Link className="logo" href="/">
            <Image
              src="/ORVIX-LOGO.png"
              alt="Orvix"
              width={220}
              height={80}
              priority
              className="logo__image"
            />
          </Link>

          <button
            className={`catalog-btn ${isCatalogOpen ? 'catalog-btn--active' : ''}`}
            type="button"
            aria-expanded={isCatalogOpen}
            aria-controls="catalog-menu"
            aria-haspopup="dialog"
            onClick={() => setIsCatalogOpen((prev) => !prev)}
          >
            <span className="catalog-btn__burger">
              <span />
              <span />
              <span />
            </span>
            <span>Каталог</span>
          </button>

          <nav className="header__nav">
            <Link href="/">Главная</Link>
            <Link href="/ideas">Идеи</Link>
            <Link href="/sales">Скидки</Link>
            <Link href="/services">Услуги</Link>
          </nav>

          <div className="header__actions">
            <Link className="action-btn" href="/favorites">
              <span className="action-btn__icon">♡</span>
              <span className="action-btn__text">Избранное</span>
              <span className="badge">{favoriteItems.length}</span>
            </Link>

            <Link className="action-btn" href="/profile">
              <span className="action-btn__icon">◯</span>
              <span className="action-btn__text">Профиль</span>
            </Link>

            <Link className="action-btn" href="/cart">
              <span className="action-btn__icon">🛒</span>
              <span className="action-btn__text">Корзина</span>
              <span className="badge">{cartItemsCount}</span>
            </Link>
          </div>
        </div>

        <CatalogMenu
          isOpen={isCatalogOpen}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          menuRef={menuRef}
          onClose={closeCatalog}
        />
      </div>
    </header>
  );
}
