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
              Подарите близким возможность выбрать то, что им действительно
              нужно. Доступны электронные и физические карты.
            </p>

            <div className="gift-grid">
              <div className="gift-card">
                <div className="gift-card__value">1 000 ₽</div>
                <p>Для небольшого подарка</p>
              </div>

              <div className="gift-card gift-card--popular">
                <div className="gift-card__badge">Популярный</div>
                <div className="gift-card__value">3 000 ₽</div>
                <p>Оптимальный выбор</p>
              </div>

              <div className="gift-card">
                <div className="gift-card__value">5 000 ₽</div>
                <p>Для дорогих подарков</p>
              </div>

              <div className="gift-card">
                <div className="gift-card__value">10 000 ₽</div>
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
