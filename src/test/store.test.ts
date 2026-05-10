import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/store';
import type { MarketplaceProduct } from '@/types/api';

const mockProduct: MarketplaceProduct = {
  id: 1,
  title: 'Тестовый товар',
  description: 'Описание тестового товара',
  category: 'smartphones',
  price: 100,
  oldPrice: 150,
  discountPercentage: 33,
  rating: 4.5,
  stock: 10,
  brand: 'TestBrand',
  thumbnail: '/test.jpg',
  images: ['/test1.jpg', '/test2.jpg'],
};

const mockProduct2: MarketplaceProduct = {
  id: 2,
  title: 'Второй товар',
  description: 'Описание второго товара',
  category: 'laptops',
  price: 200,
  oldPrice: 250,
  discountPercentage: 20,
  rating: 4.0,
  stock: 5,
  brand: 'TestBrand2',
  thumbnail: '/test2.jpg',
  images: ['/test3.jpg'],
};

describe('Store', () => {
  // Сбрасываем стор перед каждым тестом
  beforeEach(() => {
    const store = useStore.getState();
    store.clearCart();
    // Очищаем избранное и логин через прямой set
    useStore.setState({
      cartItems: [],
      favoriteIds: [],
      user: null,
      isLoggedIn: false,
    });
  });

  // ========== КОРЗИНА ==========
  describe('Корзина', () => {
    it('добавляет товар в корзину', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct);

      const cartItems = useStore.getState().cartItems;
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].id).toBe(1);
      expect(cartItems[0].cartQuantity).toBe(1);
    });

    it('увеличивает количество товара', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct);
      store.increaseCartItem(1);

      const cartItems = useStore.getState().cartItems;
      expect(cartItems[0].cartQuantity).toBe(2);
    });

    it('уменьшает количество товара', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct);
      store.increaseCartItem(1);
      store.increaseCartItem(1); // теперь 3
      store.decreaseCartItem(1); // теперь 2

      const cartItems = useStore.getState().cartItems;
      expect(cartItems[0].cartQuantity).toBe(2);
    });

    it('удаляет товар когда количество доходит до 0', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct);
      store.decreaseCartItem(1);

      const cartItems = useStore.getState().cartItems;
      expect(cartItems).toHaveLength(0);
    });

    it('удаляет товар из корзины', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct);
      store.addToCart(mockProduct2);
      store.removeFromCart(1);

      const cartItems = useStore.getState().cartItems;
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].id).toBe(2);
    });

    it('очищает корзину', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct);
      store.addToCart(mockProduct2);
      store.clearCart();

      const cartItems = useStore.getState().cartItems;
      expect(cartItems).toHaveLength(0);
    });

    it('правильно считает общую стоимость', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct); // 100
      store.increaseCartItem(1); // +100 = 200
      store.addToCart(mockProduct2); // +200 = 400

      const total = useStore.getState().getCartTotalPrice();
      expect(total).toBe(400);
    });

    it('правильно считает количество товаров', () => {
      const store = useStore.getState();
      store.addToCart(mockProduct);
      store.increaseCartItem(1); // 2 шт
      store.addToCart(mockProduct2); // 1 шт

      const count = useStore.getState().getCartItemsCount();
      expect(count).toBe(3);
    });
  });

  // ========== ИЗБРАННОЕ ==========
  describe('Избранное', () => {
    it('добавляет товар в избранное', () => {
      const store = useStore.getState();
      store.toggleFavorite(mockProduct);

      const favoriteIds = useStore.getState().favoriteIds;
      expect(favoriteIds).toContain(1);
      expect(favoriteIds).toHaveLength(1);
    });

    it('удаляет товар из избранного', () => {
      const store = useStore.getState();
      store.toggleFavorite(mockProduct);
      store.toggleFavorite(mockProduct);

      const favoriteIds = useStore.getState().favoriteIds;
      expect(favoriteIds).not.toContain(1);
      expect(favoriteIds).toHaveLength(0);
    });

    it('правильно проверяет избранное', () => {
      const store = useStore.getState();
      store.toggleFavorite(mockProduct);

      expect(useStore.getState().isFavorite(1)).toBe(true);
      expect(useStore.getState().isFavorite(2)).toBe(false);
    });

    it('добавляет несколько товаров в избранное', () => {
      const store = useStore.getState();
      store.toggleFavorite(mockProduct);
      store.toggleFavorite(mockProduct2);

      const favoriteIds = useStore.getState().favoriteIds;
      expect(favoriteIds).toHaveLength(2);
      expect(favoriteIds).toContain(1);
      expect(favoriteIds).toContain(2);
    });
  });

  // ========== АВТОРИЗАЦИЯ ==========
  describe('Авторизация', () => {
    it('входит с правильными данными', () => {
      const store = useStore.getState();
      const result = store.login({
        email: 'demo@orvix.com',
        password: 'demo123',
      });

      expect(result).toBe(true);
      expect(useStore.getState().isLoggedIn).toBe(true);
      expect(useStore.getState().user?.name).toBe('Анна');
      expect(useStore.getState().user?.email).toBe('demo@orvix.com');
    });

    it('не входит с неправильными данными', () => {
      const store = useStore.getState();
      const result = store.login({
        email: 'wrong@email.com',
        password: 'wrong',
      });

      expect(result).toBe(false);
      expect(useStore.getState().isLoggedIn).toBe(false);
      expect(useStore.getState().user).toBeNull();
    });

    it('выходит из аккаунта', () => {
      const store = useStore.getState();
      store.login({ email: 'demo@orvix.com', password: 'demo123' });
      store.logout();

      expect(useStore.getState().isLoggedIn).toBe(false);
      expect(useStore.getState().user).toBeNull();
    });

    it('обновляет город', () => {
      const store = useStore.getState();
      store.login({ email: 'demo@orvix.com', password: 'demo123' });
      store.updateCity('Москва');

      expect(useStore.getState().user?.city).toBe('Москва');
    });
  });

  // ========== ИНТЕГРАЦИОННЫЕ ==========
  describe('Интеграционные тесты', () => {
    it('корзина сохраняется между разными вызовами', () => {
      useStore.getState().addToCart(mockProduct);
      useStore.getState().addToCart(mockProduct2);

      const cartItems = useStore.getState().cartItems;
      expect(cartItems).toHaveLength(2);
    });

    it('избранное не затрагивает корзину', () => {
      useStore.getState().addToCart(mockProduct);
      useStore.getState().toggleFavorite(mockProduct);
      useStore.getState().clearCart();

      expect(useStore.getState().favoriteIds).toContain(1);
      expect(useStore.getState().cartItems).toHaveLength(0);
    });

    it('авторизация не влияет на корзину и избранное', () => {
      useStore.getState().addToCart(mockProduct);
      useStore.getState().toggleFavorite(mockProduct2);
      useStore
        .getState()
        .login({ email: 'demo@orvix.com', password: 'demo123' });

      expect(useStore.getState().cartItems).toHaveLength(1);
      expect(useStore.getState().favoriteIds).toContain(2);
      expect(useStore.getState().isLoggedIn).toBe(true);
    });

    it('логаут не очищает корзину и избранное', () => {
      useStore.getState().addToCart(mockProduct);
      useStore.getState().toggleFavorite(mockProduct);
      useStore
        .getState()
        .login({ email: 'demo@orvix.com', password: 'demo123' });
      useStore.getState().logout();

      expect(useStore.getState().cartItems).toHaveLength(1);
      expect(useStore.getState().favoriteIds).toContain(1);
      expect(useStore.getState().isLoggedIn).toBe(false);
    });
  });
});
