'use client';

import Link from 'next/link';
import type { RefObject } from 'react';

interface CatalogMenuProps {
  isOpen: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  menuRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

const catalogData: Record<
  string,
  { slug: string; items: { label: string; slug: string }[] }
> = {
  Электроника: {
    slug: 'smartphones',
    items: [
      { label: 'Смартфоны', slug: 'smartphones' },
      { label: 'Ноутбуки', slug: 'laptops' },
      { label: 'Планшеты', slug: 'tablets' },
      { label: 'Аксессуары', slug: 'mobile-accessories' },
    ],
  },
  'Одежда и обувь': {
    slug: 'mens-shirts',
    items: [
      { label: 'Мужские рубашки', slug: 'mens-shirts' },
      { label: 'Женские платья', slug: 'womens-dresses' },
      { label: 'Женские сумки', slug: 'womens-bags' },
      { label: 'Женская обувь', slug: 'womens-shoes' },
      { label: 'Мужская обувь', slug: 'mens-shoes' },
      { label: 'Украшения', slug: 'womens-jewellery' },
      { label: 'Очки', slug: 'sunglasses' },
      { label: 'Топы', slug: 'tops' },
    ],
  },
  'Дом и интерьер': {
    slug: 'furniture',
    items: [
      { label: 'Мебель', slug: 'furniture' },
      { label: 'Декор', slug: 'home-decoration' },
      { label: 'Кухонные аксессуары', slug: 'kitchen-accessories' },
    ],
  },
  Красота: {
    slug: 'beauty',
    items: [
      { label: 'Beauty', slug: 'beauty' },
      { label: 'Fragrances', slug: 'fragrances' },
      { label: 'Skin Care', slug: 'skin-care' },
    ],
  },
  Продукты: {
    slug: 'groceries',
    items: [{ label: 'Groceries', slug: 'groceries' }],
  },
  'Спорт и авто': {
    slug: 'sports-accessories',
    items: [
      { label: 'Спортивные аксессуары', slug: 'sports-accessories' },
      { label: 'Транспорт', slug: 'vehicle' },
    ],
  },
};

export default function CatalogMenu({
  isOpen,
  activeCategory,
  onCategoryChange,
  menuRef,
  onClose,
}: CatalogMenuProps) {
  if (!isOpen) return null;

  const categories = Object.keys(catalogData);
  const active = catalogData[activeCategory];

  return (
    <div
      className="catalog-menu"
      id="catalog-menu"
      ref={menuRef}
      role="dialog"
      aria-label="Каталог и навигация"
      tabIndex={-1}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a')) onClose();
      }}
    >
      <div className="catalog-menu__mobile-nav">
        <nav aria-label="Навигация по сайту">
          <Link href="/">Главная</Link>
          <Link href="/ideas">Идеи</Link>
          <Link href="/sales">Скидки</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/mobile">Мобильное приложение</Link>
          <Link href="/support">Поддержка</Link>
          <Link href="/gift-cards">Подарочные карты</Link>
          <Link href="/business">Для бизнеса</Link>
        </nav>
      </div>
      <button
        className="catalog-menu__close"
        type="button"
        aria-label="Закрыть каталог"
        onClick={onClose}
      >
        ✕
      </button>
      <div className="catalog-menu__sidebar">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`catalog-menu__category ${
              activeCategory === category
                ? 'catalog-menu__category--active'
                : ''
            }`}
            aria-pressed={activeCategory === category}
            onMouseEnter={() => onCategoryChange(category)}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="catalog-menu__content">
        <div className="catalog-menu__heading">
          <h3 className="catalog-menu__title">{activeCategory}</h3>

          <Link
            href={`/category/${active.slug}`}
            className="catalog-menu__all-link"
          >
            Смотреть всё
          </Link>
        </div>

        <div className="catalog-menu__grid">
          {active.items.map((item) => (
            <Link
              key={`${item.slug}-${item.label}`}
              href={`/category/${item.slug}`}
              className="catalog-menu__link"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
