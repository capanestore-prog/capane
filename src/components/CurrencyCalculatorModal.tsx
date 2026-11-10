import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface CurrencyCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCartWithCustom: (product: Product, quantity: number) => void;
  products: Product[];
}

export const CurrencyCalculatorModal: React.FC<CurrencyCalculatorModalProps> = ({
  isOpen,
  onClose,
  onAddToCartWithCustom,
  products,
}) => {
  const [tab, setTab] = useState<'tc' | 'gold'>('tc');
  const [tcAmount, setTcAmount] = useState<number>(250);
  const [goldAmountKk, setGoldAmountKk] = useState<number>(10);

  if (!isOpen) return null;

  // Pricing formula
  // Tibia Coins: ~0.195 per TC, with bonus rates
  const getTcPrice = (amount: number) => {
    let rate = 0.20;
    if (amount >= 5000) rate = 0.1798;
    else if (amount >= 1000) rate = 0.1899;
    else if (amount >= 500) rate = 0.195;
    return (amount * rate);
  };

  // Gold Coins: ~3.50 per kk, with bonus rates
  const getGoldPrice = (kk: number) => {
    let rate = 3.50;
    if (kk >= 100) rate = 3.10;
    else if (kk >= 50) rate = 3.30;
    return (kk * rate);
  };

  const handleAddTcToCart = () => {
    // find matching TC product or closest
    const tcProd = products.find(p => p.categoryId === 2) || products[0];
    onAddToCartWithCustom(tcProd, Math.max(1, Math.round(tcAmount / 250)));
    onClose();
  };

  const handleAddGoldToCart = () => {
    const goldProd = products.find(p => p.categoryId === 1) || products[3];
    onAddToCartWithCustom(goldProd, Math.max(1, Math.round(goldAmountKk / 10)));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative bg-[#130720] border-2 border-purple-500/50 rounded-2xl w-full max-w-lg p-6 shadow-[0_0_40px_rgba(168,85,247,0.4)] z-10 text-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-purple-900/50 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-fantasy font-black text-white text-lg">
                Calculadora de Moedas
              </h3>
              <p className="text-xs text-purple-400">
                Simule a quantidade exata de TC ou Gold necessária para sua hunt.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setTab('tc')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              tab === 'tc'
                ? 'bg-purple-800 border-amber-400 text-amber-300 shadow-md'
                : 'bg-[#0d0417] border-purple-900 text-purple-300 hover:border-purple-600'
            }`}
          >
            Tibia Coins (TC)
          </button>

          <button
            onClick={() => setTab('gold')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              tab === 'gold'
                ? 'bg-purple-800 border-amber-400 text-amber-300 shadow-md'
                : 'bg-[#0d0417] border-purple-900 text-purple-300 hover:border-purple-600'
            }`}
          >
            Gold Coins (kk)
          </button>
        </div>

        {/* Tab 1: Tibia Coins */}
        {tab === 'tc' && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-purple-300 mb-2">
                <span>Quantidade de Tibia Coins:</span>
                <span className="font-bold text-amber-400 font-mono text-sm">{tcAmount} TC</span>
              </div>
              <input
                type="range"
                min="250"
                max="10000"
                step="250"
                value={tcAmount}
                onChange={(e) => setTcAmount(Number(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-purple-400 mt-1">
                <span>250 TC</span>
                <span>2.500 TC</span>
                <span>5.000 TC</span>
                <span>10.000 TC</span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-2">
              {[250, 500, 1000, 2500, 5000].map(val => (
                <button
                  key={val}
                  onClick={() => setTcAmount(val)}
                  className={`text-xs px-2.5 py-1 rounded-lg border ${
                    tcAmount === val
                      ? 'bg-purple-700 border-amber-400 text-amber-300 font-bold'
                      : 'bg-[#0d0417] border-purple-900 text-purple-300'
                  }`}
                >
                  {val} TC
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="p-4 bg-[#19092b] border border-purple-700/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-300 block">Total Estimado no PIX:</span>
                <span className="text-2xl font-black font-mono text-amber-400 gold-glow">
                  R$ {getTcPrice(tcAmount).toFixed(2)}
                </span>
                <p className="text-[10px] text-emerald-400 mt-0.5">
                  ✓ Desconto progressivo aplicado
                </p>
              </div>

              <button
                onClick={handleAddTcToCart}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Gold Coins */}
        {tab === 'gold' && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-purple-300 mb-2">
                <span>Quantidade em Milhões (kk):</span>
                <span className="font-bold text-amber-400 font-mono text-sm">{goldAmountKk}kk ({goldAmountKk * 1000000} gps)</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={goldAmountKk}
                onChange={(e) => setGoldAmountKk(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-purple-400 mt-1">
                <span>10kk</span>
                <span>50kk</span>
                <span>100kk</span>
                <span>200kk</span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-2">
              {[10, 20, 50, 100, 200].map(val => (
                <button
                  key={val}
                  onClick={() => setGoldAmountKk(val)}
                  className={`text-xs px-2.5 py-1 rounded-lg border ${
                    goldAmountKk === val
                      ? 'bg-purple-700 border-amber-400 text-amber-300 font-bold'
                      : 'bg-[#0d0417] border-purple-900 text-purple-300'
                  }`}
                >
                  {val}kk
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="p-4 bg-[#19092b] border border-purple-700/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-300 block">Total Estimado no PIX:</span>
                <span className="text-2xl font-black font-mono text-amber-400 gold-glow">
                  R$ {getGoldPrice(goldAmountKk).toFixed(2)}
                </span>
                <p className="text-[10px] text-emerald-400 mt-0.5">
                  ✓ Entrega via Parcel segura
                </p>
              </div>

              <button
                onClick={handleAddGoldToCart}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
