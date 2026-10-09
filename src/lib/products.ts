import type { MarketplaceProduct } from '@/types/api';

const API_URL = 'https://dummyjson.com';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isImageUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'cdn.dummyjson.com';
  } catch {
    return false;
  }
}

export function parseProduct(value: unknown): MarketplaceProduct {
  if (
    !isRecord(value) ||
    !Number.isSafeInteger(value.id) ||
    (value.id as number) <= 0 ||
    typeof value.title !== 'string' ||
    !value.title.trim() ||
    typeof value.description !== 'string' ||
    typeof value.category !== 'string' ||
    !/^[a-z0-9-]+$/.test(value.category) ||
    typeof value.price !== 'number' ||
    !Number.isFinite(value.price) ||
    value.price < 0 ||
    value.price > 1_000_000_000 ||
    typeof value.discountPercentage !== 'number' ||
    !Number.isFinite(value.discountPercentage) ||
    value.discountPercentage < 0 ||
    value.discountPercentage >= 100 ||
    typeof value.rating !== 'number' ||
    !Number.isFinite(value.rating) ||
    value.rating < 0 ||
    value.rating > 5 ||
    !Number.isSafeInteger(value.stock) ||
    (value.stock as number) < 0 ||
    !isImageUrl(value.thumbnail) ||
    (value.images !== undefined &&
      (!Array.isArray(value.images) || !value.images.every(isImageUrl))) ||
    (value.brand !== undefined && typeof value.brand !== 'string')
  ) {
    throw new Error('Источник вернул некорректные данные товара.');
  }
  const price = value.price;
  const discount = value.discountPercentage;
  return {
    id: value.id as number,
    title: value.title,
    description: value.description,
    category: value.category,
    price,
    oldPrice: Number((price / (1 - discount / 100)).toFixed(2)),
    discountPercentage: discount,
    rating: value.rating,
    stock: value.stock as number,
    brand: value.brand as string | undefined,
    thumbnail: value.thumbnail,
    images:
      Array.isArray(value.images) && value.images.length
        ? (value.images as string[])
        : [value.thumbnail],
  };
}

async function request(path: string): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
}

export async function getProducts(
  category?: string,
): Promise<MarketplaceProduct[]> {
  const path = category
    ? `/products/category/${encodeURIComponent(category)}?limit=0`
    : '/products?limit=0';
  const response = await request(path);
  if (!response.ok) throw new Error('Не удалось загрузить товары.');
  const data: unknown = await response.json();
  if (
    !isRecord(data) ||
    !Array.isArray(data.products) ||
    !Number.isSafeInteger(data.total) ||
    data.total !== data.products.length
  )
    throw new Error('Источник вернул неполный каталог.');
  return data.products.map(parseProduct);
}

export async function getProduct(
  id: number,
): Promise<MarketplaceProduct | null> {
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const response = await request(`/products/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Не удалось загрузить товар.');
  const product = parseProduct(await response.json());
  if (product.id !== id) throw new Error('Источник вернул другой товар.');
  return product;
}

export async function getCategories(): Promise<string[]> {
  const response = await request('/products/category-list');
  if (!response.ok) throw new Error('Не удалось загрузить категории.');
  const data: unknown = await response.json();
  if (
    !Array.isArray(data) ||
    !data.every((item) => typeof item === 'string' && /^[a-z0-9-]+$/.test(item))
  )
    throw new Error('Некорректный список категорий.');
  return data;
}

export async function getRelatedProducts(category: string, id: number) {
  const response = await request(
    `/products/category/${encodeURIComponent(category)}?limit=5`,
  );
  if (!response.ok) throw new Error('Не удалось загрузить похожие товары.');
  const data: unknown = await response.json();
  if (!isRecord(data) || !Array.isArray(data.products))
    throw new Error('Некорректные похожие товары.');
  return data.products
    .map(parseProduct)
    .filter((item) => item.id !== id)
    .slice(0, 4);
}
