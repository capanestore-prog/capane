import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Truck, 
  Download,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface PixCheckoutModalProps {
  order: Order | null;
  onClose: () => void;
  onSimulateWebhookApproval: (orderId: number) => void;
  onOpenTracker: () => void;
}

export const PixCheckoutModal: React.FC<PixCheckoutModalProps> = ({
  order,
  onClose,
  onSimulateWebhookApproval,
  onOpenTracker,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  useEffect(() => {
    if (!order) return;

    // Trigger celebration when order transitions to approved or delivered
    if (order.status === 'Pagamento aprovado' || order.status === 'Entregue') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [order?.status]);

  useEffect(() => {
    if (!order || order.status !== 'Aguardando pagamento') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order?.id, order?.status]);

  if (!order) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.pix.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulateWebhook = () => {
    setSimulatingWebhook(true);
    setTimeout(() => {
      onSimulateWebhookApproval(order.id);
      setSimulatingWebhook(false);
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPaid = order.status === 'Pagamento aprovado' || order.status === 'Entregue';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Box */}
      <div className="relative bg-[#130720] border-2 border-purple-500/50 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.5)] z-10 text-slate-100 overflow-hidden">
        
        {/* Subtle Ambient Light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPaid ? (
          /* ========================================================= */
          /* PENDING PAYMENT STATE (QR CODE + COPIA E COLA) */
          /* ========================================================= */
          <div className="space-y-5 text-center">
            
            {/* Header Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pedido #{order.id} Gerado</span>
              </div>
              <h2 className="text-2xl font-fantasy font-black text-white">
                Pagamento PIX com Confirmação Imediata
              </h2>
              <p className="text-xs text-purple-300/80 mt-1">
                Escaneie o QR Code no app do seu banco ou use a chave Copia e Cola
              </p>
            </div>

            {/* In-Game Destination Snapshot */}
            <div className="bg-[#19092b] border border-purple-800/50 rounded-xl p-3 text-xs flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] text-purple-400 block uppercase font-semibold">Entrega Para</span>
                <strong className="text-white">{order.characterName}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-purple-400 block uppercase font-semibold">Servidor</span>
                <strong className="text-amber-400">{order.serverName}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-purple-400 block uppercase font-semibold">Valor Total</span>
                <strong className="text-amber-300 font-mono text-sm">R$ {order.totalAmount.toFixed(2)}</strong>
              </div>
            </div>

            {/* Real QR Code Box */}
            <div className="relative inline-block bg-white p-4 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] mx-auto">
              {order.pix.qrCodeUrl ? (
                <img
                  src={order.pix.qrCodeUrl}
                  alt="QR Code PIX Capane Store"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-zinc-100 text-zinc-800">
                  <span className="text-xs font-bold font-mono">Gerando QR Code...</span>
                </div>
              )}

              {/* Central Logo Stamp */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#09030e] border-2 border-amber-400 rounded-lg flex items-center justify-center text-sm shadow-md">
                🐉
              </div>
            </div>

            {/* Timer countdown */}
            <div className="flex items-center justify-center gap-2 text-xs text-purple-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                Este QR Code expira em: <strong className="text-amber-400 font-mono">{formatTimer(timeLeft)}</strong>
              </span>
            </div>

            {/* Pix Copia e Cola Box */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-purple-300">
                  PIX Copia e Cola (EMV Padrão):
                </label>
                <span className="text-[10px] text-purple-400">Clique para copiar</span>
              </div>
              
              <div className="relative">
                <textarea
                  readOnly
                  rows={2}
                  value={order.pix.copyPaste}
                  className="w-full bg-[#0d0417] border border-purple-700/60 rounded-xl p-2.5 text-xs font-mono text-purple-200 select-all resize-none focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-800/80 hover:bg-purple-700 text-white border border-purple-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Chave PIX Copiada com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copiar Código PIX Copia e Cola</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Webhook Status */}
            <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl flex items-center justify-center gap-2 text-xs text-purple-300">
              <div className="w-3 h-3 rounded-full border-2 border-fuchsia-400 border-t-transparent animate-spin"></div>
              <span>Aguardando notificação automática do banco via Webhook...</span>
            </div>

            {/* Simulation Tool for Testing & Review */}
            <div className="pt-2 border-t border-purple-900/60">
              <button
                type="button"
                onClick={handleSimulateWebhook}
                disabled={simulatingWebhook}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                title="Simula o recebimento do payload do webhook de pagamento bancário"
              >
                {simulatingWebhook ? (
                  <span>Processando Webhook PIX...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>⚡ Simular Pagamento Aprovado (Webhook Demo)</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-purple-400/80 mt-1">
                Permite testar a confirmação automática do ecossistema e entrega imediata.
              </p>
            </div>

          </div>
        ) : (
          /* ========================================================= */
          /* APPROVED / DELIVERED PAYMENT SUCCESS STATE */
          /* ========================================================= */
          <div className="space-y-6 text-center py-2 animate-fadeIn">
            
            {/* Success icon badge */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-600/50">
                PAGAMENTO APROVADO COM SUCESSO!
              </span>
              <h2 className="text-2xl sm:text-3xl font-fantasy font-black text-white mt-3">
                Pedido #{order.id} em Entrega!
              </h2>
              <p className="text-xs text-purple-300 mt-1 max-w-sm mx-auto">
                Seu pagamento PIX foi validado pelo Webhook do sistema. Os itens já foram reservados no estoque atômico.
              </p>
            </div>

            {/* In-game delivery tracker card */}
            <div className="bg-[#180928] border border-purple-700/50 rounded-xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-purple-900/50">
                <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  Status da Entrega
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {order.status === 'Entregue' ? 'Entregue no Jogo' : 'Enviando Parcel...'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-purple-400 block">Personagem</span>
                  <strong className="text-white">{order.characterName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 block">Servidor</span>
                  <strong className="text-amber-400">{order.serverName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 block">Forma de Envio</span>
                  <strong className="text-purple-200">Parcel / Correio Thais</strong>
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 block">Prazo Estimado</span>
                  <strong className="text-emerald-300">Em até 3 a 5 minutos</strong>
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
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenTracker();
                }}
                className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 border border-fuchsia-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-amber-300" />
                <span>Rastrear Entrega do Pedido</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-purple-300 hover:text-white bg-[#150724] hover:bg-purple-950 border border-purple-800/50 transition-all cursor-pointer"
              >
                Voltar à Loja
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
