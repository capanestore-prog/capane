import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Minus,
  CheckCircle2,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { storeService } from '../services/storeService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  characterName: string;
  setCharacterName: (name: string) => void;
  serverName: string;
  setServerName: (server: string) => void;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  /** Propriedade legada mantida para compatibilidade com quem renderiza o carrinho. */
  onProceedToWhatsApp?: () => void;
  isLoading?: boolean;
}

const WHATSAPP_NUMBER = '5561999287524';
const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const POPULAR_SERVERS = [
  'Koliseu OT (Midgard)',
  'Koliseu OT (Asgard)',
  'Global (Antica)',
  'Global (Pacera)',
  'Global (Belobra)',
  'Global (Secura)'
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  characterName,
  setCharacterName,
  serverName,
  setServerName,
  appliedCoupon,
  setAppliedCoupon,
  isLoading = false,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: ''
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
    discount = Math.min(discount, subtotal);
  }

  const total = Math.max(0.5, subtotal - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const result = storeService.validateCoupon(couponInput, subtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponFeedback({ type: 'success', message: result.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponFeedback({ type: '', message: '' });
  };

  const handleProceedToWhatsApp = () => {
    // Redirecionamento síncrono no clique: evita bloqueadores de pop-up.
    if (isLoading || cartItems.length === 0 || !characterName.trim() || !serverName.trim()) {
      return;
    }

    const orderLines = cartItems.map((item) =>
      `• ${item.product.name} | Qtd: ${item.quantity} | ${formatBRL(item.product.price * item.quantity)}`
    );
    const message = [
      '*Olá! Gostaria de finalizar meu pedido.*',
      '',
      '*Produtos:*',
      ...orderLines,
      '',
      `*Personagem:* ${characterName.trim()}`,
      `*Servidor:* ${serverName.trim()}`,
      `*Subtotal:* ${formatBRL(subtotal)}`,
      ...(appliedCoupon ? [
        `*Cupom:* ${appliedCoupon.code}`,
        `*Desconto:* -${formatBRL(discount)}`,
      ] : []),
      `*Total:* ${formatBRL(total)}`,
    ].join('\n');

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5561999287524&text&type=phone_number&app_absent=0`;
    window.location.assign(whatsappUrl);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#11061c] border-l-2 border-purple-500/40 shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-purple-900/50 bg-[#160826] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-fuchsia-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-fantasy font-black text-white text-lg">
                  Carrinho de Tesouros
                </h3>
                <p className="text-xs text-purple-400">
                  {cartItems.length} {cartItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-purple-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-800/40 mx-auto flex items-center justify-center text-purple-400">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-fantasy text-lg font-bold text-white">
                  Seu baú está vazio!
                </h4>
                <p className="text-xs text-purple-300/70 max-w-xs mx-auto">
                  Explore nosso arsenal de Tibia Coins, Gold Coins e equipamentos mágicos para preencher seu carrinho.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white transition-all shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explorar Loja</span>
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-purple-300 border-b border-purple-900/40 pb-2">
                    <span>Itens do Pedido</span>
                    <button
                      onClick={onClearCart}
                      className="text-rose-400 hover:text-rose-300 text-[11px] underline cursor-pointer"
                    >
                      Limpar carrinho
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-[#170928] border border-purple-900/60 rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-purple-950/80 border border-purple-800/50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Sparkles className="w-5 h-5 text-amber-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                          R$ {item.product.price.toFixed(2)} cada
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-purple-700/60 rounded-lg bg-[#0b0314] overflow-hidden">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-purple-300 hover:text-white text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-0.5 text-xs font-mono font-bold text-white min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                              className="px-2 py-0.5 text-purple-300 hover:text-white text-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-[11px] text-purple-300 font-bold ml-auto font-mono">
                            Subtotal: R$ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-purple-400 hover:text-rose-400 p-1.5 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* In-Game Character & Server Details */}
                <div className="bg-[#160826] border border-purple-800/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Dados de Entrega no Jogo</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                      Nome do Personagem (Character Name) *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Capane Warrior"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="w-full bg-[#0d0417] border border-purple-600/40 rounded-lg px-3 py-2 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                      Servidor de Destino *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Koliseu OT (Midgard) ou Global (Antica)"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      className="w-full bg-[#0d0417] border border-purple-600/40 rounded-lg px-3 py-2 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                    />
                    
                    {/* Quick server chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {POPULAR_SERVERS.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => setServerName(srv)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                            serverName === srv
                              ? 'bg-purple-800 border-amber-400 text-amber-300 font-bold'
                              : 'bg-[#0d0417] border-purple-900 text-purple-300 hover:border-purple-600'
                          }`}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="bg-[#160826] border border-purple-800/40 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      Cupom de Desconto
                    </span>
                    <span className="text-[10px] text-purple-400 font-normal">
                      Ex: CAPANE10
                    </span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-950/50 border border-emerald-600/50 rounded-lg px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Cupom <strong>{appliedCoupon.code}</strong> ativo</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-rose-400 hover:text-rose-300 underline"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Insira o código do cupom"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#0d0417] border border-purple-600/40 rounded-lg px-3 py-1.5 text-xs text-white uppercase placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-purple-500/40"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}

                  {couponFeedback.message && (
                    <p className={`text-[11px] ${couponFeedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {couponFeedback.message}
                    </p>
                  )}
                </div>

                {/* Delivery Notice */}
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300/90">
                  <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 fill-emerald-400/20" />
                  <p className="text-[11px] leading-relaxed">
                    Sua compra é direcionada para o nosso <strong>WhatsApp oficial ('61 99928-7524')</strong>. Por lá, combinamos o pagamento e a entrega in-game via <strong>Parcel</strong> ou <strong>Trade</strong>.
                  </p>
                </div>
              </>
            )}

          </div>

          {/* Footer & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-purple-900/60 bg-[#160826] space-y-4">
              
              {/* Financial Summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-purple-300">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">R$ {subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Desconto ({appliedCoupon?.code}):</span>
                    <span className="font-mono">- R$ {discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-purple-900/50">
                  <span>Total a Pagar:</span>
                  <span className="font-mono text-xl text-amber-400 gold-glow">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Checkout Button (WhatsApp Direct) */}
              <button
                type="button"
                onClick={handleProceedToWhatsApp}
                disabled={isLoading || !characterName.trim() || !serverName.trim()}
                className="w-full py-4 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span>Preparando Pedido no WhatsApp...</span>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>FINALIZAR NO WHATSAPP</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200" />
                  </>
                )}
              </button>

              {(!characterName.trim() || !serverName.trim()) && (
                <p className="text-[11px] text-amber-400/90 text-center">
                  * Preencha o Nome do Personagem e Servidor para habilitar a compra
                </p>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};