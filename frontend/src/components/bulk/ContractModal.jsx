import React, { useState } from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';

export default function ContractModal({ isOpen, onClose, defaultSupplier, onContractCreated }) {
  const [buyerName, setBuyerName] = useState('BigBasket Sourcing Division');
  const [supplierName, setSupplierName] = useState(defaultSupplier?.name || 'Nashik Valley Farmer Producer Co-op');
  const [cropName, setCropName] = useState('Alphonso Mangoes');
  const [quantityTons, setQuantityTons] = useState(10);
  const [targetPrice, setTargetPrice] = useState(160);
  const [deliveryMonth, setDeliveryMonth] = useState('October 2026');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/bulk/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: buyerName,
          supplier_name: supplierName,
          crop_name: cropName,
          quantity_tons: Number(quantityTons),
          target_price_per_kg: Number(targetPrice),
          delivery_month: deliveryMonth
        })
      });
      const data = await res.json();
      setSubmitting(false);
      setSuccess(true);
      if (onContractCreated) onContractCreated(data);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Contract creation error:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Forward-Pricing Contract Request</h3>
              <p className="text-xs text-slate-500 font-medium">Lock in seasonal harvest pricing directly with FPOs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto animate-bounce" />
            <h4 className="text-xl font-extrabold text-slate-900">Contract Offer Sent!</h4>
            <p className="text-xs text-slate-600">
              Your forward contract offer for {quantityTons} Tons of {cropName} has been submitted to <span className="font-bold text-blue-800">{supplierName}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1 text-slate-800">Target FPO / Supplier</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-800">Buyer Organization</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-800">Crop Type</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Volume (Tons)</label>
                <input
                  type="number"
                  value={quantityTons}
                  onChange={(e) => setQuantityTons(e.target.value)}
                  required
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-800">Offered Price (₹ / kg)</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Delivery Month</label>
                <input
                  type="text"
                  value={deliveryMonth}
                  onChange={(e) => setDeliveryMonth(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 outline-none"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-md shadow-blue-200"
              >
                {submitting ? 'Submitting Contract...' : 'Submit Forward Contract Request'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
