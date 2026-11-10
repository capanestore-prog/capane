import React from 'react';
import { Shield, Zap, Lock, Truck, HelpCircle, FileText, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenCalculator: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenCalculator,
  onOpenTracker,
}) => {
  return (
    <footer className="bg-[#05010a] border-t-2 border-purple-500/30 text-purple-300 text-xs">
      {/* Top Features Row */}
      <div className="border-b border-purple-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-fantasy font-bold text-white text-sm">PIX Automático</h4>
              <p className="text-[11px] text-purple-400">Compensação instantânea com Webhook 24/7</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-fantasy font-bold text-white text-sm">Entrega em 5 Min</h4>
              <p className="text-[11px] text-purple-400">Via Parcel ou Trade seguro para seu char</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-fuchsia-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-fantasy font-bold text-white text-sm">Transação Segura</h4>
              <p className="text-[11px] text-purple-400">Estoque atômico com garantia total de entrega</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-fantasy font-bold text-white text-sm">Koliseu & Tibia</h4>
              <p className="text-[11px] text-purple-400">Cobertura completa para todos os servidores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🐉</span>
              <span className="font-fantasy font-black text-xl text-white tracking-wider electric-glow">
                CAPANE STORE
              </span>
            </div>
            <p className="text-purple-400 leading-relaxed text-xs">
              O maior e mais confiável marketplace de Tibia Coins, Gold Coins e itens raros para Tibia Global e Koliseu OT. Economia forte, segurança e agilidade para seu personagem.
            </p>
            <div className="text-[11px] text-purple-400/80">
              E-mail de Suporte: <strong className="text-purple-200">capanestore@gmail.com</strong>
            </div>
          </div>

          {/* Col 2: Useful Links */}
          <div className="space-y-3">
            <h4 className="font-fantasy font-bold text-white text-sm uppercase tracking-wider text-fuchsia-300">
              Atalhos & Serviços
            </h4>
            <ul className="space-y-2 text-purple-300">
              <li>
                <button onClick={onOpenCalculator} className="hover:text-amber-400 transition-colors">
                  Calculadora de Tibia Coins & Gold
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-amber-400 transition-colors">
                  Rastrear Entrega do Pedido
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-amber-400 transition-colors">
                  Painel Administrativo da Loja
                </button>
              </li>
              <li>
                <a href="#produtos" className="hover:text-amber-400 transition-colors">
                  Arsenal de Sets & Relíquias
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Servidores Compatíveis */}
          <div className="space-y-3">
            <h4 className="font-fantasy font-bold text-white text-sm uppercase tracking-wider text-fuchsia-300">
              Servidores Atendidos
            </h4>
            <ul className="space-y-1.5 text-purple-400 text-[11px]">
              <li>• Koliseu OT (Midgard & Asgard)</li>
              <li>• Tibia Global (Antica, Pacera, Belobra, Secura)</li>
              <li>• Servidores Open-PvP e Retro Hardcore</li>
              <li>• Transferências via Parcel em Carlin, Thais, Venore e Kazordoon</li>
            </ul>
          </div>

          {/* Col 4: Payment Badges */}
          <div className="space-y-3">
            <h4 className="font-fantasy font-bold text-white text-sm uppercase tracking-wider text-fuchsia-300">
              Formas de Pagamento
            </h4>
            <div className="p-3 bg-[#11051c] border border-purple-800/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="text-base">❖</span>
                <span>PIX Banco Central do Brasil</span>
              </div>
              <p className="text-[11px] text-purple-400">
                Aprovação automática em até 10 segundos via Webhook com confirmação imediata.
              </p>
            </div>
            <p className="text-[10px] text-purple-400/60">
              * Tibia é marca registrada da CipSoft GmbH. Esta loja é um marketplace independente para a comunidade de jogadores.
            </p>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-purple-950 py-4 bg-[#030106] text-center text-[11px] text-purple-500">
        <p>&copy; 2026 CAPANE STORE — Todos os direitos reservados. Feito para lendas do Koliseu e Tibia.</p>
      </div>
    </footer>
  );
};
