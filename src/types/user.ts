export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export interface User {
  email: string;
  password: string;
  name: string;
  avatar: string | null;
  phone: string;
  city: string;
  orders: Order[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}
