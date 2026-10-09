'use client';

import { Suspense, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { validateContacts } from '@/lib/checkout';
import { formatMoney } from '@/lib/money';
import { cartTotal } from '@/lib/cart';
import type { CheckoutDetails, DemoOrder } from '@/types/order';
import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useStore } from '@/store';

type Step = 'address' | 'delivery' | 'payment' | 'confirm';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="products-state">Загрузка оформления…</p>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const cartItems = useStore((state) => state.cartItems);
  const totalPrice = useStore((state) => cartTotal(state.cartItems));
  const placeDemoOrder = useStore((state) => state.placeDemoOrder);
  const orders = useStore((state) => state.orders);
  const hydrated = useStore((state) => state.hydrated);
  const ready = useStore((state) => state.hydrated && state.storageReady);
  const city = useStore((state) => state.city);
  const searchParams = useSearchParams();
  const submitting = useRef(false);
  const completedAt = useRef(0);
  const requestId = useRef<string | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [savedOrder, setSavedOrder] = useState<DemoOrder | null>(null);

  const [step, setStep] = useState<Step>('address');
  const orderComplete =
    savedOrder ??
    orders.find((order) => order.id === searchParams.get('order'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [delivery, setDelivery] =
    useState<CheckoutDetails['delivery']>('courier');
  const [payment, setPayment] = useState<CheckoutDetails['payment']>('card');
  const [comment, setComment] = useState('');

  const details: CheckoutDetails = {
    name,
    email,
    phone,
    city,
    address,
    apartment,
    delivery,
    payment,
    comment,
  };
  const confirmOrder = () => {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      requestId.current ??= `demo-${crypto.randomUUID()}`;
      const order = placeDemoOrder(requestId.current, details);
      completedAt.current = performance.now();
      // URL обновляется синхронно: даже немедленная перезагрузка открывает сохранённый результат.
      window.history.replaceState(
        null,
        '',
        `/checkout?order=${encodeURIComponent(order.id)}`,
      );
      setSavedOrder(order);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Не удалось сохранить демозаказ.',
      );
      submitting.current = false;
      setPending(false);
    }
  };

  if (!hydrated)
    return (
      <div className="page">
        <TopBar />
        <Header />
        <main className="main">
          <p className="products-state" role="status">
            Загрузка оформления…
          </p>
        </main>
        <Footer />
      </div>
    );

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
      <div
        className="page"
        onClickCapture={(event) => {
          // После смены высоты страницы второй клик может попасть в ссылку под прежней кнопкой.
          if (
            event.detail > 1 &&
            performance.now() - completedAt.current < 500
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <TopBar />
        <Header />
        <main className="main">
          <div className="container">
            <div className="checkout-success">
              <span className="checkout-success__icon">✅</span>
              <h1>Демозаказ сохранён!</h1>
              <p>
                Номер заказа:{' '}
                <strong data-testid="saved-order-id">{orderComplete.id}</strong>
              </p>
              <p>
                Это демонстрационный заказ. Деньги не списываются, письмо не
                отправляется и доставка не выполняется.
              </p>
              <p className="checkout-success__delivery">
                Заказ сохранён в этом браузере. Сумма:{' '}
                {formatMoney(orderComplete.total)}
              </p>
              <Link href="/profile" className="checkout-success__link">
                История демозаказов
              </Link>
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
            <p className="demo-note">
              Демонстрационное оформление: деньги не списываются, доставка не
              выполняется. Контакты сохраняются только в этом браузере.
              Используйте вымышленные данные; реквизиты карты не нужны.
            </p>
            {error && (
              <p className="auth__error" role="alert">
                {error}
              </p>
            )}

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

                <form
                  className="checkout__form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const error = validateContacts(details);
                    setError(error ?? '');
                    if (!error) setStep('delivery');
                  }}
                >
                  <label className="checkout__label">
                    Имя
                    <input
                      className="checkout__input"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      maxLength={100}
                      autoComplete="name"
                    />
                  </label>
                  <label className="checkout__label">
                    Email
                    <input
                      className="checkout__input"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      maxLength={254}
                      autoComplete="email"
                    />
                  </label>
                  <label className="checkout__label">
                    Телефон
                    <input
                      className="checkout__input"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                      maxLength={30}
                      autoComplete="tel"
                    />
                  </label>
                  <label className="checkout__label">
                    Город
                    <input
                      className="checkout__input"
                      type="text"
                      value={city}
                      disabled
                    />
                  </label>

                  <label className="checkout__label">
                    Адрес
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="Улица, дом"
                      required
                      minLength={5}
                      maxLength={300}
                      autoComplete="street-address"
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
                      maxLength={50}
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                    />
                  </label>

                  <button
                    className="checkout__btn"
                    type="submit"
                    disabled={!ready}
                  >
                    Далее
                  </button>
                </form>
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
                      onChange={(e) => {
                        const next = e.target
                          .value as CheckoutDetails['delivery'];
                        setDelivery(next);
                        if (next === 'pickup') setPayment('card');
                      }}
                    />
                    <div>
                      <strong>🚚 Курьером</strong>
                      <p>Демонстрационный способ: без реальной доставки</p>
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
                      onChange={(e) => {
                        const next = e.target
                          .value as CheckoutDetails['delivery'];
                        setDelivery(next);
                        if (next === 'pickup') setPayment('card');
                      }}
                    />
                    <div>
                      <strong>📦 Пункт выдачи</strong>
                      <p>
                        Демонстрационный вариант: выбор реального ПВЗ
                        отсутствует
                      </p>
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
                      onChange={(e) =>
                        setPayment(e.target.value as CheckoutDetails['payment'])
                      }
                    />
                    <div>
                      <strong>💳 Банковской картой</strong>
                      <p>Демонстрационный выбор, без списания денег</p>
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
                      disabled={delivery === 'pickup'}
                      onChange={(e) =>
                        setPayment(e.target.value as CheckoutDetails['payment'])
                      }
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
                      {city}, {address}
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
                          {formatMoney(item.price * item.cartQuantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout__summary-total">
                    <span>Сумма демозаказа:</span>
                    <strong>{formatMoney(totalPrice)}</strong>
                  </div>
                </div>

                <label className="checkout__label">
                  Комментарий к заказу (необязательно)
                  <textarea
                    className="checkout__textarea"
                    placeholder="Домофон, этаж, пожелания..."
                    maxLength={500}
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
                    disabled={!ready || pending}
                    onClick={confirmOrder}
                  >
                    {pending ? 'Сохранение…' : 'Подтвердить демозаказ'}
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
