import React, { useState, useEffect } from 'react';
import RecurringOrderForm from './RecurringOrderForm';
import SupplierList from './SupplierList';
import ContractModal from './ContractModal';
import { Truck, FileText, Repeat, Layers, ShieldCheck } from 'lucide-react';

export default function BulkSection() {
  const [activeSubTab, setActiveSubTab] = useState('suppliers'); // 'suppliers' | 'recurring' | 'contracts'
  const [suppliers, setSuppliers] = useState([]);
  const [recurringOrders, setRecurringOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedSupplierForContract, setSelectedSupplierForContract] = useState(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  useEffect(() => {
    fetchSuppliers();
    fetchRecurringOrders();
    fetchContracts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/bulk/suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const fetchRecurringOrders = async () => {
    try {
      const res = await fetch('/api/bulk/recurring-orders');
      const data = await res.json();
      setRecurringOrders(data);
    } catch (err) {
      console.error('Error fetching recurring orders:', err);
    }
  };

  const fetchContracts = async () => {
    try {
      const res = await fetch('/api/bulk/contracts');
      const data = await res.json();
      setContracts(data);
    } catch (err) {
      console.error('Error fetching contracts:', err);
    }
  };

  const handleOpenContractModal = (supp) => {
    setSelectedSupplierForContract(supp);
    setIsContractModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner for Bulk Buyer Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 text-white p-8 sm:p-10 shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-700/80 text-blue-100 text-xs font-bold tracking-wide">
            <Truck className="w-3.5 h-3.5" />
            <span>Bulk Buyer & FPO Procurement Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Direct Wholesale Procurement & Forward Contracting
          </h1>
          <p className="text-sm text-blue-100/90 font-normal leading-relaxed">
            Source bulk commodities directly from Farmers & FPO collectives. Set up recurring delivery schedules and lock in harvest prices with forward contracts.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Truck className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-x-2">
        {[
          { id: 'suppliers', label: 'Supplier FPO Directory', icon: Layers, count: suppliers.length },
          { id: 'recurring', label: 'Standing Orders', icon: Repeat, count: recurringOrders.length },
          { id: 'contracts', label: 'Forward Contracts', icon: FileText, count: contracts.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold transition-all flex-1 justify-center touch-manipulation ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content Views */}
      {activeSubTab === 'suppliers' && (
        <SupplierList
          suppliers={suppliers}
          onOpenContractModal={handleOpenContractModal}
        />
      )}

      {activeSubTab === 'recurring' && (
        <div className="space-y-8">
          <RecurringOrderForm onCreated={fetchRecurringOrders} />

          {/* Existing Recurring Orders List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Active Standing Orders ({recurringOrders.length})</h3>
            
            <div className="space-y-3">
              {recurringOrders.map((ord) => (
                <div key={ord._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{ord.crop_name}</span>
                    <p className="text-slate-500 mt-0.5">
                      {ord.quantity_per_delivery} kg • <strong className="text-blue-700">{ord.frequency} Delivery</strong> • {ord.locality}
                    </p>
                    <p className="text-slate-400 text-[11px]">Buyer: {ord.buyer_name} | Preferred Supplier: {ord.preferred_supplier}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[11px] self-start sm:self-center">
                    {ord.status || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'contracts' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Forward-Pricing Contracts ({contracts.length})</h3>
              <p className="text-xs text-slate-500 font-medium">Seasonal price guarantees negotiated between buyers and FPOs</p>
            </div>
            <button
              onClick={() => handleOpenContractModal(null)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
            >
              + New Contract Offer
            </button>
          </div>

          <div className="space-y-4">
            {contracts.map((c) => (
              <div key={c._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">{c.crop_name}</span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
                    c.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Volume</span>
                    <strong className="text-slate-900 font-bold">{c.quantity_tons} Tons</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lock-in Price</span>
                    <strong className="text-blue-700 font-bold">₹{c.target_price_per_kg} / kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Delivery Month</span>
                    <strong className="text-slate-900 font-bold">{c.delivery_month}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Supplier FPO</span>
                    <strong className="text-slate-900 font-bold">{c.supplier_name}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-slate-400 text-[11px] flex justify-between">
                  <span>Buyer: {c.buyer_name}</span>
                  <span>Direct Farm Guarantee</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contract Modal */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        defaultSupplier={selectedSupplierForContract}
        onContractCreated={fetchContracts}
      />

    </div>
  );
}
