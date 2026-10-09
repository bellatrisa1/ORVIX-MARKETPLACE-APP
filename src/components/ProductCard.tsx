'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store';
import type { MarketplaceProduct } from '@/types/api';
import { formatMoney } from '@/lib/money';
import { availableStock } from '@/lib/cart';

export default function ProductCard({
  product,
}: {
  product: MarketplaceProduct;
}) {
  const item = useStore((state) =>
    state.cartItems.find((entry) => entry.id === product.id),
  );
  const favorite = useStore((state) => state.favoriteIds.includes(product.id));
  const ready = useStore((state) => state.hydrated && state.storageReady);
  const { addToCart, increaseCartItem, decreaseCartItem, toggleFavorite } =
    useStore();
  const stock = availableStock(product);
  return (
    <article className="product-card">
      <div className="product-card__badge">
        -{Math.round(product.discountPercentage)}%
      </div>
      <button
        className={`product-card__favorite ${favorite ? 'product-card__favorite--active' : ''}`}
        type="button"
        disabled={!ready}
        aria-pressed={favorite}
        aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        onClick={() => toggleFavorite(product)}
      >
        ♥
      </button>
      <Link
        href={`/product/${product.id}`}
        className="product-card__image-wrap"
        aria-label={`Открыть ${product.title}`}
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="product-card__image"
        />
      </Link>
      <div className="product-card__content">
        <h3 className="product-card__title">
          <Link href={`/product/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="product-card__prices">
          <span className="product-card__price">
            {formatMoney(product.price)}
          </span>
          {product.oldPrice && product.oldPrice > product.price ? (
            <span className="product-card__old-price">
              {formatMoney(product.oldPrice)}
            </span>
          ) : null}
        </div>
        <p className="product-card__meta">В наличии: {stock} шт.</p>
        {!item ? (
          <button
            className="product-card__button"
            type="button"
            disabled={!ready || !stock}
            onClick={() => addToCart(product)}
          >
            {stock ? 'В корзину' : 'Нет в наличии'}
          </button>
        ) : (
          <div className="product-card__controls">
            <button
              className="product-card__control-btn"
              type="button"
              disabled={!ready}
              aria-label={`Уменьшить количество ${product.title}`}
              onClick={() => decreaseCartItem(product.id)}
            >
              −
            </button>
            <span className="product-card__control-count">
              {item.cartQuantity}
            </span>
            <button
              className="product-card__control-btn"
              type="button"
              disabled={!ready || item.cartQuantity >= stock}
              aria-label={`Увеличить количество ${product.title}`}
              onClick={() => increaseCartItem(product.id)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
