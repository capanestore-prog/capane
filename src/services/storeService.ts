import { INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_PRODUCTS } from '../data/initialData';
import { Category, Coupon, DashboardStats, Order, OrderItem, Product, User } from '../types';

const STORAGE_KEYS = {
  CATEGORIES: 'capane_categories_v1',
  PRODUCTS: 'capane_products_v1',
  COUPONS: 'capane_coupons_v1',
  ORDERS: 'capane_orders_v1',
  USER: 'capane_user_v1',
  TOKEN: 'capane_token_v1'
};

const WHATSAPP_PHONE = '5561999287524';

export function buildWhatsAppOrderUrl(order: Order): string {
  const itemsText = order.items
    .map(i => `• ${i.quantity}x ${i.productName} (R$ ${(i.unitPrice * i.quantity).toFixed(2)})`)
    .join('\n');

  const discountText = order.discountAmount > 0
    ? `\n*Desconto:* R$ ${order.discountAmount.toFixed(2)} (${order.couponCode || 'Cupom'})`
    : '';

  const message = `⚔️ *NOVO PEDIDO - CAPANE STORE* ⚔️
*Pedido:* #${order.id}
*Personagem:* ${order.characterName}
*Servidor:* ${order.serverName}
----------------------------------------
*Itens do Pedido:*
${itemsText}
----------------------------------------
*Subtotal:* R$ ${order.subtotal.toFixed(2)}${discountText}
*Total a Pagar:* R$ ${order.totalAmount.toFixed(2)}
----------------------------------------
Olá! Acabei de gerar meu pedido na Capane Store e gostaria de combinar o pagamento e a entrega dos meus itens no jogo!`;

  return `https://api.whatsapp.com/send/?phone=5561999287524&text&type=phone_number&app_absent=0`;
}

