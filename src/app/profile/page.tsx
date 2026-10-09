'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useStore } from '@/store';
import OrderHistory from '@/components/OrderHistory';

export default function ProfilePage() {
  const { user, isLoggedIn, login, logout, hydrated, storageReady } =
    useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    const success = login({ email, password });
    if (!success) {
      setError(
        'Неверный email или пароль. Попробуйте demo@orvix.com / demo123',
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
                    aria-label="Email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    className="auth__input"
                    type="password"
                    placeholder="Пароль"
                    aria-label="Пароль"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />

                  {error && <p className="auth__error">{error}</p>}

                  <button
                    className="auth__button"
                    disabled={!hydrated || !storageReady}
                    onClick={handleLogin}
                  >
                    Войти
                  </button>

                  <p className="auth__hint">
                    Демо-аккаунт: demo@orvix.com / demo123
                  </p>
                </div>
              </div>
            </div>
          )}
          <OrderHistory />
        </div>
      </main>

      <Footer />
    </div>
  );
}
