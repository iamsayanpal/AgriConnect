import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem, clearCart, onOrderPlaced }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [buyerName, setBuyerName] = useState('Sunita Sharma');
  const [buyerPhone, setBuyerPhone] = useState('+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // Create orders in backend for each item in cart
      const orderPromises = cart.map(item => {
        return fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            buyer_type: 'retail',
            listing_id: item._id,
            crop_name: item.crop_name,
            category: item.category,
            quantity: item.cartQuantity,
            unit: item.unit || 'kg',
            total_price: item.price * item.cartQuantity,
            farmer_name: item.farmer_name,
            locality: item.locality
          })
        }).then(res => res.json());
      });

      const results = await Promise.all(orderPromises);
      setIsSubmitting(false);
      setOrderSuccess(results[0]);
      clearCart();
      if (onOrderPlaced) onOrderPlaced(results[0]);
    } catch (err) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Your Fresh Cart</h2>
              <p className="text-xs text-slate-500 font-medium">{cart.length} item(s) from direct farmers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        {orderSuccess ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-sm text-slate-600 max-w-xs">
              Your order has been sent directly to <span className="font-semibold text-emerald-800">{orderSuccess.farmer_name}</span> in {orderSuccess.locality}.
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl text-left w-full space-y-2 border border-emerald-200 text-xs text-emerald-900">
              <p><strong>Order ID:</strong> #{orderSuccess._id?.substring(0, 10) || 'ORD-9821'}</p>
              <p><strong>Total Paid:</strong> ₹{orderSuccess.total_price}</p>
              <p><strong>Status:</strong> Placed ➔ Picked Up ➔ In Transit</p>
            </div>
            <button
              onClick={() => {
                setOrderSuccess(null);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-200"
            >
              Continue Shopping / Track Order
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
            <ShoppingBag className="w-16 h-16 stroke-[1.5]" />
            <p className="text-base font-semibold text-slate-600">Your produce cart is empty</p>
            <p className="text-xs text-slate-400 max-w-xs">Browse vegetables or fruits directly from local farmers and FPOs to add items.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Cart Items list */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Produce</h4>
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center space-x-3">
                    <img src={item.image_url} alt={item.crop_name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{item.crop_name}</h5>
                      <p className="text-xs text-slate-500">{item.farmer_name} • {item.locality}</p>
                      <p className="text-sm font-extrabold text-emerald-700 mt-1">₹{item.price} / {item.unit || 'kg'}</p>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                        className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-800">{item.cartQuantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                        className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Buyer Info & Payment Options */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Details (Prototype Mock)</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Payment Method (Mock)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / GPay' },
                    { id: 'cod', label: 'Cash on Delivery' },
                    { id: 'card', label: 'Card' }
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === pm.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>

          </div>
        )}

        {/* Footer with Totals & Checkout Button */}
        {!orderSuccess && cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Intermediary Commission Fee</span>
                <span>₹0 (100% Direct to Farmer)</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 active:scale-98 touch-manipulation"
            >
              <span>{isSubmitting ? 'Processing Order...' : 'Place Direct Farm Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero markups • Farmers receive full payout instantly</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
