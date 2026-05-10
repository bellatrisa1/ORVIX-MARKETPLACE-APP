import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function MobilePage() {
  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="demo-page">
            <span className="demo-page__icon">📱</span>
            <h1>Мобильное приложение</h1>
            <p>
              Скачайте приложение Orvix для iOS и Android. Удобный шопинг прямо
              в вашем смартфоне.
            </p>

            <div className="demo-page__stores">
              <span className="store-btn">🍏 App Store</span>
              <span className="store-btn">▶ Google Play</span>
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
