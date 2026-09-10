import React, { useState } from 'react';
import { Repeat, Calendar, CheckCircle2 } from 'lucide-react';

export default function RecurringOrderForm({ onCreated }) {
  const [buyerName, setBuyerName] = useState('Reliance Fresh Procurement');
  const [cropName, setCropName] = useState('Organic Red Tomato');
  const [quantity, setQuantity] = useState(500);
  const [frequency, setFrequency] = useState('Weekly');
  const [locality, setLocality] = useState('Nashik');
  const [supplier, setSupplier] = useState('Nashik Valley Farmer Producer Co-op');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/bulk/recurring-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: buyerName,
          crop_name: cropName,
          quantity_per_delivery: Number(quantity),
          frequency,
          locality,
          preferred_supplier: supplier
        })
      });
      const data = await res.json();
      setLoading(false);
      setSuccessMsg(true);
      if (onCreated) onCreated(data);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Error creating recurring order:', err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
          <Repeat className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Create Standing / Recurring Bulk Order</h3>
          <p className="text-xs text-slate-500 font-medium">Automate regular wholesale produce shipments directly from regional FPO hubs</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Standing order registered successfully! FPOs will begin schedule fulfillment.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
        <div>
          <label className="block mb-1.5 text-slate-800">Organization / Buyer Name</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-slate-800">Crop Name</label>
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none bg-white"
          >
            <option value="Organic Red Tomato">Organic Red Tomato</option>
            <option value="Nashik Red Onions">Nashik Red Onions</option>
            <option value="Farm Fresh Potatoes">Farm Fresh Potatoes</option>
            <option value="Golden Robusta Bananas">Golden Robusta Bananas</option>
            <option value="Alphonso Mangoes">Alphonso Mangoes</option>
            <option value="Crisp Shimla Apples">Crisp Shimla Apples</option>
          </select>
        </div>

        <div>
          <label className="block mb-1.5 text-slate-800">Quantity per Delivery (kg)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="100"
            step="50"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-slate-800">Delivery Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none bg-white"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block mb-1.5 text-slate-800">Supply Locality</label>
          <input
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-slate-800">Preferred FPO / Supplier</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-md shadow-blue-200 active:scale-98 touch-manipulation"
          >
            {loading ? 'Submitting Standing Order...' : 'Activate Standing Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
