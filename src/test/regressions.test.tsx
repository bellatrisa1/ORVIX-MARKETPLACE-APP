import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useStore } from '@/store';
import ProductPageClient from '@/components/ProductPageClient';
import type { MarketplaceProduct } from '@/types/api';
import type { CheckoutDetails } from '@/types/order';
import {
  decodeSavedState,
  emptySavedState,
  STORAGE_KEY,
} from '@/lib/demo-storage';
import { selectCatalog } from '@/lib/catalog';
import { getProduct, parseProduct } from '@/lib/products';
import { validateCheckout } from '@/lib/checkout';

const product: MarketplaceProduct = {
  id: 1,
  title: 'Товар',
  description: 'Описание',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 10,
  rating: 4,
  stock: 2,
  thumbnail: 'https://cdn.dummyjson.com/test.jpg',
  images: ['https://cdn.dummyjson.com/test.jpg'],
};
const details: CheckoutDetails = {
  name: 'Демо Покупатель',
  email: 'buyer@example.com',
  phone: '+7 999 000 00 00',
  city: 'Москва',
  address: 'Демонстрационная улица, 1',
  apartment: '',
  delivery: 'courier',
  payment: 'card',
  comment: '',
};

beforeEach(() => {
  localStorage.clear();
  useStore.setState({
    ...emptySavedState(),
    hydrated: false,
    storageReady: false,
    storageError: null,
    isLoggedIn: false,
  });
  useStore.getState().hydrate();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Регрессии корзины и интерфейса', () => {
  it('объединяет повторное добавление и не превышает остаток', () => {
    for (let i = 0; i < 5; i++) useStore.getState().addToCart(product);
    useStore.getState().increaseCartItem(1);
    expect(useStore.getState().cartItems).toHaveLength(1);
    expect(useStore.getState().cartItems[0].cartQuantity).toBe(2);
    useStore.getState().decreaseCartItem(1);
    useStore.getState().decreaseCartItem(1);
    expect(useStore.getState().cartItems).toEqual([]);
  });
  it.each([0, -1, 1.5, NaN])(
    'не добавляет товар с некорректным остатком %s',
    (stock) => {
      useStore.getState().addToCart({ ...product, stock });
      expect(useStore.getState().cartItems).toEqual([]);
    },
  );
  it('обновляет остаток повторно добавленного товара', () => {
    useStore.getState().addToCart(product);
    useStore.getState().addToCart(product);
    useStore.getState().addToCart({ ...product, stock: 1 });
    expect(useStore.getState().cartItems[0].cartQuantity).toBe(1);
  });
  it('перерисовывает избранное на странице товара', () => {
    render(<ProductPageClient product={product} relatedProducts={[]} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Добавить в избранное' }),
    );
    expect(
      screen.getByRole('button', { name: 'Удалить из избранного' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
  it('сохраняет город гостя после восстановления состояния и входа', () => {
    useStore.getState().updateCity('Москва');
    useStore.setState({ city: 'Казань' });
    useStore.getState().hydrate();
    expect(useStore.getState().city).toBe('Москва');
    useStore.getState().login({ email: 'demo@orvix.com', password: 'demo123' });
    expect(useStore.getState().user?.city).toBe('Москва');
    expect(localStorage.getItem(STORAGE_KEY)).not.toContain('password');
  });
  it('не меняет сохранение до гидратации', () => {
    useStore.getState().addToCart(product);
    const raw = localStorage.getItem(STORAGE_KEY);
    useStore.setState({ hydrated: false });
    useStore.getState().clearCart();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    expect(useStore.getState().cartItems).toHaveLength(1);
  });
});

describe('Демозаказы и восстановление данных', () => {
  it('сохраняет снимок заказа и очищает корзину одной записью', () => {
    useStore.getState().addToCart(product);
    const order = useStore.getState().placeDemoOrder('demo-first', details);
    const saved = decodeSavedState(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.orders[0]).toEqual(order);
    expect(saved.cartItems).toEqual([]);
    expect(order.total).toBe(9.99);
    useStore.setState({ orders: [], cartItems: [] });
    useStore.getState().hydrate();
    expect(useStore.getState().orders[0]).toEqual(order);
  });
  it('повторный ID не создаёт второй заказ и не очищает новую корзину', () => {
    useStore.getState().addToCart(product);
    const order = useStore.getState().placeDemoOrder('demo-repeat', details);
    useStore.getState().addToCart(product);
    expect(useStore.getState().placeDemoOrder('demo-repeat', details)).toEqual(
      order,
    );
    expect(useStore.getState().orders).toHaveLength(1);
    expect(useStore.getState().cartItems).toHaveLength(1);
  });
  it('при ошибке записи сохраняет корзину, историю и прежние данные', () => {
    useStore.getState().addToCart(product);
    const raw = localStorage.getItem(STORAGE_KEY);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError');
    });
    expect(() =>
      useStore.getState().placeDemoOrder('demo-failed', details),
    ).toThrow('Не удалось сохранить');
    expect(useStore.getState().cartItems).toHaveLength(1);
    expect(useStore.getState().orders).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it('не очищает корзину при неверных контактах', () => {
    useStore.getState().addToCart(product);
    expect(() =>
      useStore
        .getState()
        .placeDemoOrder('demo-invalid', { ...details, email: 'wrong' }),
    ).toThrow('email');
    expect(useStore.getState().cartItems).toHaveLength(1);
  });
  it('запрещает наличные для ПВЗ на уровне правил', () => {
    expect(
      validateCheckout({ ...details, delivery: 'pickup', payment: 'cash' }, [
        { ...product, cartQuantity: 1 },
      ]),
    ).toContain('Наличные');
  });
  it('мигрирует старую корзину, город и профиль без пароля и фиктивных заказов', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 0,
        state: {
          cartItems: [
            { ...product, cartQuantity: 1 },
            { ...product, cartQuantity: 10.5 },
          ],
          favoriteIds: [1, 1],
          isLoggedIn: true,
          user: {
            email: 'demo@orvix.com',
            city: 'Казань',
            password: 'demo123',
            orders: [{ id: 'ord-001' }],
          },
        },
      }),
    );
    useStore.getState().hydrate();
    expect(useStore.getState().cartItems[0].cartQuantity).toBe(2);
    expect(useStore.getState().favoriteIds).toEqual([1]);
    expect(useStore.getState().city).toBe('Казань');
    expect(useStore.getState().orders).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).not.toContain('password');
    expect(localStorage.getItem(STORAGE_KEY)).not.toContain('ord-001');
  });
  it.each(['broken json', JSON.stringify({ version: 99, state: {} })])(
    'не перезаписывает непрочитанное сохранение',
    (raw) => {
      localStorage.setItem(STORAGE_KEY, raw);
      useStore.getState().hydrate();
      useStore.getState().addToCart(product);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
      expect(useStore.getState().storageReady).toBe(false);
    },
  );
  it('восстанавливает корзину и избранное из настоящего localStorage jsdom', () => {
    useStore.getState().addToCart(product);
    useStore.getState().toggleFavorite(product);
    useStore.setState({ cartItems: [], favoriteIds: [] });
    useStore.getState().hydrate();
    expect(useStore.getState().cartItems[0].id).toBe(1);
    expect(useStore.getState().favoriteIds).toEqual([1]);
  });
  it('считает суммы в центах', () => {
    useStore.getState().addToCart({ ...product, price: 0.1 });
    useStore.getState().addToCart({ ...product, id: 2, price: 0.2 });
    expect(useStore.getState().getCartTotalPrice()).toBe(0.3);
  });
});