class StoreService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage ${key}`, e);
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage ${key}`, e);
    }
  }

  // --- Auth & User ---
  getCurrentUser(): User | null {
    return this.getStorage<User | null>(STORAGE_KEYS.USER, {
      id: 99,
      name: 'Guerreiro de Koliseu',
      email: 'capanestore@gmail.com',
      isAdmin: true,
      createdAt: new Date().toISOString()
    });
  }

  setCurrentUser(user: User | null): void {
    this.setStorage(STORAGE_KEYS.USER, user);
    if (user) {
      this.setStorage(STORAGE_KEYS.TOKEN, `token_${user.id}_${Date.now()}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }

  toggleAdminRole(): User | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated: User = { ...current, isAdmin: !current.isAdmin };
    this.setCurrentUser(updated);
    return updated;
  }

  // --- Categories ---
  getCategories(): Category[] {
    return this.getStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  // --- Products ---
  getProducts(categorySlug?: string, search?: string): Product[] {
    const categories = this.getCategories();
    let products = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    products = products.map(p => {
      const cat = categories.find(c => c.id === p.categoryId);
      return {
        ...p,
        categoryName: cat?.name || 'Geral',
        categorySlug: cat?.slug || 'geral'
      };
    });

    if (categorySlug && categorySlug !== 'todos') {
      products = products.filter(p => p.categorySlug === categorySlug);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    return products;
  }

  getProductById(id: number): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  }

  saveProduct(productData: Partial<Product>): Product {
    const products = this.getProducts();
    const categories = this.getCategories();

    if (productData.id) {
      const index = products.findIndex(p => p.id === productData.id);
      if (index === -1) throw new Error('Produto não encontrado');
      
      const updated: Product = {
        ...products[index],
        ...productData
      } as Product;
      products[index] = updated;
      this.setStorage(STORAGE_KEYS.PRODUCTS, products);
      return updated;
    } else {
      const cat = categories.find(c => c.id === productData.categoryId) || categories[0];
      const newProduct: Product = {
        id: Date.now(),
        categoryId: cat.id,
        categoryName: cat.name,
        categorySlug: cat.slug,
        name: productData.name || 'Novo Tesouro',
        slug: (productData.name || 'item').toLowerCase().replace(/\s+/g, '-'),
        description: productData.description || 'Item de alta raridade para sua jornada.',
        price: Number(productData.price) || 10,
        stock: Number(productData.stock) || 100,
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        isFeatured: Boolean(productData.isFeatured),
        rarity: productData.rarity || 'Raro',
        deliveryType: productData.deliveryType || 'Até 5 min',
        unit: productData.unit || 'Unidade',
        createdAt: new Date().toISOString()
      };
      products.unshift(newProduct);
      this.setStorage(STORAGE_KEYS.PRODUCTS, products);
      return newProduct;
    }
  }

  deleteProduct(id: number): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.setStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  // --- Coupons ---
  getCoupons(): Coupon[] {
    return this.getStorage<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  validateCoupon(code: string, currentTotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    if (!code || !code.trim()) {
      return { valid: false, discount: 0, message: 'Digite um cupom' };
    }
    const coupons = this.getCoupons();
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Cupom inválido ou inexistente' };
    }

    if (coupon.usesLeft <= 0) {
      return { valid: false, discount: 0, message: 'Este cupom atingiu o limite de usos' };
    }

    if (coupon.minOrderValue && currentTotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Pedido mínimo para este cupom é de R$ ${coupon.minOrderValue.toFixed(2)}`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (currentTotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, currentTotal);

    return {
      valid: true,
      coupon,
      discount,
      message: `Cupom ${coupon.code} aplicado: -R$ ${discount.toFixed(2)}`
    };
  }

  addCoupon(coupon: Omit<Coupon, 'id'>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now(),
      code: coupon.code.toUpperCase().trim()
    };
    coupons.unshift(newCoupon);
    this.setStorage(STORAGE_KEYS.COUPONS, coupons);
    return newCoupon;
  }

  // --- Orders & WhatsApp ---
  getOrders(): Order[] {
    return this.getStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  getOrderById(id: number): Order | undefined {
    return this.getOrders().find(o => o.id === id);
  }

  async createOrder(params: {
    items: { productId: number; quantity: number }[];
    characterName: string;
    serverName: string;
    couponCode?: string;
    user?: User | null;
  }): Promise<Order> {
    const { items, characterName, serverName, couponCode, user } = params;
    const allProducts = this.getProducts();

    if (!items || items.length === 0) {
      throw new Error('O carrinho está vazio');
    }
    if (!characterName.trim()) {
      throw new Error('Informe o nome do personagem para entrega');
    }
    if (!serverName.trim()) {
      throw new Error('Informe o servidor para entrega');
    }

    let subtotal = 0;
    const processedItems: OrderItem[] = [];

    // Verify stock and calculate subtotal
    for (const item of items) {
      const prod = allProducts.find(p => p.id === item.productId);
      if (!prod) {
        throw new Error(`Item com ID ${item.productId} não encontrado`);
      }
      if (prod.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${prod.name}. Disponível: ${prod.stock}`);
      }
      const itemSubtotal = prod.price * item.quantity;
      subtotal += itemSubtotal;

      processedItems.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        orderId: 0,
        productId: prod.id,
        productName: prod.name,
        productPrice: prod.price,
        quantity: item.quantity,
        unitPrice: prod.price
      });
    }

    // Process coupon
    let discountAmount = 0;
    if (couponCode) {
      const couponCheck = this.validateCoupon(couponCode, subtotal);
      if (couponCheck.valid && couponCheck.coupon) {
        discountAmount = couponCheck.discount;
        const coupons = this.getCoupons();
        const cp = coupons.find(c => c.id === couponCheck.coupon!.id);
        if (cp) {
          cp.usesLeft = Math.max(0, cp.usesLeft - 1);
          this.setStorage(STORAGE_KEYS.COUPONS, coupons);
        }
      }
    }

    const totalAmount = Math.max(0.50, Number((subtotal - discountAmount).toFixed(2)));
    const orderId = Math.floor(100000 + Math.random() * 900000);

    // Atomic stock reduction
    const updatedProducts = allProducts.map(prod => {
      const ordered = items.find(i => i.productId === prod.id);
      if (ordered) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - ordered.quantity)
        };
      }
      return prod;
    });
    this.setStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

    const tempOrder: Order = {
      id: orderId,
      userId: user?.id,
      userName: user?.name || characterName,
      userEmail: user?.email || 'cliente@capanestore.com',
      characterName: characterName.trim(),
      serverName: serverName.trim(),
      subtotal,
      discountAmount,
      couponCode: couponCode || undefined,
      totalAmount,
      status: 'Aguardando no WhatsApp',
      createdAt: new Date().toISOString(),
      whatsappUrl: '',
      items: processedItems.map(item => ({ ...item, orderId }))
    };

    // Build the dynamic WhatsApp URL
    tempOrder.whatsappUrl = buildWhatsAppOrderUrl(tempOrder);

    const orders = this.getOrders();
    orders.unshift(tempOrder);
    this.setStorage(STORAGE_KEYS.ORDERS, orders);

    return tempOrder;
  }

  // Update order status (WhatsApp confirmation, delivery or cancellation)
  updateOrderStatus(orderId: number, newStatus: Order['status']): Order {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Pedido não encontrado');

    const previousStatus = orders[index].status;
    orders[index] = {
      ...orders[index],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    // If order was canceled, restore stock
    if (newStatus === 'Cancelado' && previousStatus !== 'Cancelado') {
      const products = this.getProducts();
      orders[index].items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
        }
      });
      this.setStorage(STORAGE_KEYS.PRODUCTS, products);
    }

    this.setStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  }

  // --- Dashboard Stats ---
  getDashboardStats(): DashboardStats {
    const orders = this.getOrders();
    const products = this.getProducts();

    const todayStr = new Date().toISOString().split('T')[0];

    const approvedOrDelivered = orders.filter(
      o => o.status === 'Pagamento confirmado' || o.status === 'Entregue'
    );

    const faturamentoTotal = approvedOrDelivered.reduce((sum, o) => sum + o.totalAmount, 0);

    const vendasHoje = approvedOrDelivered
      .filter(o => o.createdAt.startsWith(todayStr))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pedidosPendentes = orders.filter(o => o.status === 'Aguardando no WhatsApp').length;
    const pedidosConcluidos = orders.filter(o => o.status === 'Entregue').length;

    const produtosEstoqueBaixo = products.filter(p => p.stock <= 10);

    return {
      faturamentoTotal,
      vendasHoje,
      pedidosPendentes,
      pedidosConcluidos,
      produtosEstoqueBaixo,
      totalProdutos: products.length,
      totalClientes: new Set(orders.map(o => o.userEmail)).size
    };
  }

  // Reset to default sample state
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
  }
}

export const storeService = new StoreService();
