import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  ArrowUpDown, 
  Zap, 
  SlidersHorizontal,
  PackageX,
  RefreshCw
} from 'lucide-react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { PixCheckoutModal } from './components/PixCheckoutModal';
import { AdminModal } from './components/AdminModal';
import { CurrencyCalculatorModal } from './components/CurrencyCalculatorModal';
import { OrdersTrackerModal } from './components/OrdersTrackerModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { storeService } from './services/storeService';
import { CartItem, Category, Coupon, DashboardStats, Order, Product, User } from './types';

export default function App() {
  // --- Persistent & Dynamic State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => storeService.getCurrentUser());
  const [categories, setCategories] = useState<Category[]>(() => storeService.getCategories());
  const [products, setProducts] = useState<Product[]>(() => storeService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storeService.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => storeService.getCoupons());
  const [stats, setStats] = useState<DashboardStats>(() => storeService.getDashboardStats());

  // --- Filter and Search State ---
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // --- Cart State ---
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('capane_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [characterName, setCharacterName] = useState('Capane Warrior');
  const [serverName, setServerName] = useState('Koliseu OT (Midgard)');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // --- Modals State ---
  const [activePixOrder, setActivePixOrder] = useState<Order | null>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('capane_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const refreshData = () => {
    setProducts(storeService.getProducts());
    setCategories(storeService.getCategories());
    setOrders(storeService.getOrders());
    setCoupons(storeService.getCoupons());
    setStats(storeService.getDashboardStats());
  };

  // --- Cart Handlers ---
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const index = prev.findIndex(item => item.product.id === product.id);
      if (index >= 0) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[index].quantity + quantity);
        updated[index] = { ...updated[index], quantity: newQty };
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // --- Checkout Handlers ---
  const handleProceedToPix = async () => {
    if (cartItems.length === 0) return;
    setIsCreatingOrder(true);

    try {
      const order = await storeService.createOrder({
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        characterName,
        serverName,
        couponCode: appliedCoupon?.code,
        user: currentUser
      });

      // Clear cart on successful order generation
      setCartItems([]);
      setAppliedCoupon(null);
      setIsCartOpen(false);

      // Open PIX modal
      setActivePixOrder(order);
      setIsPixModalOpen(true);

      // Refresh data (stock reduced, new order in list)
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Erro ao processar checkout');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleSimulateWebhook = (orderId: number) => {
    const updated = storeService.simulateWebhookPaymentApproved(orderId);
    refreshData();
    if (activePixOrder?.id === orderId) {
      setActivePixOrder(updated);
    }
  };

  // --- User & Role Handlers ---
  const handleToggleAdminRole = () => {
    const updated = storeService.toggleAdminRole();
    setCurrentUser(updated);
  };

  const handleLogout = () => {
    storeService.setCurrentUser(null);
    setCurrentUser(null);
  };

  // --- Derived Calculations ---
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory && selectedCategory !== 'todos') {
      result = result.filter(p => p.categorySlug === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [products, selectedCategory, searchQuery, sortBy]);

  const popularProducts = useMemo(() => {
    return products.filter(p => p.isFeatured).slice(0, 3);
  }, [products]);

  const scrollToCatalog = () => {
    const el = document.getElementById('produtos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09030e] text-slate-100 selection:bg-purple-600 selection:text-white">
      
      {/* 1. Header with navigation & cart badge */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleAdminRole={handleToggleAdminRole}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          scrollToCatalog();
        }}
      />

      {/* 2. Hero Banner with electric fantasy atmosphere */}
      <HeroBanner
        onScrollToCatalog={scrollToCatalog}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onQuickAdd={(prod) => handleAddToCart(prod, 1)}
        popularProducts={popularProducts}
      />

      {/* 3. Category Filter Tabs */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          scrollToCatalog();
        }}
        products={products}
      />

      {/* 4. Products Arsenal Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full" id="produtos">
        
        {/* Section Header with Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-purple-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              <span>Estoque Imediato</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-fantasy font-black text-white mt-1 border-l-4 border-fuchsia-500 pl-3">
              Arsenal de Tesouros
            </h2>
            <p className="text-xs text-purple-300 mt-1">
              Mostrando {filteredProducts.length} itens disponíveis para entrega instantânea
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-300 font-semibold">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#140722] border border-purple-700/60 text-purple-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="featured">Destaques da Loja</option>
              <option value="price-asc">Menor Preço (R$)</option>
              <option value="price-desc">Maior Preço (R$)</option>
              <option value="name">Nome (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#12071f]/60 border border-purple-900/60 rounded-2xl p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-800/40 mx-auto flex items-center justify-center text-purple-400">
              <PackageX className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-fantasy text-xl font-bold text-white">
              Nenhum tesouro encontrado
            </h3>
            <p className="text-xs text-purple-300/70 max-w-sm mx-auto">
              Não encontramos nenhum item para os filtros selecionados. Tente buscar por outros termos ou redefinir a categoria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-800 hover:bg-purple-700 text-white cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ver Todos os Itens</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}

      </main>

      {/* 5. Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
      />

      {/* 6. Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* 7. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        characterName={characterName}
        setCharacterName={setCharacterName}
        serverName={serverName}
        setServerName={setServerName}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        onProceedToPix={handleProceedToPix}
        isLoading={isCreatingOrder}
      />

      {/* 8. Pix Checkout & QR Code Modal */}
      <PixCheckoutModal
        order={activePixOrder}
        onClose={() => setIsPixModalOpen(false)}
        onSimulateWebhookApproval={handleSimulateWebhook}
        onOpenTracker={() => {
          setIsPixModalOpen(false);
          setIsTrackerModalOpen(true);
        }}
      />

      {/* 9. Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        categories={categories}
        products={products}
        orders={orders}
        coupons={coupons}
        stats={stats}
        onRefreshData={refreshData}
      />

      {/* 10. Currency Calculator Modal */}
      <CurrencyCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        onAddToCartWithCustom={handleAddToCart}
        products={products}
      />

      {/* 11. Orders Tracker Modal */}
      <OrdersTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        orders={orders}
        onOpenPixModal={(order) => {
          setActivePixOrder(order);
          setIsTrackerModalOpen(false);
          setIsPixModalOpen(true);
        }}
      />

      {/* 12. Auth & Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshData();
        }}
      />

    </div>
  );
}
