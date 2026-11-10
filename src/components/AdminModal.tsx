import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Package, 
  Tag, 
  Zap, 
  Search, 
  ShieldAlert, 
  RefreshCw,
  Edit2,
  Trash2,
  Check,
  Send
} from 'lucide-react';
import { Category, Coupon, DashboardStats, Order, OrderStatus, Product } from '../types';
import { storeService } from '../services/storeService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  stats: DashboardStats;
  onRefreshData: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  orders,
  coupons,
  stats,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'coupons' | 'webhook'>('stats');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  
  // New Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCatId, setNewProdCatId] = useState(categories[0]?.id || 1);
  const [newProdPrice, setNewProdPrice] = useState('49.90');
  const [newProdStock, setNewProdStock] = useState('100');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('Unidade');

  // New Coupon Form State
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState('10');
  const [newCouponUses, setNewCouponUses] = useState('100');

  // Webhook Simulator State
  const [webhookOrderId, setWebhookOrderId] = useState<string>('');
  const [webhookMessage, setWebhookMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleUpdateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    storeService.updateOrderStatus(orderId, newStatus);
    onRefreshData();
  };

  const handleQuickStockUpdate = (productId: number, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    storeService.saveProduct({
      ...prod,
      stock: Math.max(0, prod.stock + delta)
    });
    onRefreshData();
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    storeService.saveProduct({
      name: newProdName.trim(),
      categoryId: Number(newProdCatId),
      price: parseFloat(newProdPrice) || 10,
      stock: parseInt(newProdStock, 10) || 50,
      description: newProdDesc.trim() || 'Item oficial Capane Store.',
      imageUrl: newProdImage.trim() || undefined,
      unit: newProdUnit.trim() || 'Unidade',
      rarity: 'Lendário',
      deliveryType: 'Até 5 min'
    });

    setShowAddProduct(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdImage('');
    onRefreshData();
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
      storeService.deleteProduct(id);
      onRefreshData();
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    storeService.addCoupon({
      code: newCouponCode.trim(),
      discountType: newCouponType,
      discountValue: parseFloat(newCouponValue) || 10,
      usesLeft: parseInt(newCouponUses, 10) || 50
    });

    setShowAddCoupon(false);
    setNewCouponCode('');
    onRefreshData();
  };

  const handleTriggerWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(webhookOrderId, 10);
    if (!id) {
      setWebhookMessage('Informe um ID de pedido válido');
      return;
    }
    const order = orders.find(o => o.id === id);
    if (!order) {
      setWebhookMessage(`Pedido #${id} não encontrado`);
      return;
    }

    storeService.simulateWebhookPaymentApproved(id);
    setWebhookMessage(`✅ Webhook enviado com sucesso! Pedido #${id} aprovado.`);
    onRefreshData();
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toString().includes(orderSearch) ||
      o.characterName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.serverName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Main Container */}
      <div className="relative bg-[#11051c] border-2 border-purple-500/60 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.4)] z-10 text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-purple-900/60 bg-[#160726] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/60 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-fantasy font-black text-xl sm:text-2xl text-white">
                  Painel de Controle Administrativo
                </h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded">
                  ADMIN ATIVO
                </span>
              </div>
              <p className="text-xs text-purple-400">
                Gerencie métricas em tempo real, estoque atômico, aprovação de pedidos e Webhook PIX.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshData}
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-900/40 rounded-lg transition-colors"
              title="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-purple-400 hover:text-white hover:bg-purple-900/40 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 bg-[#140622] border-b border-purple-900/50 flex gap-2 sm:gap-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-purple-400 hover:text-purple-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Métricas & Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-purple-400 hover:text-purple-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Gerenciar Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-purple-400 hover:text-purple-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catálogo & Estoque ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-purple-400 hover:text-purple-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Cupons de Desconto ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook')}
            className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'webhook'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-purple-400 hover:text-purple-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulador Webhook PIX</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: STATS / DASHBOARD */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              
              {/* Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Revenue */}
                <div className="bg-[#180928] border border-purple-800/60 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-purple-400 text-xs">
                    <span>Faturamento Total</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                    R$ {stats.faturamentoTotal.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-purple-400">
                    Pagamentos aprovados e entregues
                  </p>
                </div>

                {/* Today Sales */}
                <div className="bg-[#180928] border border-purple-800/60 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-purple-400 text-xs">
                    <span>Vendas Hoje</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                    R$ {stats.vendasHoje.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-purple-400">
                    Últimas 24 horas
                  </p>
                </div>

                {/* Pending Orders */}
                <div className="bg-[#180928] border border-purple-800/60 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-purple-400 text-xs">
                    <span>Aguardando PIX</span>
                    <Clock className="w-4 h-4 text-fuchsia-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-fuchsia-300">
                    {stats.pedidosPendentes}
                  </div>
                  <p className="text-[10px] text-purple-400">
                    Pedidos aguardando compensação
                  </p>
                </div>

                {/* Completed Orders */}
                <div className="bg-[#180928] border border-purple-800/60 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-purple-400 text-xs">
                    <span>Pedidos Concluídos</span>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                    {stats.pedidosConcluidos}
                  </div>
                  <p className="text-[10px] text-purple-400">
                    Entregues no jogo com sucesso
                  </p>
                </div>

              </div>

              {/* Low Stock Warning Section */}
              <div className="bg-[#180928] border border-purple-800/60 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-fantasy font-bold text-white text-base">
                      Alerta de Estoque Baixo (Menos de 10 unidades)
                    </h3>
                  </div>
                  <span className="text-xs text-purple-400">
                    {stats.produtosEstoqueBaixo.length} itens necessitando reposição
                  </span>
                </div>

                {stats.produtosEstoqueBaixo.length === 0 ? (
                  <p className="text-xs text-emerald-400 py-3">
                    ✓ Todos os produtos do arsenal estão com estoque satisfatório!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stats.produtosEstoqueBaixo.map(prod => (
                      <div
                        key={prod.id}
                        className="bg-[#0e0417] border border-purple-900/60 rounded-lg p-3 flex justify-between items-center"
                      >
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-[180px]">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-rose-400 font-mono mt-0.5">
                            Estoque Atual: <strong>{prod.stock}</strong> un
                          </div>
                        </div>
                        <button
                          onClick={() => handleQuickStockUpdate(prod.id, 20)}
                          className="text-[11px] bg-purple-800 hover:bg-purple-700 text-white font-bold px-2 py-1 rounded"
                        >
                          +20 Estoque
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Database & Architecture Summary */}
              <div className="bg-purple-950/30 border border-purple-900/50 rounded-xl p-4 text-xs text-purple-300/90 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Arquitetura Integrada: schema.sql & server.js
                </h4>
                <p>
                  O sistema de transações atômicas protege a integridade do estoque quando múltiplos jogadores compram simultaneamente.
                  Os pagamentos PIX utilizam verificação criptográfica CRC16 compatível com o Banco Central do Brasil.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter and Search */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Filtrar por ID, personagem ou servidor..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-[#0d0417] border border-purple-700/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-purple-400/50"
                  />
                </div>

                <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto text-[11px]">
                  {['all', 'Aguardando pagamento', 'Pagamento aprovado', 'Entregue', 'Cancelado'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-purple-800 border-amber-400 text-amber-300 font-bold'
                          : 'bg-[#150724] border-purple-900 text-purple-300 hover:border-purple-600'
                      }`}
                    >
                      {st === 'all' ? 'Todos os Status' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="border border-purple-900/60 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#180928] text-purple-300 border-b border-purple-900/60">
                    <tr>
                      <th className="p-3">Pedido #</th>
                      <th className="p-3">Personagem & Servidor</th>
                      <th className="p-3">Itens</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status Atual</th>
                      <th className="p-3 text-right">Ação de Atualização</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/40">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-purple-400">
                          Nenhum pedido encontrado com os filtros atuais.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-purple-950/20 transition-colors">
                          <td className="p-3 font-mono font-bold text-amber-300">
                            #{order.id}
                            <span className="block text-[10px] text-purple-400 font-normal">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="p-3">
                            <strong className="text-white block">{order.characterName}</strong>
                            <span className="text-[11px] text-purple-300">{order.serverName}</span>
                          </td>
                          <td className="p-3 text-purple-200">
                            {order.items.map(it => (
                              <div key={it.id} className="truncate max-w-[200px]">
                                {it.quantity}x {it.productName}
                              </div>
                            ))}
                          </td>
                          <td className="p-3 font-mono font-bold text-amber-400">
                            R$ {order.totalAmount.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
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
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            {order.status === 'Aguardando pagamento' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Pagamento aprovado')}
                                className="px-2 py-1 rounded bg-emerald-800/80 hover:bg-emerald-700 text-white text-[10px] font-bold"
                              >
                                Aprovar PIX
                              </button>
                            )}
                            {order.status === 'Pagamento aprovado' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Entregue')}
                                className="px-2 py-1 rounded bg-cyan-800/80 hover:bg-cyan-700 text-white text-[10px] font-bold"
                              >
                                Marcar Entregue
                              </button>
                            )}
                            {order.status !== 'Cancelado' && order.status !== 'Entregue' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Cancelado')}
                                className="px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[10px]"
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: PRODUCTS & STOCK MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-fantasy font-bold text-white text-base">
                    Arsenal de Produtos ({products.length})
                  </h3>
                  <p className="text-xs text-purple-400">
                    Adicione novos tesouros e reabasteça o estoque atômico.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Produto</span>
                </button>
              </div>

              {/* Add Product Accordion Form */}
              {showAddProduct && (
                <form onSubmit={handleCreateProduct} className="bg-[#180928] border border-purple-700/60 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase">
                    Cadastrar Novo Produto
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-purple-300 mb-1">Nome do Item *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 2.000 Tibia Coins"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Categoria *</label>
                      <select
                        value={newProdCatId}
                        onChange={(e) => setNewProdCatId(Number(e.target.value))}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Preço (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Estoque Inicial *</label>
                      <input
                        type="number"
                        required
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Unidade / Tag</label>
                      <input
                        type="text"
                        placeholder="Ex: TC, kk, Set"
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-purple-300 mb-1">Descrição</label>
                    <input
                      type="text"
                      placeholder="Breve resumo sobre o item e entrega"
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-3 py-1.5 text-xs text-purple-300 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-bold"
                    >
                      Salvar Produto
                    </button>
                  </div>
                </form>
              )}

              {/* Products List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map(prod => (
                  <div
                    key={prod.id}
                    className="bg-[#180928] border border-purple-900/70 rounded-xl p-3 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">
                          {prod.categoryName}
                        </span>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-purple-400 hover:text-rose-400 p-0.5"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">{prod.name}</h4>
                      <div className="text-sm font-bold font-mono text-amber-400 mt-1">
                        R$ {prod.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Stock Quick Adjustment */}
                    <div className="pt-2 border-t border-purple-900/50 flex items-center justify-between">
                      <span className="text-xs text-purple-300">
                        Estoque: <strong className={prod.stock <= 5 ? 'text-rose-400' : 'text-emerald-400'}>{prod.stock}</strong>
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleQuickStockUpdate(prod.id, -5)}
                          className="px-1.5 py-0.5 bg-purple-950 border border-purple-800 text-[10px] rounded hover:bg-purple-900"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQuickStockUpdate(prod.id, 10)}
                          className="px-1.5 py-0.5 bg-purple-950 border border-purple-800 text-[10px] rounded hover:bg-purple-900"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickStockUpdate(prod.id, 50)}
                          className="px-1.5 py-0.5 bg-purple-950 border border-purple-800 text-[10px] rounded hover:bg-purple-900"
                        >
                          +50
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: COUPONS MANAGEMENT */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-fantasy font-bold text-white text-base">
                    Cupons Promocionais
                  </h3>
                  <p className="text-xs text-purple-400">
                    Crie códigos de desconto em porcentagem ou valor fixo em reais.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCoupon(!showAddCoupon)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Cupom</span>
                </button>
              </div>

              {/* Add Coupon Form */}
              {showAddCoupon && (
                <form onSubmit={handleCreateCoupon} className="bg-[#180928] border border-purple-700/60 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Código do Cupom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: TIBIA20"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Tipo de Desconto *</label>
                      <select
                        value={newCouponType}
                        onChange={(e) => setNewCouponType(e.target.value as any)}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="percentage">Porcentagem (%)</option>
                        <option value="fixed">Valor Fixo (R$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Valor do Desconto *</label>
                      <input
                        type="number"
                        required
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(e.target.value)}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 mb-1">Usos Limite *</label>
                      <input
                        type="number"
                        required
                        value={newCouponUses}
                        onChange={(e) => setNewCouponUses(e.target.value)}
                        className="w-full bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCoupon(false)}
                      className="px-3 py-1.5 text-xs text-purple-300 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-bold"
                    >
                      Criar Cupom
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {coupons.map(coupon => (
                  <div
                    key={coupon.id}
                    className="bg-[#180928] border border-purple-800/60 rounded-xl p-4 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-black text-amber-300 text-sm">
                        {coupon.code}
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">
                        {coupon.usesLeft} usos restantes
                      </span>
                    </div>

                    <div className="text-xs text-purple-200">
                      Desconto de <strong>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue.toFixed(2)}`}</strong>
                    </div>

                    {coupon.minOrderValue && (
                      <div className="text-[10px] text-purple-400">
                        Pedido mínimo: R$ {coupon.minOrderValue.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: WEBHOOK SIMULATOR */}
          {activeTab === 'webhook' && (
            <div className="space-y-5 max-w-2xl">
              
              <div>
                <h3 className="font-fantasy font-bold text-white text-base">
                  Simulador de Webhook PIX (Endpoint `/api/webhook/pix`)
                </h3>
                <p className="text-xs text-purple-400 mt-1">
                  Este utilitário simula o envio do payload de notificação bancária via Webhook para validar a atualização automática de pedidos do backend.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleTriggerWebhook} className="bg-[#180928] border border-purple-700/60 rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1">
                    Selecione ou digite o ID do Pedido:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Ex: 1042"
                      value={webhookOrderId}
                      onChange={(e) => setWebhookOrderId(e.target.value)}
                      className="flex-1 bg-[#0d0417] border border-purple-700 rounded-lg p-2 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Disparar Webhook</span>
                    </button>
                  </div>
                </div>

                {/* Quick Select from Pending */}
                <div>
                  <span className="text-[11px] text-purple-400 block mb-1.5">
                    Pedidos aguardando compensação:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {orders.filter(o => o.status === 'Aguardando pagamento').map(o => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setWebhookOrderId(o.id.toString())}
                        className="text-xs px-2.5 py-1 rounded bg-[#0d0417] hover:bg-purple-900 border border-purple-800 text-purple-200 cursor-pointer"
                      >
                        Pedido #{o.id} ({o.characterName} - R$ {o.totalAmount.toFixed(2)})
                      </button>
                    ))}
                    {orders.filter(o => o.status === 'Aguardando pagamento').length === 0 && (
                      <span className="text-xs text-purple-400 italic">
                        Nenhum pedido pendente no momento. Gere um novo pedido na loja para testar!
                      </span>
                    )}
                  </div>
                </div>

                {webhookMessage && (
                  <div className="p-3 bg-purple-950/60 border border-purple-800 rounded-lg text-xs font-medium text-emerald-300">
                    {webhookMessage}
                  </div>
                )}
              </form>

              {/* Code sample */}
              <div className="bg-[#0b0314] border border-purple-900 rounded-xl p-4 text-[11px] font-mono text-purple-300">
                <span className="text-purple-400 block mb-1 font-sans font-bold">// Exemplo de Payload HTTP POST enviado pelo Gateway:</span>
                <pre className="overflow-x-auto text-amber-300">
{`{
  "action": "payment.created",
  "data": {
    "id": "pix_ext_99482918",
    "status": "approved",
    "amount": 189.90
  }
}`}
                </pre>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
