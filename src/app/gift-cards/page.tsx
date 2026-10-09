import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function GiftCardsPage() {
  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="demo-page">
            <span className="demo-page__icon">🎁</span>
            <h1>Подарочные карты</h1>
            <p>
              Демонстрация номиналов: покупка и применение подарочных карт пока
              недоступны.
            </p>

            <div className="gift-grid">
              <div className="gift-card">
                <div className="gift-card__value">10 USD</div>
                <p>Для небольшого подарка</p>
              </div>

              <div className="gift-card gift-card--popular">
                <div className="gift-card__badge">Популярный</div>
                <div className="gift-card__value">30 USD</div>
                <p>Оптимальный выбор</p>
              </div>

              <div className="gift-card">
                <div className="gift-card__value">50 USD</div>
                <p>Для дорогих подарков</p>
              </div>

              <div className="gift-card">
                <div className="gift-card__value">100 USD</div>
                <p>Максимальный выбор</p>
              </div>
            </div>

            <Link href="/" className="demo-page__link">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
