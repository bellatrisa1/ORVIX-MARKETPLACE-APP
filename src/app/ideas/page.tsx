import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export default function IdeasPage() {
  return (
    <div className="page">
      <TopBar />
      <Header />
      <main className="main">
        <div className="container">
          <div className="demo-page">
            <span className="demo-page__icon">💡</span>
            <h1>Идеи</h1>
            <p>Здесь будут статьи, подборки и идеи для покупок.</p>
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
