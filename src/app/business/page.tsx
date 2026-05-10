import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function BusinessPage() {
  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="demo-page">
            <span className="demo-page__icon">🏢</span>
            <h1>Для бизнеса</h1>
            <p>
              Оптовые поставки, корпоративные заказы и специальные условия для
              вашего бизнеса.
            </p>

            <div className="business-features">
              <div className="business-feature">
                <span>📦</span>
                <strong>Оптовые цены</strong>
                <p>Скидки от 10 000 ₽</p>
              </div>

              <div className="business-feature">
                <span>📋</span>
                <strong>Безналичный расчёт</strong>
                <p>Закрывающие документы</p>
              </div>

              <div className="business-feature">
                <span>🚚</span>
                <strong>Доставка до офиса</strong>
                <p>По всей России</p>
              </div>

              <div className="business-feature">
                <span>👨‍💼</span>
                <strong>Персональный менеджер</strong>
                <p>Всегда на связи</p>
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
