import React from 'react';
import { 
  Coins, 
  Gem, 
  Shield, 
  Crown, 
  Sparkles, 
  Award, 
  ArrowUpCircle, 
  Box, 
  LayoutGrid 
} from 'lucide-react';
import { Category, Product } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  products: Product[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products,
}) => {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'gold-coin':
        return <Coins className="w-5 h-5 text-amber-400" />;
      case 'tibia-coin':
        return <Gem className="w-5 h-5 text-fuchsia-400" />;
      case 'sets':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'relikias':
        return <Crown className="w-5 h-5 text-yellow-300" />;
      case 'gemas':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'badges-de-skills':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'upgrade-tier':
        return <ArrowUpCircle className="w-5 h-5 text-cyan-400" />;
      case 'minerais':
        return <Box className="w-5 h-5 text-amber-600" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-purple-400" />;
    }
  };

  const getCount = (slug: string) => {
    if (slug === 'todos') return products.length;
    return products.filter(p => p.categorySlug === slug).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="categorias">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Navegação Rápida</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-fantasy font-black text-white mt-1 border-l-4 border-purple-500 pl-3">
            Categorias Mágicas
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-purple-300/80 max-w-md">
          Selecione a categoria de itens para turbinar seu char com entrega instantânea no servidor.
        </p>
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3">
        {/* All Products option */}
        <button
          onClick={() => onSelectCategory('todos')}
          className={`group flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center cursor-pointer ${
            selectedCategory === 'todos'
              ? 'bg-gradient-to-b from-purple-900/80 to-[#1d0a33] border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.4)] scale-105'
              : 'bg-[#12071f]/80 hover:bg-[#1a0a2d] border-purple-900/60 hover:border-purple-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-purple-950/70 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <LayoutGrid className="w-5 h-5 text-purple-300" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
            Todos
          </span>
          <span className="text-[10px] text-purple-400 mt-0.5">
            ({getCount('todos')})
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = getCount(cat.slug);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-900/90 to-[#1f0b36] border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.4)] scale-105'
                  : 'bg-[#12071f]/80 hover:bg-[#1a0a2d] border-purple-900/60 hover:border-purple-500/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-purple-950/70 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {getIcon(cat.slug)}
              </div>
              <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-purple-400 mt-0.5">
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
