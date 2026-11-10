import React, { useState } from 'react';
import { ShoppingCart, Check, Zap, Sparkles, Box, ShieldCheck, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleBuy = () => {
    onBuyNow(product, quantity);
  };

  const getRarityBadge = (rarity?: Product['rarity']) => {
    switch (rarity) {
      case 'Mítico':
        return (
          <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.6)]">
            Mítico
          </span>
        );
      case 'Lendário':
        return (
          <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-purple-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.6)]">
            Lendário
          </span>
        );
      case 'Épico':
        return (
          <span className="bg-purple-800 text-purple-100 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-purple-500/50">
            Épico
          </span>
        );
      case 'Raro':
        return (
          <span className="bg-blue-900/90 text-blue-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-blue-600/50">
            Raro
          </span>
        );
      default:
        return (
          <span className="bg-zinc-800 text-zinc-300 text-[10px] font-medium uppercase px-2 py-0.5 rounded">
            Comum
          </span>
        );
    }
  };

  const getStockColor = (stock: number) => {
    if (stock <= 5) return 'text-rose-400 bg-rose-950/60 border-rose-800/60 animate-pulse';
    if (stock <= 20) return 'text-amber-400 bg-amber-950/50 border-amber-800/50';
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
  };

  return (
    <div className="group relative bg-[#130720] hover:bg-[#190a2a] border border-purple-500/30 hover:border-amber-400/80 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:-translate-y-1">
      
      {/* Top Banner & Image Preview */}
      <div className="relative h-48 w-full bg-[#1b0a2e] overflow-hidden flex items-center justify-center">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#130720] via-transparent to-transparent z-10 pointer-events-none"></div>

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-amber-400">
            <Sparkles className="w-16 h-16 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
          </div>
        )}

        {/* Rarity & Delivery Badges Floating Top */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          {getRarityBadge(product.rarity)}
          {product.deliveryType && (
            <span className="bg-black/70 backdrop-blur-sm border border-purple-500/40 text-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              {product.deliveryType}
            </span>
          )}
        </div>

        {/* Category Pill Floating Top Right */}
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-purple-950/80 backdrop-blur-sm border border-purple-600/40 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">
            {product.categoryName}
          </span>
        </div>

        {/* Unit watermark */}
        {product.unit && (
          <div className="absolute bottom-2 right-3 z-20 text-[11px] font-tech font-bold text-amber-300/80 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
            {product.unit}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Stock status indicator */}
          <div className="flex items-center justify-between mb-1.5">
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${getStockColor(product.stock)}`}>
              <Box className="w-3 h-3" />
              <span>
                {product.stock <= 5
                  ? `Restam apenas ${product.stock} un!`
                  : `Estoque: ${product.stock.toLocaleString()} un`}
              </span>
            </div>

            <span className="text-[11px] text-purple-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verificado
            </span>
          </div>

          {/* Title */}
          <h3 className="font-fantasy font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-purple-300/70 mt-2 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-3 border-t border-purple-900/50 space-y-3">
          
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-purple-400 uppercase font-semibold">
              Preço Unitário:
            </span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 gold-glow">
                R$ {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Quantity selector and Add buttons */}
          <div className="flex items-center gap-2">
            {/* Quantity Controls */}
            <div className="flex items-center border border-purple-700/60 rounded-xl bg-[#0b0314] overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-2.5 py-1.5 text-purple-300 hover:text-white hover:bg-purple-900/50 text-xs font-bold transition-colors cursor-pointer"
                title="Diminuir"
              >
                -
              </button>
              <span className="px-2.5 py-1.5 text-xs font-mono font-bold text-white min-w-[28px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="px-2.5 py-1.5 text-purple-300 hover:text-white hover:bg-purple-900/50 text-xs font-bold transition-colors cursor-pointer"
                title="Aumentar"
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                addedAnimation
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-gradient-to-r from-purple-800 to-fuchsia-800 hover:from-purple-700 hover:to-fuchsia-700 border-fuchsia-500/40 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                  <span>Adicionar</span>
                </>
              )}
            </button>
          </div>

          {/* Buy Now Direct Button */}
          <button
            onClick={handleBuy}
            disabled={product.stock <= 0}
            className="w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase bg-[#180928] hover:bg-emerald-600 hover:text-white border border-emerald-500/50 text-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white fill-emerald-400/20" />
            <span>Comprar no WhatsApp</span>
          </button>

        </div>

      </div>

    </div>
  );
};