describe('Границы API и пагинация', () => {
  it('получает один товар через конкретный endpoint', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(product)));
    vi.stubGlobal('fetch', fetch);
    expect((await getProduct(1))?.id).toBe(1);
    expect(fetch.mock.calls[0][0]).toBe('https://dummyjson.com/products/1');
  });
  it('отличает неизвестный товар от ошибки источника', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 404 })),
    );
    expect(await getProduct(9999)).toBeNull();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 503 })),
    );
    await expect(getProduct(1)).rejects.toThrow('загрузить');
  });
  it('проверяет внешние числа и URL во время выполнения', () => {
    expect(() => parseProduct({ ...product, price: '9.99' })).toThrow();
    expect(() =>
      parseProduct({ ...product, thumbnail: 'javascript:alert(1)' }),
    ).toThrow();
  });
  it('ищет и сортирует до разбиения всего набора на страницы', () => {
    const products = Array.from({ length: 30 }, (_, index) => ({
      ...product,
      id: index + 1,
      title: index === 29 ? 'Искомый' : 'Другой',
      price: 30 - index,
    }));
    expect(
      selectCatalog(
        products,
        { search: 'Искомый', category: '', sort: 'default', discounts: false },
        1,
      ).products[0].id,
    ).toBe(30);
    const selected = selectCatalog(
      products,
      { search: '', category: '', sort: 'asc', discounts: false },
      2,
    );
    expect(selected.total).toBe(30);
    expect(selected.pages).toBe(3);
    expect(selected.products[0].price).toBe(13);
  });
});
