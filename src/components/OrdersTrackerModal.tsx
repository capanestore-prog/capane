import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import { Order } from '../types';

interface OrdersTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOpenPixModal: (order: Order) => void;
}

export const OrdersTrackerModal: React.FC<OrdersTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOpenPixModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = orders.filter(o => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.id.toString().includes(term) ||
      o.characterName.toLowerCase().includes(term) ||
      o.serverName.toLowerCase().includes(term)
    );
  });

  const getStepProgress = (status: Order['status']): number => {
    switch (status) {
      case 'Entregue':
        return 4;
      case 'Pagamento aprovado':
        return 2;
      case 'Aguardando pagamento':
        return 1;
      case 'Cancelado':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative bg-[#130720] border-2 border-purple-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 shadow-[0_0_40px_rgba(168,85,247,0.4)] z-10 text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-purple-900/50 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-700/60 flex items-center justify-center text-fuchsia-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-fantasy font-black text-white text-lg">
                Rastreamento de Pedidos e Entregas
              </h3>
              <p className="text-xs text-purple-400">
                Acompanhe em tempo real a confirmação do PIX e despacho in-game.
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

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            placeholder="Buscar por ID do pedido (#1042) ou nome do personagem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d0417] border border-purple-700/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-purple-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto opacity-60 text-purple-400" />
              <p className="text-xs">Nenhum pedido encontrado com os termos pesquisados.</p>
            </div>
          ) : (
            filtered.map((order) => {
              const step = getStepProgress(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-[#180928] border border-purple-800/60 rounded-xl p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-purple-900/50">
                    <div>
                      <span className="font-mono font-bold text-amber-300 text-sm">
                        Pedido #{order.id}
                      </span>
                      <span className="text-[11px] text-purple-400 ml-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                        order.status === 'Entregue'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : order.status === 'Pagamento aprovado'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : order.status === 'Cancelado'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800'
                      }`}>
                        {order.status}
                      </span>

                      {order.status === 'Aguardando pagamento' && (
                        <button
                          onClick={() => onOpenPixModal(order)}
                          className="inline-flex items-center gap-1 text-[11px] bg-purple-700 hover:bg-purple-600 text-white font-bold px-2.5 py-0.5 rounded cursor-pointer"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Pagar PIX</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Character & Server */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-purple-400 block">Personagem:</span>
                      <strong className="text-white">{order.characterName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400 block">Servidor:</span>
                      <strong className="text-amber-300">{order.serverName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400 block">Total:</span>
                      <strong className="text-amber-400 font-mono">R$ {order.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Step Progress Bar */}
                  <div className="pt-2">
                    <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-semibold mb-1">
                      <span className={step >= 1 ? 'text-purple-300' : 'text-purple-700'}>1. Registrado</span>
                      <span className={step >= 2 ? 'text-emerald-400' : 'text-purple-700'}>2. PIX Aprovado</span>
                      <span className={step >= 3 ? 'text-amber-400' : 'text-purple-700'}>3. No Correio</span>
                      <span className={step >= 4 ? 'text-cyan-300' : 'text-purple-700'}>4. Entregue ✓</span>
                    </div>

                    <div className="w-full bg-[#0d0417] h-1.5 rounded-full overflow-hidden flex">
                      <div className={`h-full transition-all duration-500 ${
                        step === 4 ? 'w-full bg-cyan-400' :
                        step === 3 ? 'w-3/4 bg-amber-400' :
                        step === 2 ? 'w-1/2 bg-emerald-400' :
                        step === 1 ? 'w-1/4 bg-fuchsia-500' : 'w-0'
                      }`}></div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="text-[11px] text-purple-300/80 pt-1">
                    Itens: {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
