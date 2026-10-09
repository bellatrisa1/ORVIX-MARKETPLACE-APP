'use client';

import type { MarketplaceProduct } from '@/types/api';
import ProductCard from './ProductCard';

interface CategoriesGridProps {
  products: MarketplaceProduct[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

export default function CategoriesGrid({
  products,
  isLoading,
  isError,
  onRetry,
}: CategoriesGridProps) {
  if (isLoading)
    return (
      <section
        className="products-grid"
        aria-label="Загрузка товаров"
        aria-busy="true"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="product-card product-card--skeleton" key={index}>
            <div className="product-card__image-wrap skeleton" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-price" />
          </div>
        ))}
      </section>
    );
  if (isError)
    return (
      <div className="products-state" role="alert">
        Не удалось загрузить товары.{' '}
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Повторить
          </button>
        )}
      </div>
    );
  if (!products.length)
    return (
      <p className="products-state" role="status">
        По вашему запросу ничего не найдено.
      </p>
    );
  return (
    <section className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
