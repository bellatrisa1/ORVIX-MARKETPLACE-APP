'use client';

export default function Pagination({
  page,
  pages,
  total,
  onChange,
}: {
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (!total) return null;
  return (
    <nav className="pagination" aria-label="Страницы товаров">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Назад
      </button>
      <span aria-live="polite">
        Страница {page} из {pages} · Товаров: {total}
      </span>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Далее
      </button>
    </nav>
  );
}
