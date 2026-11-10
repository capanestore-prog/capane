import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';
import { storeService } from '../services/storeService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const user: UserType = {
      id: Date.now(),
      name: name.trim() || (email.split('@')[0]),
      email: email.trim(),
      isAdmin: email.includes('admin') || email.includes('capane'),
      createdAt: new Date().toISOString()
    };

    storeService.setCurrentUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleDemoAdmin = () => {
    const adminUser: UserType = {
      id: 1,
      name: 'Administrador Capane',
      email: 'capanestore@gmail.com',
      isAdmin: true,
      createdAt: new Date().toISOString()
    };
    storeService.setCurrentUser(adminUser);
    onLoginSuccess(adminUser);
    onClose();
  };

  const handleDemoPlayer = () => {
    const playerUser: UserType = {
      id: 2,
      name: 'Lord Warrior (Player)',
      email: 'lord.warrior@koliseu.com',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    storeService.setCurrentUser(playerUser);
    onLoginSuccess(playerUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative bg-[#130720] border-2 border-purple-500/50 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(168,85,247,0.4)] z-10 text-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-purple-900/50 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-fuchsia-700 flex items-center justify-center">
              <User className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-fantasy font-black text-white text-base">
                {isRegister ? 'Criar Nova Conta' : 'Acessar Conta de Jogador'}
              </h3>
              <p className="text-[11px] text-purple-400">
                Capane Store • Koliseu OT & Tibia Global
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

        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="block text-[11px] text-purple-300 mb-1 font-semibold">Nome Completo</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="Ex: Carlos Guerreiro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0d0417] border border-purple-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-purple-400/40"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] text-purple-300 mb-1 font-semibold">E-mail Cadastrado</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0417] border border-purple-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-purple-400/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-purple-300 mb-1 font-semibold">Senha Secreta</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0417] border border-purple-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-purple-400/40"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 border border-fuchsia-400/50 shadow-md transition-all cursor-pointer mt-2"
          >
            {isRegister ? 'Finalizar Cadastro' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-purple-300 hover:text-amber-400 transition-colors"
          >
            {isRegister ? 'Já possui conta? Clique para Entrar' : 'Não tem conta? Cadastre-se em segundos'}
          </button>
        </div>

        {/* 1-Click Demo Buttons for Fast Evaluation */}
        <div className="mt-5 pt-4 border-t border-purple-900/60 space-y-2">
          <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider block text-center">
            Acesso Rápido para Avaliação (1 Clique)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Entrar como Admin</span>
            </button>

            <button
              type="button"
              onClick={handleDemoPlayer}
              className="p-2 rounded-xl bg-[#0d0417] hover:bg-purple-950 border border-purple-800 text-xs text-purple-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Entrar como Jogador</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
