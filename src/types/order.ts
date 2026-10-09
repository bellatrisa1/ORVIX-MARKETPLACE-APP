import type { MarketplaceProduct } from './api';

export interface CartItem extends MarketplaceProduct {
  cartQuantity: number;
}

export interface CheckoutDetails {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  apartment: string;
  delivery: 'courier' | 'pickup';
  payment: 'card' | 'cash';
  comment: string;
}

export interface DemoOrder {
  id: string;
  date: string;
  status: 'Демонстрационный';
  currency: 'USD';
  total: number;
  items: {
    productId: number;
    title: string;
    quantity: number;
    price: number;
  }[];
  details: CheckoutDetails;
}
