'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useStore } from '@/store';

type Step = 'address' | 'delivery' | 'payment' | 'confirm';

export default function CheckoutPage() {
  const cartItems = useStore((state) => state.cartItems);
  const totalPrice = useStore((state) => state.getCartTotalPrice());
  const clearCart = useStore((state) => state.clearCart);
  const user = useStore((state) => state.user);

  const [step, setStep] = useState<Step>('address');
  const [orderComplete, setOrderComplete] = useState(false);

  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [delivery, setDelivery] = useState('courier');
  const [payment, setPayment] = useState('card');
  const [comment, setComment] = useState('');

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="page">
        <TopBar />
        <Header />
        <main className="main">
          <div className="container">
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <h2>Корзина пуста</h2>
              <p>Добавьте товары перед оформлением заказа.</p>
              <Link className="cart-empty__link" href="/">
                Перейти к покупкам
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="page">
        <TopBar />
        <Header />
        <main className="main">
          <div className="container">
            <div className="checkout-success">
              <span className="checkout-success__icon">✅</span>
              <h1>Заказ оформлен!</h1>
              <p>
                Номер заказа:{' '}
                <strong>ord-{Date.now().toString().slice(-6)}</strong>
              </p>
              <p>
                Мы отправили детали заказа на {user?.email || 'вашу почту'}.
              </p>
              <p className="checkout-success__delivery">
                Ожидайте доставку{' '}
                {delivery === 'courier' ? 'курьером' : 'в пункт выдачи'} в
                течение 1–3 дней.
              </p>
              <Link href="/" className="checkout-success__link">
                Вернуться на главную
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Адрес' },
    { key: 'delivery', label: 'Доставка' },
    { key: 'payment', label: 'Оплата' },
    { key: 'confirm', label: 'Подтверждение' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="checkout">
            <h1 className="checkout__title">Оформление заказа</h1>

            {/* Степпер */}
            <div className="stepper">
              {steps.map((s, index) => (
                <div
                  key={s.key}
                  className={`stepper__step ${
                    index < currentIndex
                      ? 'stepper__step--done'
                      : index === currentIndex
                        ? 'stepper__step--active'
                        : ''
                  }`}
                >
                  <div className="stepper__circle">
                    {index < currentIndex ? '✓' : index + 1}
                  </div>
                  <span className="stepper__label">{s.label}</span>
                  {index < steps.length - 1 && (
                    <div
                      className={`stepper__line ${
                        index < currentIndex ? 'stepper__line--done' : ''
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Шаг 1: Адрес */}
            {step === 'address' && (
              <div className="checkout__step">
                <h2>Адрес доставки</h2>

                <div className="checkout__form">
                  <label className="checkout__label">
                    Город
                    <input
                      className="checkout__input"
                      type="text"
                      value={user?.city || 'Санкт-Петербург'}
                      disabled
                    />
                  </label>

                  <label className="checkout__label">
                    Адрес
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="Улица, дом"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </label>

                  <label className="checkout__label">
                    Квартира / офис
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="Кв. 42"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                    />
                  </label>

                  <button
                    className="checkout__btn"
                    onClick={() => setStep('delivery')}
                    disabled={!address.trim()}
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 2: Доставка */}
            {step === 'delivery' && (
              <div className="checkout__step">
                <h2>Способ доставки</h2>

                <div className="checkout__options">
                  <label
                    className={`checkout__option ${
                      delivery === 'courier' ? 'checkout__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="courier"
                      checked={delivery === 'courier'}
                      onChange={(e) => setDelivery(e.target.value)}
                    />
                    <div>
                      <strong>🚚 Курьером</strong>
                      <p>Доставка до двери, 1–3 дня</p>
                      <span>Бесплатно</span>
                    </div>
                  </label>

                  <label
                    className={`checkout__option ${
                      delivery === 'pickup' ? 'checkout__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={delivery === 'pickup'}
                      onChange={(e) => setDelivery(e.target.value)}
                    />
                    <div>
                      <strong>📦 Пункт выдачи</strong>
                      <p>Забрать самостоятельно, 1–3 дня</p>
                      <span>Бесплатно</span>
                    </div>
                  </label>
                </div>

                <div className="checkout__nav">
                  <button
                    className="checkout__btn checkout__btn--outline"
                    onClick={() => setStep('address')}
                  >
                    Назад
                  </button>
                  <button
                    className="checkout__btn"
                    onClick={() => setStep('payment')}
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 3: Оплата */}
            {step === 'payment' && (
              <div className="checkout__step">
                <h2>Способ оплаты</h2>

                <div className="checkout__options">
                  <label
                    className={`checkout__option ${
                      payment === 'card' ? 'checkout__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={payment === 'card'}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <div>
                      <strong>💳 Банковской картой</strong>
                      <p>Visa, Mastercard, Мир</p>
                    </div>
                  </label>

                  <label
                    className={`checkout__option ${
                      payment === 'cash' ? 'checkout__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={payment === 'cash'}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <div>
                      <strong>💵 Наличными при получении</strong>
                      <p>Только для курьерской доставки</p>
                    </div>
                  </label>
                </div>

                <div className="checkout__nav">
                  <button
                    className="checkout__btn checkout__btn--outline"
                    onClick={() => setStep('delivery')}
                  >
                    Назад
                  </button>
                  <button
                    className="checkout__btn"
                    onClick={() => setStep('confirm')}
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 4: Подтверждение */}
            {step === 'confirm' && (
              <div className="checkout__step">
                <h2>Подтверждение заказа</h2>

                <div className="checkout__summary">
                  <div className="checkout__summary-block">
                    <strong>📍 Адрес:</strong>
                    <p>
                      {user?.city || 'Санкт-Петербург'}, {address}
                      {apartment ? `, кв. ${apartment}` : ''}
                    </p>
                  </div>

                  <div className="checkout__summary-block">
                    <strong>
                      {delivery === 'courier'
                        ? '🚚 Курьером'
                        : '📦 Пункт выдачи'}
                    </strong>
                    <p>Бесплатно</p>
                  </div>

                  <div className="checkout__summary-block">
                    <strong>
                      {payment === 'card' ? '💳 Картой' : '💵 Наличными'}
                    </strong>
                  </div>

                  <div className="checkout__summary-items">
                    <strong>🛒 Товары ({cartItems.length}):</strong>
                    {cartItems.map((item) => (
                      <div key={item.id} className="checkout__summary-item">
                        <span>{item.title}</span>
                        <span>x{item.cartQuantity}</span>
                        <span>
                          ${(item.price * item.cartQuantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout__summary-total">
                    <span>Итого к оплате:</span>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                </div>

                <label className="checkout__label">
                  Комментарий к заказу (необязательно)
                  <textarea
                    className="checkout__textarea"
                    placeholder="Домофон, этаж, пожелания..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </label>

                <div className="checkout__nav">
                  <button
                    className="checkout__btn checkout__btn--outline"
                    onClick={() => setStep('payment')}
                  >
                    Назад
                  </button>
                  <button
                    className="checkout__btn"
                    onClick={() => {
                      clearCart();
                      setOrderComplete(true);
                    }}
                  >
                    Подтвердить заказ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
