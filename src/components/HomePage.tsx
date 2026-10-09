'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TopBar from './TopBar';
import Header from './Header';
import SearchBar from './SearchBar';
import Chips from './Chips';
import Hero from './Hero';
import CategoriesGrid from './CategoriesGrid';
import Footer from './Footer';
import Pagination from './Pagination';
import { getProducts } from '@/lib/products';
import { selectCatalog } from '@/lib/catalog';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState('Все');
  const [page, setPage] = useState(1);
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['marketplace-products'],
    queryFn: () => getProducts(),
  });
  const selected = selectCatalog(
    data,
    {
      search,
      category: ['Все', 'Скидки', 'Дешевле', 'Дороже'].includes(activeChip)
        ? ''
        : activeChip,
      discounts: activeChip === 'Скидки',
      sort:
        activeChip === 'Дешевле'
          ? 'asc'
          : activeChip === 'Дороже'
            ? 'desc'
            : 'default',
    },
    page,
  );
  return (
    <div className="page">
      <TopBar />
      <Header />
      <main className="main">
        <div className="container">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <Chips
            activeChip={activeChip}
            onChange={(value) => {
              setActiveChip(value);
              setPage(1);
            }}
          />
          <Hero
            onOffers={() => {
              setActiveChip('Скидки');
              setPage(1);
            }}
          />
          <div id="catalog-products">
            <CategoriesGrid
              products={selected.products}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => {
                void refetch();
              }}
            />
            {!isLoading && !isError && (
              <Pagination {...selected} onChange={setPage} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
