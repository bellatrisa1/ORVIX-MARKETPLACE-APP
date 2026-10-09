'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import CategoriesGrid from '@/components/CategoriesGrid';
import { useStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/products';

export default function FavoritesPage() {
  const favoriteIds = useStore((state) => state.favoriteIds);
  const hydrated = useStore((state) => state.hydrated);
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['marketplace-products'],
    queryFn: () => getProducts(),
    enabled: hydrated && favoriteIds.length > 0,
  });
  const products = data.filter((product) => favoriteIds.includes(product.id));
  return (
    <div className="page">
      <TopBar />
      <Header />
      <main className="main">
        <div className="container">
          <div className="favorites-page">
            <div className="favorites-page__top">
              <div>
                <p className="favorites-page__breadcrumbs">
                  <Link href="/">Главная</Link> / Избранное
                </p>
                <h1 className="favorites-page__title">Избранные товары</h1>
                <p className="favorites-page__subtitle">
                  Добавлено товаров: {favoriteIds.length}
                </p>
              </div>
            </div>
            {!hydrated ? (
              <p role="status">Загрузка избранного…</p>
            ) : !favoriteIds.length ? (
              <div className="favorites-empty">
                <div className="favorites-empty__icon">♡</div>
                <h2>У вас пока нет избранных товаров</h2>
                <p>Добавляйте товары в избранное, чтобы не потерять их.</p>
                <Link href="/" className="favorites-empty__link">
                  Перейти к каталогу
                </Link>
              </div>
            ) : (
              <>
                <CategoriesGrid
                  products={products}
                  isLoading={isLoading}
                  isError={isError}
                  onRetry={() => {
                    void refetch();
                  }}
                />
                {!isLoading &&
                  !isError &&
                  products.length < favoriteIds.length && (
                    <p className="demo-note">
                      Некоторые сохранённые товары больше не доступны в
                      источнике.
                    </p>
                  )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
