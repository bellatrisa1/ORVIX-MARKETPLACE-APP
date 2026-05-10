import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MarketplaceProduct } from '@/types/api';
import type { User, LoginCredentials } from '@/types/user';

interface CartItem extends MarketplaceProduct {
  cartQuantity: number;
}

interface StoreState {
  // Корзина
  cartItems: CartItem[];
  addToCart: (product: MarketplaceProduct) => void;
  increaseCartItem: (id: number) => void;
  decreaseCartItem: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;

  // Избранное
  favoriteIds: number[];
  toggleFavorite: (product: MarketplaceProduct) => void;
  isFavorite: (id: number) => boolean;

  // Авторизация
  user: User | null;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  updateCity: (city: string) => void;

  // Утилиты
  getCartTotalPrice: () => number;
  getCartItemsCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Корзина
      cartItems: [],

      addToCart: (product) =>
        set((state) => ({
          cartItems: [...state.cartItems, { ...product, cartQuantity: 1 }],
        })),

      increaseCartItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          ),
        })),

      decreaseCartItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems
            .map((item) =>
              item.id === id
                ? { ...item, cartQuantity: item.cartQuantity - 1 }
                : item
            )
            .filter((item) => item.cartQuantity > 0),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cartItems: [] }),

      // Избранное
      favoriteIds: [],

      toggleFavorite: (product) => {
        const favorites = get().favoriteIds;
        if (favorites.includes(product.id)) {
          set({ favoriteIds: favorites.filter((id) => id !== product.id) });
        } else {
          set({ favoriteIds: [...favorites, product.id] });
        }
      },

      isFavorite: (id) => get().favoriteIds.includes(id),

      // Авторизация
      user: null,
      isLoggedIn: false,

      login: (credentials) => {
        if (
          credentials.email === 'demo@orvix.com' &&
          credentials.password === 'demo123'
        ) {
          set({
            isLoggedIn: true,
            user: {
              email: 'demo@orvix.com',
              password: 'demo123',
              name: 'Анна',
              avatar: null,
              phone: '+7 (812) 555-89-72',
              city: 'Санкт-Петербург',
              orders: [
                {
                  id: 'ord-001',
                  date: '2026-05-01',
                  total: 23499,
                  status: 'Доставлен',
                  items: [
                    { title: 'iPhone 13', quantity: 1, price: 21999 },
                    { title: 'Чехол силиконовый', quantity: 1, price: 1500 },
                  ],
                },
                {
                  id: 'ord-002',
                  date: '2026-04-18',
                  total: 5490,
                  status: 'В обработке',
                  items: [
                    { title: 'Наушники AirPods', quantity: 1, price: 5490 },
                  ],
                },
              ],
            },
          });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isLoggedIn: false }),

      updateCity: (city) =>
        set((state) => ({
          user: state.user ? { ...state.user, city } : null,
        })),

      // Утилиты
      getCartTotalPrice: () =>
        get().cartItems.reduce(
          (total, item) => total + item.price * item.cartQuantity,
          0
        ),

      getCartItemsCount: () =>
        get().cartItems.reduce((total, item) => total + item.cartQuantity, 0),
    }),
    {
      name: 'orvix-storage',
    }
  )
);
