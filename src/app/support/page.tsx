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
              Мы всегда готовы помочь! Напишите нам в чат, позвоните или
              оставьте заявку — ответим в течение 15 минут.
            </p>

            <div className="demo-page__contacts">
              <div className="demo-page__contact-card">
                <span>📞</span>
                <strong>+7 812 555-89-72</strong>
                <p>Ежедневно с 9:00 до 21:00</p>
              </div>

              <div className="demo-page__contact-card">
                <span>✉️</span>
                <strong>support@orvix.com</strong>
                <p>Отвечаем в течение часа</p>
              </div>

              <div className="demo-page__contact-card">
                <span>💬</span>
                <strong>Онлайн-чат</strong>
                <p>Среднее время ответа: 3 минуты</p>
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
