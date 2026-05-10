'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useStore } from '@/store';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/products';

export default function FavoritesPage() {
  const favoriteIds = useStore((state) => state.favoriteIds);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const cartItems = useStore((state) => state.cartItems);
  const addToCart = useStore((state) => state.addToCart);

  const { data: products = [] } = useQuery({
    queryKey: ['marketplace-products'],
    queryFn: getProducts,
  });

  const favorites = products.filter((p) => favoriteIds.includes(p.id));

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
                  <Link href="/">Главная</Link> / <span>Избранное</span>
                </p>

                <h1 className="favorites-page__title">Избранные товары</h1>

                <p className="favorites-page__subtitle">
                  Добавлено товаров: {favoriteIds.length}
                </p>
              </div>
            </div>

            {favoriteIds.length === 0 ? (
              <div className="favorites-empty">
                <div className="favorites-empty__icon">♡</div>

                <h2>У вас пока нет избранных товаров</h2>

                <p>Добавляйте товары в избранное, чтобы не потерять их.</p>

                <Link href="/" className="favorites-empty__link">
                  Перейти к каталогу
                </Link>
              </div>
            ) : (
              <section className="products-grid">
                {favorites.map((product) => {
                  const inCart = cartItems.find((i) => i.id === product.id);

                  return (
                    <article className="product-card" key={product.id}>
                      <button
                        className="product-card__favorite product-card__favorite--active"
                        onClick={() => toggleFavorite(product)}
                      >
                        ♥
                      </button>

                      <div className="product-card__image-wrap">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="product-card__image"
                        />
                      </div>

                      <div className="product-card__content">
                        <h3 className="product-card__title">{product.title}</h3>

                        <div className="product-card__prices">
                          <span className="product-card__price">
                            ${product.price}
                          </span>
                        </div>

                        {!inCart ? (
                          <button
                            className="product-card__button"
                            onClick={() => addToCart(product)}
                          >
                            В корзину
                          </button>
                        ) : (
                          <div className="product-card__controls">
                            <span className="product-card__control-count">
                              В корзине
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
