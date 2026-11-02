export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  category_id: string | null;
  stock: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  sku: string | null;
  created_at: string;
  categories?: Category | null;
};

export type Order = {
  id: string;
  email: string;
  full_name: string;
  shipping_address: string;
  city: string;
  zip_code: string;
  country: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  status: string;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  created_at: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export type CheckoutForm = {
  email: string;
  full_name: string;
  shipping_address: string;
  city: string;
  zip_code: string;
  country: string;
};
