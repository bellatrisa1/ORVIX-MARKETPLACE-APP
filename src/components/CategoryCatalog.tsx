'use client';

import { useState } from 'react';
import type { MarketplaceProduct } from '@/types/api';
import { selectCatalog } from '@/lib/catalog';
import CategoriesGrid from './CategoriesGrid';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

export default function CategoryCatalog({
  products,
}: {
  products: MarketplaceProduct[];
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'asc' | 'desc'>('default');
  const selected = selectCatalog(
    products,
    { search, category: '', discounts: false, sort },
    page,
  );
  return (
    <>
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      <label className="catalog-sort">
        Сортировка{' '}
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as typeof sort);
            setPage(1);
          }}
        >
          <option value="default">По умолчанию</option>
          <option value="asc">Дешевле</option>
          <option value="desc">Дороже</option>
        </select>
      </label>
      <CategoriesGrid
        products={selected.products}
        isLoading={false}
        isError={false}
      />
      <Pagination {...selected} onChange={setPage} />
    </>
  );
}
