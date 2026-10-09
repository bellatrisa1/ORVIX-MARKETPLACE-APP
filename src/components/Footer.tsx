import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Image
            src="/ORVIX-LOGO.png"
            alt="Orvix"
            width={180}
            height={70}
            className="footer__logo"
          />

          <p className="footer__description">
            Orvix — демонстрационный маркетплейс. Электроника, одежда,
            аксессуары и другие товары из тестового каталога. Разделы без ссылок
            пока недоступны.
          </p>

          <div className="footer__socials">
            <span
              className="footer__unavailable"
              aria-label="📱 — пока недоступно"
              title="Пока недоступно"
            >
              📱
            </span>
            <span
              className="footer__unavailable"
              aria-label="📷 — пока недоступно"
              title="Пока недоступно"
            >
              📷
            </span>
            <span
              className="footer__unavailable"
              aria-label="🐦 — пока недоступно"
              title="Пока недоступно"
            >
              🐦
            </span>
            <span
              className="footer__unavailable"
              aria-label="▶ — пока недоступно"
              title="Пока недоступно"
            >
              ▶
            </span>
          </div>
        </div>

        <div className="footer__column">
          <h4>Покупателям</h4>
          <Link href="/support">Как сделать заказ</Link>
          <Link href="/services">Доставка</Link>
          <span
            className="footer__unavailable"
            aria-label="Возврат товара — пока недоступно"
            title="Пока недоступно"
          >
            Возврат товара
          </span>
          <span
            className="footer__unavailable"
            aria-label="Гарантии — пока недоступно"
            title="Пока недоступно"
          >
            Гарантии
          </span>
          <Link href="/support">Помощь</Link>
        </div>

        <div className="footer__column">
          <h4>Компания</h4>
          <span
            className="footer__unavailable"
            aria-label="О нас — пока недоступно"
            title="Пока недоступно"
          >
            О нас
          </span>
          <span
            className="footer__unavailable"
            aria-label="Новости — пока недоступно"
            title="Пока недоступно"
          >
            Новости
          </span>
          <span
            className="footer__unavailable"
            aria-label="Карьера — пока недоступно"
            title="Пока недоступно"
          >
            Карьера
          </span>
          <Link href="/business">Партнёрам</Link>
          <Link href="/support">Контакты</Link>
        </div>

        <div className="footer__column">
          <h4>Каталог</h4>
          <Link href="/category/smartphones">Электроника</Link>
          <Link href="/category/mens-shirts">Одежда</Link>
          <Link href="/category/laptops">Техника</Link>
          <Link href="/category/beauty">Красота</Link>
          <Link href="/category/mobile-accessories">Аксессуары</Link>
        </div>

        <div className="footer__column">
          <h4>Контакты</h4>
          <p>Демо: support@orvix.com</p>
          <p>+7 (812) 555-89-72</p>
          <p>Санкт-Петербург</p>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Orvix. Все права защищены.</p>
          <div className="footer__legal">
            <span
              className="footer__unavailable"
              aria-label="Политика конфиденциальности — пока недоступно"
              title="Пока недоступно"
            >
              Политика конфиденциальности
            </span>
            <span
              className="footer__unavailable"
              aria-label="Пользовательское соглашение — пока недоступно"
              title="Пока недоступно"
            >
              Пользовательское соглашение
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
