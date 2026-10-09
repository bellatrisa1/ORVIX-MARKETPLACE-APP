import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function SupportPage() {
  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="demo-page">
            <span className="demo-page__icon">🎧</span>
            <h1>Поддержка</h1>
            <p>
              Демонстрационная страница поддержки. Чат и отправка обращений пока
              недоступны; контакты приведены как примеры.
            </p>

            <div className="demo-page__contacts">
              <div className="demo-page__contact-card">
                <span>📞</span>
                <strong>+7 812 555-89-72</strong>
                <p>Демонстрационный номер</p>
              </div>

              <div className="demo-page__contact-card">
                <span>✉️</span>
                <strong>support@orvix.com</strong>
                <p>Демонстрационный адрес</p>
              </div>

              <div className="demo-page__contact-card">
                <span>💬</span>
                <strong>Онлайн-чат</strong>
                <p>Пока недоступен</p>
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
