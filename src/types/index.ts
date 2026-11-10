export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

export interface Product {
  id: number;
  categoryId: number;
  categorySlug?: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isFeatured?: boolean;
  rarity?: 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico';
  deliveryType?: 'Instantâneo' | 'Até 5 min' | 'Sob Encomenda';
  unit?: string; // e.g. "Coins", "kk", "Unidade", "Tier"
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usesLeft: number;
  minOrderValue?: number;
  expiresAt?: string;
}

export type OrderStatus = 'Aguardando no WhatsApp' | 'Pagamento confirmado' | 'Entregue' | 'Cancelado';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId?: number;
  userEmail: string;
  userName: string;
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  status: OrderStatus;
  characterName: string;
  serverName: string;
  whatsappUrl: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  faturamentoTotal: number;
  vendasHoje: number;
  pedidosPendentes: number;
  pedidosConcluidos: number;
  produtosEstoqueBaixo: Product[];
  totalProdutos: number;
  totalClientes: number;
}
