export type Category = "Lifestyle" | "Running" | "Basketball";

export interface ProductColor {
  /** Display name of the colorway, e.g. "Navy / Mint". */
  name: string;
  /** Primary swatch colour. */
  hex: string;
  /** Colour families used by the shop colour filter. */
  families: string[];
}

export interface Product {
  id: string;
  name: string;
  /** Colourway label shown after the model name. */
  colorway: string;
  brand: string;
  /** List price in USD. */
  price: number;
  category: Category;
  colors: ProductColor[];
  /** US sizes offered. */
  sizes: number[];
  /** Units available per US size (0 = sold out). Keys are sizes as strings. */
  stock: Record<string, number>;
  /** SAMPLE storefront data, not verified customer review data. */
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  isNew: boolean;
  /** Percent off list price (0 = no flash drop). */
  flashDropDiscount: number;
  /** Development note on how the model / colourway was identified. */
  verification: string;
}

export interface CartLine {
  /** Variant identity: productId|size|color */
  key: string;
  productId: string;
  size: number;
  color: string;
  quantity: number;
}

/** Item as sent to the checkout API. Prices are never sent by the client. */
export interface CheckoutItem {
  productId: string;
  size: number;
  color: string;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  email?: string;
}

export interface CheckoutResponse {
  url?: string;
  error?: string;
  details?: string[];
}

export type PaymentStatus = "paid" | "unpaid" | "no_payment_required" | "unknown";

export interface PaymentSessionInfo {
  id: string;
  status: PaymentStatus;
  amountTotal: number | null;
  currency: string | null;
  email: string | null;
}
