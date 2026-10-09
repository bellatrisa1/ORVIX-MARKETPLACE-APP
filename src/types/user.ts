export interface User {
  email: string;
  name: string;
  avatar: string | null;
  phone: string;
  city: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
