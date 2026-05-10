import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  return (
    <div className="page">
      <TopBar />
      <Header />
      <main className="main">
        <div className="container">
          <div className="demo-page">
            <span className="demo-page__icon">🛠</span>
            <h1>Услуги</h1>
            <p>Здесь будут услуги: доставка, установка, настройка и другое.</p>
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
