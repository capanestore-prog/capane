import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldAlert, 
  User as UserIcon, 
  Search, 
  Calculator, 
  Truck, 
  Coins, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenCalculator: () => void;
  onOpenTracker: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onToggleAdminRole: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectCategory: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAdmin,
  onOpenAuth,
  onOpenCalculator,
  onOpenTracker,
  currentUser,
  onLogout,
  onToggleAdminRole,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#09030e]/95 backdrop-blur-md border-b border-purple-500/30 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-purple-950 via-fuchsia-950 to-indigo-950 px-4 py-1.5 text-xs text-purple-200 border-b border-purple-900/50 flex justify-between items-center overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4 mx-auto max-w-7xl w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">SERVIDORES ONLINE:</span>
            <span>Koliseu OT & Tibia Global • Entrega via Parcel em até 5 minutos após pedido no WhatsApp</span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-purple-300">
            <button 
              onClick={onOpenCalculator} 
              className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>Calculadora de Coins</span>
            </button>
            <button 
              onClick={onOpenTracker} 
              className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Rastrear Pedido</span>
            </button>
            <span className="text-purple-600">|</span>
            <a 
              href="https://api.whatsapp.com/send/?phone=5561999287524&text=Ol%C3%A1%2C%20gostaria%20de%20atendimento%20na%20Capane%20Store!&type=phone_number&app_absent=0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>WhatsApp: (61) 99928-7524</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              onSelectCategory('todos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-700 via-fuchsia-800 to-indigo-900 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_25px_rgba(232,121,249,0.7)] transition-all">
              <div className="w-full h-full bg-[#0d0517] rounded-[10px] flex items-center justify-center">
                {/* Stylized Fantasy Dragon / Crest */}
                <span className="text-2xl group-hover:scale-110 transition-transform">🐉</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-fantasy font-black text-2xl tracking-wider bg-gradient-to-r from-amber-200 via-fuchsia-200 to-purple-300 bg-clip-text text-transparent electric-glow">
                  CAPANE
                </span>
                <span className="font-fantasy font-bold text-lg text-amber-400 tracking-widest">
                  STORE
                </span>
              </div>
              <p className="text-[10px] uppercase font-tech tracking-wider text-purple-400/80 -mt-1">
                Koliseu & Tibia Marketplace
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/60" />
              <input
                type="text"
                placeholder="Buscar Tibia Coins, Gold, Sets, Relíquias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#130720]/80 border border-purple-500/30 rounded-xl pl-10 pr-4 py-2 text-sm text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Shortcuts */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => onSelectCategory('tibia-coin')}
              className="text-purple-200 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              Tibia Coin
            </button>
            <button
              onClick={() => onSelectCategory('gold-coin')}
              className="text-purple-200 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Gold Coin
            </button>
            <button
              onClick={() => onSelectCategory('sets')}
              className="text-purple-200 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Sets & Armas
            </button>
            <button
              onClick={() => onSelectCategory('relikias')}
              className="text-purple-200 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Relíquias
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdmin}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all border ${
                currentUser?.isAdmin
                  ? 'bg-purple-900/40 hover:bg-purple-800/60 border-purple-500/50 text-purple-200 hover:text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-[#180928] hover:bg-purple-950 border-purple-800/40 text-purple-300'
              }`}
              title="Painel Administrativo da Loja"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel Admin</span>
              {currentUser?.isAdmin && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative group">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 bg-[#180b2a] hover:bg-[#230f3c] border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs font-medium text-purple-200 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white text-[11px] font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate hidden md:inline">
                    {currentUser.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#150a21] border border-purple-500/40 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
                  <div className="px-3 py-1.5 border-b border-purple-900/50 text-[11px] text-purple-400">
                    Conectado como <strong className="text-white block truncate">{currentUser.email}</strong>
                  </div>
                  <button
                    onClick={onToggleAdminRole}
                    className="w-full text-left px-3 py-1.5 text-xs text-purple-200 hover:bg-purple-900/40 flex items-center justify-between"
                  >
                    <span>Modo Admin</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${currentUser.isAdmin ? 'bg-emerald-900/60 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      {currentUser.isAdmin ? 'ATIVO' : 'CLIENTE'}
                    </span>
                  </button>
                  <button
                    onClick={onOpenAdmin}
                    className="w-full text-left px-3 py-1.5 text-xs text-purple-200 hover:bg-purple-900/40 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Abrir Painel Admin
                  </button>
                  <button
                    onClick={onOpenTracker}
                    className="w-full text-left px-3 py-1.5 text-xs text-purple-200 hover:bg-purple-900/40 flex items-center gap-2"
                  >
                    <Truck className="w-3.5 h-3.5 text-fuchsia-400" />
                    Meus Pedidos
                  </button>
                  <div className="border-t border-purple-900/50 mt-1 pt-1">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sair da Conta
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-[#170a27] hover:bg-purple-900/50 border border-purple-500/40 text-purple-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Entrar / Cadastrar</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-600 hover:from-purple-600 hover:to-fuchsia-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(232,121,249,0.7)] transition-all cursor-pointer"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 ? (
                <span className="bg-amber-400 text-purple-950 text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-md">
                  {cartCount}
                </span>
              ) : (
                <span className="bg-purple-900/80 text-purple-300 text-[10px] px-1.5 py-0.2 rounded-full">
                  0
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden md:inline font-mono font-bold text-amber-200 text-xs border-l border-purple-400/40 pl-1.5">
                  R$ {cartTotal.toFixed(2)}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-purple-300 hover:text-white hover:bg-purple-900/30 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar & Links */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-purple-900/50 space-y-3 pb-2 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/60" />
              <input
                type="text"
                placeholder="Buscar itens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#130720] border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-sm text-purple-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => { onSelectCategory('tibia-coin'); setMobileMenuOpen(false); }}
                className="p-2 bg-purple-950/40 rounded-lg border border-purple-800/40 text-purple-200 text-left flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                Tibia Coins
              </button>
              <button
                onClick={() => { onSelectCategory('gold-coin'); setMobileMenuOpen(false); }}
                className="p-2 bg-purple-950/40 rounded-lg border border-purple-800/40 text-purple-200 text-left flex items-center gap-2"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Gold Coins
              </button>
              <button
                onClick={() => { onSelectCategory('sets'); setMobileMenuOpen(false); }}
                className="p-2 bg-purple-950/40 rounded-lg border border-purple-800/40 text-purple-200 text-left"
              >
                Sets & Armaduras
              </button>
              <button
                onClick={() => { onSelectCategory('relikias'); setMobileMenuOpen(false); }}
                className="p-2 bg-purple-950/40 rounded-lg border border-purple-800/40 text-purple-200 text-left"
              >
                Relíquias & Gemas
              </button>
              <button
                onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
                className="p-2 bg-amber-950/30 rounded-lg border border-amber-800/40 text-amber-300 text-left flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" />
                Calculadora
              </button>
              <button
                onClick={() => { onOpenTracker(); setMobileMenuOpen(false); }}
                className="p-2 bg-fuchsia-950/30 rounded-lg border border-fuchsia-800/40 text-fuchsia-300 text-left flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                Rastrear Pedido
              </button>
            </div>
            <div className="pt-2 border-t border-purple-950 flex justify-between items-center text-xs">
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="text-amber-400 font-bold flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Painel Administrativo
              </button>
              <button
                onClick={onToggleAdminRole}
                className="text-[11px] text-purple-400 underline"
              >
                Alternar Role: {currentUser?.isAdmin ? 'Admin' : 'Cliente'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
