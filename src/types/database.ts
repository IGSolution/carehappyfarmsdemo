
export type UserRole = 'farmer' | 'customer'|'admin';
export type LocationType = 'lagos' | 'abuja' | 'kano' | 'ibadan' | 'port_harcourt' | 'kaduna' | 'benin' | 'maiduguri' | 'zaria' | 'aba' | 'jos' | 'ilorin';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  location?: LocationType;
  is_verified: boolean;
  verification_code?: string;
  verification_code_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  admin_id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  category: string;
  image_url?: string;
  stock_quantity?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  delivery_location: LocationType;
  delivery_address: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  admin_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  product?: Product;
}

export interface AdminInvitation {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}
