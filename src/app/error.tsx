'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container demo-page">
      <h1>Не удалось загрузить страницу</h1>
      <p>Проверьте соединение и повторите попытку.</p>
      <button className="checkout__btn" type="button" onClick={reset}>
        Повторить
      </button>{' '}
      <Link href="/">Главная</Link>
    </main>
  );
}
