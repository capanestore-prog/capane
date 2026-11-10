import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  Truck, 
  ShieldCheck, 
  ExternalLink,
  Package,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface WhatsAppCheckoutModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenTracker: () => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  order,
  onClose,
  onOpenTracker,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order) {
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [order?.id]);

  if (!order) return null;

  const handleOpenWhatsApp = () => {
    window.open(order.whatsappUrl, '_blank');
  };

  const handleCopyMessage = () => {
    const rawMessage = decodeURIComponent(order.whatsappUrl.split('text=')[1]?.split('&')[0] || '');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Box */}
      <div className="relative bg-[#130720] border-2 border-emerald-500/50 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.35)] z-10 text-slate-100 overflow-hidden">
        
        {/* Subtle Ambient Light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 text-center">
          
          {/* Header Title & Icon */}
          <div>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-3">
              <MessageCircle className="w-8 h-8 fill-emerald-400" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pedido #{order.id} Registrado!</span>
            </div>

            <h2 className="text-2xl font-fantasy font-black text-white">
              Finalize seu Pedido no WhatsApp
            </h2>
            <p className="text-xs text-purple-300/80 mt-1 max-w-md mx-auto">
              Clique no botão verde abaixo para abrir a conversa com nossa equipe. A mensagem com todos os itens já está pronta!
            </p>
          </div>

          {/* In-Game Destination Snapshot */}
          <div className="bg-[#19092b] border border-purple-800/50 rounded-xl p-3.5 text-xs text-left space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-purple-900/50">
              <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                Dados da Entrega no Jogo
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 text-[10px]">
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-purple-400 block uppercase font-semibold">Personagem</span>
                <strong className="text-white">{order.characterName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-purple-400 block uppercase font-semibold">Servidor</span>
                <strong className="text-amber-400">{order.serverName}</strong>
              </div>
            </div>

            {/* Items summary */}
            <div className="pt-2 border-t border-purple-900/50">
              <span className="text-[10px] text-purple-400 block mb-1">Itens Adquiridos:</span>
              <div className="space-y-1">
                {order.items.map(item => (
                  <div key={item.id} className="text-xs text-purple-200 flex justify-between">
                    <span>{item.quantity}x {item.productName}</span>
                    <span className="font-mono text-amber-300">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-purple-900/50 text-xs">
              <span className="font-bold text-white">Total a Pagar:</span>
              <span className="font-mono text-base font-black text-amber-300 gold-glow">
                R$ {order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Primary Action: Open WhatsApp Button */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full py-4 px-6 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>ABRIR NO WHATSAPP AGORA</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-purple-200 hover:text-white bg-[#180928] hover:bg-purple-950 border border-purple-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Mensagem Copiada com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copiar Mensagem do Pedido para o WhatsApp</span>
                </>
              )}
            </button>
          </div>

          {/* WhatsApp Direct Number Note */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300/90 text-left space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Atendimento Direto: (61) 99928-7524</span>
            </div>
            <p className="text-[11px] leading-relaxed text-purple-300/80">
              Nosso atendente confirmará sua compra e entregará as moedas/itens no jogo em até 5 minutos via Parcel ou Trade!
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-between items-center pt-2 border-t border-purple-900/50 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenTracker();
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              Ver Meus Pedidos
            </button>

            <button
              onClick={onClose}
              className="text-purple-400 hover:text-white"
            >
              Continuar na Loja
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
