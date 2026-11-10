import React from 'react';
import { Sparkles, Shield, Zap, Flame, ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenCalculator: () => void;
  onQuickAdd: (product: Product) => void;
  popularProducts: Product[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToCatalog,
  onOpenCalculator,
  onQuickAdd,
  popularProducts,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-purple-500/30 bg-[#07020c]">
      {/* Dynamic Background Gradients & Runes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#0e0419]/90 to-[#07020c] pointer-events-none"></div>
      
      {/* Decorative Neon Sparks & Circles */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-20 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(168, 85, 247, 0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Mercado Oficial de MMORPG • Koliseu & Tibia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-fantasy tracking-tight leading-tight text-white">
              SEU MERCADO DE{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent gold-glow">
                GOLD
              </span>{' '}
              E{' '}
              <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent electric-glow">
                TIBIA COIN
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-purple-200/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Segurança, agilidade e as melhores taxas para sua jornada no Koliseu OT e Tibia. Entrega via Parcel ou Trade in-game com atendimento e finalização direta pelo WhatsApp oficial.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onScrollToCatalog}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-600 hover:from-purple-600 hover:to-fuchsia-600 border border-fuchsia-400/50 shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(232,121,249,0.8)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>COMPRAR AGORA</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-300" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl text-sm font-bold text-purple-200 hover:text-white bg-[#160826]/90 hover:bg-purple-950/80 border border-purple-500/40 hover:border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Simular Preço de Coins</span>
              </button>
            </div>

            {/* Guarantees row */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-purple-300/80 font-medium border-t border-purple-900/40">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp Oficial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Entrega em 5 Min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Estoque Atômico</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Suporte 24/7</span>
              </div>
            </div>

          </div>

          {/* Right Column: Fast-Track Quick Buy Widget */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#140824]/90 border-2 border-purple-500/40 p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-md">
              
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-purple-800/50 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-fantasy font-bold text-white text-base">
                      Mais Vendidos da Semana
                    </h3>
                    <p className="text-[11px] text-purple-400">
                      Adicione com 1 clique ao carrinho
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-fuchsia-950 text-fuchsia-300 px-2.5 py-1 rounded-md border border-fuchsia-800/40 animate-pulse">
                  Alta Demanda
                </span>
              </div>

              {/* Top 3 Quick Items */}
              <div className="space-y-3">
                {popularProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="group bg-[#0d0417] hover:bg-[#19092e] border border-purple-800/40 hover:border-fuchsia-400/60 rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-purple-950/60 border border-purple-700/50 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <Sparkles className="w-6 h-6 text-amber-400" />
                        )}
                        <span className="absolute bottom-0 right-0 bg-purple-900/90 text-[8px] font-bold text-amber-300 px-1 rounded-tl">
                          {prod.unit || 'Item'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-purple-400/90 mt-0.5">
                          <span className="text-emerald-400 font-semibold">
                            Estoque: {prod.stock.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span className="text-purple-300">
                            {prod.deliveryType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-extrabold text-amber-400 font-mono">
                        R$ {prod.price.toFixed(2)}
                      </div>
                      <button
                        onClick={() => onQuickAdd(prod)}
                        className="mt-1 text-[11px] font-bold bg-purple-800/60 hover:bg-purple-600 text-purple-200 hover:text-white px-2.5 py-1 rounded-lg border border-purple-500/40 transition-all cursor-pointer"
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Mini Banner */}
              <div className="mt-5 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs text-purple-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Cupom <strong className="text-amber-300">CAPANE10</strong> para 10% OFF</span>
                </div>
                <button
                  onClick={onScrollToCatalog}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  Ver Todos
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
