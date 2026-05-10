'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useStore } from '@/store';

export default function CartPage() {
  const cartItems = useStore((state) => state.cartItems);
  const increaseCartItem = useStore((state) => state.increaseCartItem);
  const decreaseCartItem = useStore((state) => state.decreaseCartItem);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const totalPrice = useStore((state) => state.getCartTotalPrice());
  const totalCount = useStore((state) => state.getCartItemsCount());

  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="cart-page">
            <div className="cart-page__top">
              <div>
                <p className="cart-page__breadcrumbs">
                  <Link href="/">Главная</Link> / <span>Корзина</span>
                </p>
                <h1 className="cart-page__title">Корзина</h1>
                <p className="cart-page__subtitle">
                  Товаров в корзине: {totalCount}
                </p>
              </div>

              {cartItems.length > 0 ? (
                <button
                  className="cart-page__clear"
                  type="button"
                  onClick={clearCart}
                >
                  Очистить корзину
                </button>
              ) : null}
            </div>

            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty__icon">🛒</div>
                <h2>Ваша корзина пуста</h2>
                <p>Добавьте товары, чтобы оформить заказ.</p>
                <Link className="cart-empty__link" href="/">
                  Перейти к покупкам
                </Link>
              </div>
            ) : (
              <div className="cart-layout">
                <section className="cart-list">
                  {cartItems.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <div className="cart-item__image-wrap">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="cart-item__image"
                        />
                      </div>

                      <div className="cart-item__content">
                        <h3 className="cart-item__title">{item.title}</h3>

                        <div className="cart-item__prices">
                          <span className="cart-item__price">
                            ${item.price.toFixed(2)}
                          </span>

                          {item.oldPrice && item.oldPrice > item.price ? (
                            <span className="cart-item__old-price">
                              ${item.oldPrice.toFixed(2)}
                            </span>
                          ) : null}
                        </div>

                        <div className="cart-item__bottom">
                          <div className="cart-item__controls">
                            <button
                              type="button"
                              className="cart-item__control-btn"
                              onClick={() => decreaseCartItem(item.id)}
                            >
                              −
                            </button>

                            <span className="cart-item__count">
                              {item.cartQuantity}
                            </span>

                            <button
                              type="button"
                              className="cart-item__control-btn"
                              onClick={() => increaseCartItem(item.id)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="cart-item__remove"
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>

                      <div className="cart-item__total">
                        ${(item.price * item.cartQuantity).toFixed(2)}
                      </div>
                    </article>
                  ))}
                </section>

                <aside className="cart-summary">
                  <h2 className="cart-summary__title">Ваш заказ</h2>

                  <div className="cart-summary__row">
                    <span>Товаров</span>
                    <span>{totalCount}</span>
                  </div>

                  <div className="cart-summary__row">
                    <span>Доставка</span>
                    <span>Бесплатно</span>
                  </div>

                  <div className="cart-summary__row cart-summary__row--total">
                    <span>Итого</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="cart-summary__button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Оформить заказ
                  </Link>

                  <p className="cart-summary__note">
                    Это демо-корзина. Заказ не отправляется на сервер.
                  </p>
                </aside>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
