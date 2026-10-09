import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="page">
      <TopBar />
      <Header />
      <main className="main">
        <div className="container demo-page">
          <h1>404 — Страница не найдена</h1>
          <p>Такого товара, категории или страницы нет.</p>
          <Link href="/" className="demo-page__link">
            Перейти к каталогу
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
