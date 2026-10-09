import type { CartItem, DemoOrder, CheckoutDetails } from '@/types/order';
import type { User } from '@/types/user';
import { isRecord, parseProduct } from './products';
import { availableStock } from './cart';
import { validateContacts } from './checkout';
import { toCents } from './money';

export const STORAGE_KEY = 'orvix-storage';
export const STORAGE_VERSION = 1;
export const DEFAULT_CITY = 'Санкт-Петербург';

export interface SavedState {
  cartItems: CartItem[];
  favoriteIds: number[];
  user: User | null;
  city: string;
  orders: DemoOrder[];
}

export function emptySavedState(): SavedState {
  return {
    cartItems: [],
    favoriteIds: [],
    user: null,
    city: DEFAULT_CITY,
    orders: [],
  };
}

function parseDetails(value: unknown): CheckoutDetails {
  if (!isRecord(value)) throw new Error('Некорректные контакты заказа.');
  const keys = [
    'name',
    'email',
    'phone',
    'city',
    'address',
    'apartment',
    'comment',
  ] as const;
  if (
    !keys.every((key) => typeof value[key] === 'string') ||
    !['courier', 'pickup'].includes(value.delivery as string) ||
    !['card', 'cash'].includes(value.payment as string)
  )
    throw new Error('Некорректные данные заказа.');
  const details: CheckoutDetails = {
    name: value.name as string,
    email: value.email as string,
    phone: value.phone as string,
    city: value.city as string,
    address: value.address as string,
    apartment: value.apartment as string,
    comment: value.comment as string,
    delivery: value.delivery as CheckoutDetails['delivery'],
    payment: value.payment as CheckoutDetails['payment'],
  };
  if (
    validateContacts(details) ||
    (details.delivery === 'pickup' && details.payment === 'cash')
  )
    throw new Error('Некорректные данные заказа.');
  return details;
}

function parseOrder(value: unknown): DemoOrder {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    !/^demo-[a-zA-Z0-9-]+$/.test(value.id) ||
    typeof value.date !== 'string' ||
    !Number.isFinite(Date.parse(value.date)) ||
    value.status !== 'Демонстрационный' ||
    value.currency !== 'USD' ||
    typeof value.total !== 'number' ||
    !Number.isFinite(value.total) ||
    value.total < 0 ||
    !Array.isArray(value.items) ||
    !value.items.length
  )
    throw new Error('Некорректный сохранённый заказ.');
  const items = value.items.map((item) => {
    if (
      !isRecord(item) ||
      !Number.isSafeInteger(item.productId) ||
      (item.productId as number) <= 0 ||
      typeof item.title !== 'string' ||
      !item.title.trim() ||
      !Number.isSafeInteger(item.quantity) ||
      (item.quantity as number) <= 0 ||
      typeof item.price !== 'number' ||
      !Number.isFinite(item.price) ||
      item.price < 0
    )
      throw new Error('Некорректный состав заказа.');
    return {
      productId: item.productId as number,
      title: item.title,
      quantity: item.quantity as number,
      price: item.price,
    };
  });
  if (
    items.reduce(
      (sum, item) => sum + toCents(item.price) * item.quantity,
      0,
    ) !== toCents(value.total)
  )
    throw new Error('Некорректная сумма заказа.');
  return {
    id: value.id,
    date: value.date,
    status: value.status,
    currency: value.currency,
    total: value.total,
    items,
    details: parseDetails(value.details),
  };
}

export function decodeSavedState(raw: string): SavedState {
  const envelope: unknown = JSON.parse(raw);
  if (
    !isRecord(envelope) ||
    !isRecord(envelope.state) ||
    ![0, 1].includes((envelope.version ?? 0) as number)
  )
    throw new Error('Неизвестный формат сохранённых данных.');
  const value = envelope.state;
  if (!Array.isArray(value.cartItems) || !Array.isArray(value.favoriteIds))
    throw new Error('Повреждённое сохранение.');
  const cartItems: CartItem[] = [];
  for (const item of value.cartItems) {
    const product = parseProduct(item);
    if (
      !isRecord(item) ||
      typeof item.cartQuantity !== 'number' ||
      !Number.isFinite(item.cartQuantity)
    )
      throw new Error('Некорректное количество.');
    const quantity = Math.min(
      availableStock(product),
      Math.max(0, Math.floor(item.cartQuantity)),
    );
    if (!quantity) continue;
    const existing = cartItems.find((entry) => entry.id === product.id);
    if (existing)
      existing.cartQuantity = Math.min(
        product.stock,
        existing.cartQuantity + quantity,
      );
    else cartItems.push({ ...product, cartQuantity: quantity });
  }
  if (!value.favoriteIds.every((id) => Number.isSafeInteger(id) && id > 0))
    throw new Error('Некорректное избранное.');
  const oldUser = isRecord(value.user) ? value.user : null;
  const city =
    typeof value.city === 'string' && value.city.trim()
      ? value.city
      : typeof oldUser?.city === 'string' && oldUser.city.trim()
        ? oldUser.city
        : DEFAULT_CITY;
  const user: User | null =
    oldUser?.email === 'demo@orvix.com' && value.isLoggedIn !== false
      ? {
          email: 'demo@orvix.com',
          name: 'Анна',
          avatar: null,
          phone: '+7 (812) 555-89-72',
          city,
        }
      : null;
  // Старые заказы в user.orders были фикстурами: в новую историю переносим только реальные локальные демозаказы.
  if (envelope.version === 1 && !Array.isArray(value.orders))
    throw new Error('Повреждённая история заказов.');
  const orders =
    envelope.version === 1 ? (value.orders as unknown[]).map(parseOrder) : [];
  if (new Set(orders.map((order) => order.id)).size !== orders.length)
    throw new Error('Повторяющиеся идентификаторы заказов.');
  return {
    cartItems,
    favoriteIds: [...new Set(value.favoriteIds as number[])],
    user,
    city,
    orders,
  };
}

export function writeSavedState(state: SavedState) {
  // Одна запись заменяет корзину и историю вместе; при исключении прежнее сохранение остаётся целым.
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: STORAGE_VERSION, state }),
  );
}
