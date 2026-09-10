import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RetailSection from './components/retail/RetailSection';
import BulkSection from './components/bulk/BulkSection';
import FarmerSection from './components/farmer/FarmerSection';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('retail'); // 'retail' | 'bulk' | 'farmer'
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
    fetchOrders();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      setListings(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Cart operations
  const handleAddToCart = (listing) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === listing._id);
      if (existing) {
        return prev.map(item =>
          item._id === listing._id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...listing, cartQuantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item._id === id ? { ...item, cartQuantity: newQty } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order status update handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleListingAdded = (newListing) => {
    setListings(prev => [newListing, ...prev]);
  };

  const handleDeleteListing = async (id) => {
    try {
      await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation Bar with Role Switcher */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        cartCount={cart.reduce((sum, item) => sum + item.cartQuantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Container View based on Role Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-slate-600">Initializing AgriConnect Direct Marketplace...</p>
          </div>
        ) : (
          <>
            {activeRole === 'retail' && (
              <RetailSection
                listings={listings}
                orders={orders}
                onAddToCart={handleAddToCart}
                cart={cart}
                updateQuantity={handleUpdateCartQuantity}
                removeItem={handleRemoveFromCart}
                clearCart={handleClearCart}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                refreshListings={fetchListings}
              />
            )}

            {activeRole === 'bulk' && (
              <BulkSection />
            )}

            {activeRole === 'farmer' && (
              <FarmerSection
                listings={listings}
                onListingAdded={handleListingAdded}
                onDeleteListing={handleDeleteListing}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <span className="font-extrabold text-slate-900">AgriConnect Prototype</span>
            <span>• Direct Farmer-to-Consumer & Wholesale Network</span>
          </div>

          <div className="flex items-center space-x-4 font-semibold text-slate-600">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Zero Intermediary Gateways
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Node.js • Express • MongoDB • FastAPI • Google Maps & Weather</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
