import type { CartItem, CheckoutDetails, DemoOrder } from '@/types/order';
import { availableStock, cartTotal } from './cart';
import { toCents } from './money';

export function validateContacts(details: CheckoutDetails): string | null {
  if (!details.name.trim() || details.name.length > 100)
    return 'Укажите имя (до 100 символов).';
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()) ||
    details.email.length > 254
  )
    return 'Укажите корректный email.';
  const phone = details.phone.replace(/\D/g, '');
  if (phone.length < 10 || phone.length > 15)
    return 'Укажите телефон: от 10 до 15 цифр.';
  if (!details.city.trim() || details.city.length > 100)
    return 'Укажите город.';
  if (details.address.trim().length < 5 || details.address.length > 300)
    return 'Укажите адрес (от 5 до 300 символов).';
  if (details.apartment.length > 50 || details.comment.length > 500)
    return 'Сократите квартиру или комментарий.';
  return null;
}

export function validateCheckout(
  details: CheckoutDetails,
  items: CartItem[],
): string | null {
  const error = validateContacts(details);
  if (error) return error;
  if (!['courier', 'pickup'].includes(details.delivery))
    return 'Выберите способ доставки.';
  if (!['card', 'cash'].includes(details.payment))
    return 'Выберите способ оплаты.';
  if (details.delivery === 'pickup' && details.payment === 'cash')
    return 'Наличные доступны только для курьера.';
  if (!items.length) return 'Корзина пуста.';
  if (
    items.some(
      (item) =>
        !Number.isSafeInteger(item.cartQuantity) ||
        item.cartQuantity <= 0 ||
        item.cartQuantity > availableStock(item),
    )
  )
    return 'Проверьте количество и остатки товаров.';
  return null;
}

export function createDemoOrder(
  id: string,
  details: CheckoutDetails,
  items: CartItem[],
): DemoOrder {
  const error = validateCheckout(details, items);
  if (error) throw new Error(error);
  return {
    id,
    date: new Date().toISOString(),
    status: 'Демонстрационный',
    currency: 'USD',
    total: cartTotal(items),
    items: items.map((item) => ({
      productId: item.id,
      title: item.title,
      quantity: item.cartQuantity,
      price: toCents(item.price) / 100,
    })),
    details: {
      ...details,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      city: details.city.trim(),
      address: details.address.trim(),
      apartment: details.apartment.trim(),
      comment: details.comment.trim(),
    },
  };
}
