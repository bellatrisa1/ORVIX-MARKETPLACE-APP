import type { MarketplaceProduct } from '@/types/api';

export const PAGE_SIZE = 12;
export interface CatalogFilters {
  search: string;
  category: string;
  sort: 'default' | 'asc' | 'desc';
  discounts: boolean;
}

export function selectCatalog(
  products: MarketplaceProduct[],
  filters: CatalogFilters,
  page: number,
) {
  const search = filters.search.trim().toLowerCase();
  const filtered = products.filter(
    (item) =>
      (!filters.category || item.category === filters.category) &&
      (!filters.discounts || item.discountPercentage > 0) &&
      (!search ||
        [item.title, item.description, item.category, item.brand ?? ''].some(
          (value) => value.toLowerCase().includes(search),
        )),
  );
  if (filters.sort !== 'default')
    filtered.sort(
      (a, b) =>
        (a.price - b.price) * (filters.sort === 'asc' ? 1 : -1) || a.id - b.id,
    );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), pages);
  return {
    products: filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    ),
    total: filtered.length,
    pages,
    page: currentPage,
  };
}
