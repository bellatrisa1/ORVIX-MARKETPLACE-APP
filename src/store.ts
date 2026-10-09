import { create } from 'zustand';
import type { MarketplaceProduct } from '@/types/api';
import type { LoginCredentials } from '@/types/user';
import type { CheckoutDetails, DemoOrder } from '@/types/order';
import { addCartProduct, changeCartQuantity, cartTotal } from '@/lib/cart';
import { createDemoOrder } from '@/lib/checkout';
import {
  decodeSavedState,
  emptySavedState,
  STORAGE_KEY,
  writeSavedState,
  type SavedState,
} from '@/lib/demo-storage';
import { parseProduct } from '@/lib/products';

interface StoreState extends SavedState {
  hydrated: boolean;
  storageReady: boolean;
  storageError: string | null;
  isLoggedIn: boolean;
  hydrate: () => void;
  addToCart: (product: MarketplaceProduct) => void;
  increaseCartItem: (id: number) => void;
  decreaseCartItem: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: MarketplaceProduct) => void;
  isFavorite: (id: number) => boolean;
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  updateCity: (city: string) => void;
  getCartTotalPrice: () => number;
  getCartItemsCount: () => number;
  placeDemoOrder: (id: string, details: CheckoutDetails) => DemoOrder;
}

function savedState(state: SavedState): SavedState {
  return {
    cartItems: state.cartItems,
    favoriteIds: state.favoriteIds,
    user: state.user,
    city: state.city,
    orders: state.orders,
  };
}

export const useStore = create<StoreState>((set, get) => {
  const commit = (patch: Partial<SavedState>) => {
    if (!get().hydrated || !get().storageReady)
      throw new Error('Сохранение ещё не готово. Повторите загрузку данных.');
    const next = savedState({ ...get(), ...patch });
    try {
      writeSavedState(next);
    } catch {
      set({
        storageError:
          'Не удалось сохранить данные в браузере. Проверьте доступность и свободное место localStorage.',
      });
      throw new Error(
        'Не удалось сохранить данные. Корзина и история не изменены.',
      );
    }
    set({ ...next, isLoggedIn: !!next.user, storageError: null });
  };
  const mutate = (patch: Partial<SavedState>) => {
    try {
      commit(patch);
      return true;
    } catch {
      return false;
    }
  };
  return {
    ...emptySavedState(),
    hydrated: false,
    storageReady: false,
    storageError: null,
    isLoggedIn: false,
    hydrate: () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const data = raw ? decodeSavedState(raw) : emptySavedState();
        // Перезаписываем только успешно прочитанное сохранение: миграция убирает пароль и нормализует корзину.
        writeSavedState(data);
        set({
          ...data,
          isLoggedIn: !!data.user,
          hydrated: true,
          storageReady: true,
          storageError: null,
        });
      } catch {
        set({
          hydrated: true,
          storageReady: false,
          storageError:
            'Не удалось прочитать сохранение. Исходные данные не перезаписаны. Проверьте localStorage и повторите загрузку.',
        });
      }
    },
    addToCart: (product) => {
      try {
        mutate({
          cartItems: addCartProduct(get().cartItems, parseProduct(product)),
        });
      } catch {
        set({ storageError: 'Некорректные данные товара.' });
      }
    },
    increaseCartItem: (id) => {
      mutate({ cartItems: changeCartQuantity(get().cartItems, id, 1) });
    },
    decreaseCartItem: (id) => {
      mutate({ cartItems: changeCartQuantity(get().cartItems, id, -1) });
    },
    removeFromCart: (id) => {
      mutate({ cartItems: get().cartItems.filter((item) => item.id !== id) });
    },
    clearCart: () => {
      mutate({ cartItems: [] });
    },
    toggleFavorite: (product) => {
      if (!Number.isSafeInteger(product.id) || product.id <= 0) return;
      const ids = get().favoriteIds;
      mutate({
        favoriteIds: ids.includes(product.id)
          ? ids.filter((id) => id !== product.id)
          : [...ids, product.id],
      });
    },
    isFavorite: (id) => get().favoriteIds.includes(id),
    login: (credentials) => {
      if (
        credentials.email !== 'demo@orvix.com' ||
        credentials.password !== 'demo123'
      )
        return false;
      return mutate({
        user: {
          email: 'demo@orvix.com',
          name: 'Анна',
          avatar: null,
          phone: '+7 (812) 555-89-72',
          city: get().city,
        },
      });
    },
    logout: () => {
      mutate({ user: null });
    },
    updateCity: (city) => {
      if (!city.trim() || city.length > 100) return;
      mutate({
        city: city.trim(),
        user: get().user ? { ...get().user!, city: city.trim() } : null,
      });
    },
    getCartTotalPrice: () => cartTotal(get().cartItems),
    getCartItemsCount: () =>
      get().cartItems.reduce((total, item) => total + item.cartQuantity, 0),
    placeDemoOrder: (id, details) => {
      if (!/^demo-[a-zA-Z0-9-]+$/.test(id))
        throw new Error('Некорректный идентификатор заказа.');
      const existing = get().orders.find((order) => order.id === id);
      if (existing) return existing;
      const order = createDemoOrder(id, details, get().cartItems);
      commit({ orders: [order, ...get().orders], cartItems: [] });
      return order;
    },
  };
});
