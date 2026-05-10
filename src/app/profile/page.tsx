'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useStore } from '@/store';

export default function ProfilePage() {
  const { user, isLoggedIn, login, logout } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    const success = login({ email, password });
    if (!success) {
      setError(
        'Неверный email или пароль. Попробуйте demo@orvix.com / demo123'
      );
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
  };

  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          {isLoggedIn && user ? (
            <div className="profile">
              <h1 className="profile__title">Личный кабинет</h1>

              <div className="profile__card">
                <div className="profile__avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="profile__info">
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                  <p>Город: {user.city}</p>
                </div>

                <button className="profile__logout" onClick={handleLogout}>
                  Выйти
                </button>
              </div>

              <div className="profile__orders">
                <h3 className="profile__orders-title">Мои заказы</h3>

                {user.orders.length === 0 ? (
                  <div className="profile__empty">
                    <p>У вас пока нет заказов</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {user.orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-card__head">
                          <span className="order-card__id">
                            Заказ #{order.id}
                          </span>
                          <span
                            className={`order-card__status order-card__status--${order.status === 'Доставлен' ? 'done' : 'process'}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <p className="order-card__date">{order.date}</p>

                        <div className="order-card__items">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="order-card__item">
                              <span>{item.title}</span>
                              <span>x{item.quantity}</span>
                              <span>{item.price} ₽</span>
                            </div>
                          ))}
                        </div>

                        <div className="order-card__total">
                          Итого: {order.total} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth">
              <div className="auth__card">
                <h1 className="auth__title">Войти в личный кабинет</h1>

                <div className="auth__form">
                  <input
                    className="auth__input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    className="auth__input"
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />

                  {error && <p className="auth__error">{error}</p>}

                  <button className="auth__button" onClick={handleLogin}>
                    Войти
                  </button>

                  <p className="auth__hint">
                    Демо-аккаунт: demo@orvix.com / demo123
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
