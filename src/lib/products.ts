// src/lib/products.ts
import type { MarketplaceProduct, ProductsResponse } from '@/types/api';

export async function getProducts(): Promise<MarketplaceProduct[]> {
  const response = await fetch('https://dummyjson.com/products?limit=0', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить товары');
  }

  const data: ProductsResponse = await response.json();

  return data.products.map((product) => {
    const oldPrice = Number(
      (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    );

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      oldPrice,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand,
      thumbnail: product.thumbnail,
      images: product.images ?? [product.thumbnail],
    };
  });
}
