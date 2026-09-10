import React from 'react';
import { Truck, CheckCircle2, Clock, MapPin, Navigation, ExternalLink, ChevronRight, User } from 'lucide-react';

export default function OrderTracker({ orders, onUpdateStatus }) {
  if (!orders || orders.length === 0) return null;

  const steps = [
    { key: 'placed', label: 'Placed', icon: Clock },
    { key: 'picked up', label: 'Picked Up', icon: CheckCircle2 },
    { key: 'in transit', label: 'In Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: MapPin }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'picked up': return 1;
      case 'in transit': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Active Direct Farm Deliveries ({orders.length})</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time status tracking & direct Google Maps pickup navigation</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const currentStep = getStepIndex(order.status);
          
          // Cab Driver style Google Maps pickup navigation URL
          const pickupLat = order.pickup_lat || 20.0059;
          const pickupLng = order.pickup_lng || 73.7898;
          const googleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${pickupLat},${pickupLng}&destination_place_id=${encodeURIComponent(order.farmer_name + ' ' + order.locality)}&travelmode=driving`;

          return (
            <div key={order._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              
              {/* Order Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-slate-700 pb-3 border-b border-slate-200/60">
                <div>
                  <span className="text-slate-400 font-medium">Order ID:</span> #{order._id?.substring(0, 8) || 'ORD-101'} • <span className="text-emerald-700 font-bold">{order.crop_name} ({order.quantity} {order.unit || 'kg'})</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>Total: <strong className="text-slate-900 text-sm">₹{order.total_price}</strong></span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold capitalize">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Farmer Location & Cab-Driver Google Maps Switch Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 gap-3">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{order.farmer_name}</p>
                    <p className="text-slate-500 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500 mr-1" /> {order.locality} Farm Pickup Hub
                    </p>
                  </div>
                </div>

                {/* Switch to Google Maps Navigation Button (Cab Driver Mode) */}
                <a
                  href={googleNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm shadow-blue-200 active:scale-95 touch-manipulation"
                >
                  <Navigation className="w-4 h-4 fill-white" />
                  <span>Navigate to Pickup in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Visual Timeline Bar: placed -> picked up -> in transit -> delivered */}
              <div className="pt-2">
                <div className="grid grid-cols-4 gap-2 relative">
                  {steps.map((st, idx) => {
                    const Icon = st.icon;
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={st.key} className="flex flex-col items-center text-center space-y-1.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                              : isPassed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[11px] font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Fast Prototype Status Toggle simulation */}
                <div className="mt-4 flex items-center justify-end space-x-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Simulate Status:</span>
                  {steps.map(st => (
                    <button
                      key={st.key}
                      onClick={() => onUpdateStatus(order._id, st.key)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        order.status === st.key
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
