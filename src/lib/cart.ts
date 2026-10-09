import type { MarketplaceProduct } from '@/types/api';
import type { CartItem } from '@/types/order';
import { toCents } from './money';

export function availableStock(product: MarketplaceProduct) {
  return Number.isSafeInteger(product.stock) && product.stock > 0
    ? product.stock
    : 0;
}

export function addCartProduct(
  items: CartItem[],
  product: MarketplaceProduct,
): CartItem[] {
  const stock = availableStock(product);
  if (!stock) return items;
  const existing = items.find((item) => item.id === product.id);
  if (!existing) return [...items, { ...product, cartQuantity: 1 }];
  return items.map((item) =>
    item.id === product.id
      ? { ...product, cartQuantity: Math.min(existing.cartQuantity + 1, stock) }
      : item,
  );
}

export function changeCartQuantity(
  items: CartItem[],
  id: number,
  delta: 1 | -1,
) {
  return items
    .map((item) =>
      item.id === id
        ? {
            ...item,
            cartQuantity: Math.min(
              availableStock(item),
              item.cartQuantity + delta,
            ),
          }
        : item,
    )
    .filter((item) => item.cartQuantity > 0);
}

export function cartTotal(items: CartItem[]) {
  return (
    items.reduce(
      (total, item) => total + toCents(item.price) * item.cartQuantity,
      0,
    ) / 100
  );
}
