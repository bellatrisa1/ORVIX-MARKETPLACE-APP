import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function SalesPage() {
  return (
    <div className="page">
      <TopBar />
      <Header />
      <main className="main">
        <div className="container">
          <div className="demo-page">
            <span className="demo-page__icon">🔥</span>
            <h1>Скидки и акции</h1>
            <p>
              Здесь будут все актуальные распродажи и специальные предложения.
            </p>
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
