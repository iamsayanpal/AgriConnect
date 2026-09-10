import React from 'react';
import { ShieldCheck, Star, MapPin, Package, FileText, Phone } from 'lucide-react';

export default function SupplierList({ suppliers, onOpenContractModal }) {
  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
        Loading regional FPO supplier directory...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Verified FPO & Farmer Supplier Directory</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Direct partnership with regional agricultural collectives</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((supp) => (
          <div key={supp.id || supp.name} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-extrabold text-slate-900">{supp.name}</h4>
                    {supp.verified && (
                      <span className="p-0.5 rounded-full bg-blue-100 text-blue-700" title="Verified FPO Network">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 mr-1" /> {supp.locality} Region
                  </p>
                </div>

                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{supp.rating || '4.9'}</span>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <span className="text-slate-400 font-medium block">Monthly Supply Capacity</span>
                  <strong className="text-slate-900 text-sm font-extrabold flex items-center mt-0.5">
                    <Package className="w-3.5 h-3.5 text-blue-600 mr-1" /> {supp.capacity}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-slate-400 font-medium block">Avg Wholesale Price</span>
                  <strong className="text-emerald-800 text-sm font-extrabold mt-0.5 block">
                    ~₹{supp.avg_price_per_kg} / kg
                  </strong>
                </div>
              </div>

              {/* Primary Crops Badges */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Primary Commodities</span>
                <div className="flex flex-wrap gap-1.5">
                  {supp.primary_crops?.map(crop => (
                    <span key={crop} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {supp.phone || '+91 98220 11223'}
              </div>

              <button
                onClick={() => onOpenContractModal(supp)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm shadow-blue-200 active:scale-95 touch-manipulation"
              >
                <FileText className="w-4 h-4" />
                <span>Request Forward Pricing</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
