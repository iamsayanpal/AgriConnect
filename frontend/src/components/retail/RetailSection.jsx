import React, { useState } from 'react';
import ListingCard from './ListingCard';
import CartDrawer from './CartDrawer';
import OrderTracker from './OrderTracker';
import { Search, Filter, Sparkles, MapPin, RefreshCw, ShoppingBag } from 'lucide-react';

export default function RetailSection({ listings, orders, onAddToCart, cart, updateQuantity, removeItem, clearCart, isCartOpen, setIsCartOpen, onUpdateOrderStatus, refreshListings }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract available localities
  const localities = ['All', ...new Set(listings.map(l => l.locality))];

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLocality = selectedLocality === 'All' || item.locality === selectedLocality;
    const matchesSearch = item.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.locality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLocality && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner for Retail */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-8 sm:p-10 shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retail Consumer Portal • Zero Middleman Commission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Buy Fresh Farm Produce Directly From Local Farmers
          </h1>
          <p className="text-sm text-emerald-100/90 font-normal leading-relaxed">
            100% of your payment goes straight to verified local agricultural producers. Guaranteeing peak field freshness, fair pricing, and complete farm origin transparency.
          </p>
        </div>
        {/* Background Decorative Graphic */}
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <ShoppingBag className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Active Orders Tracking Panel */}
      {orders && orders.length > 0 && (
        <OrderTracker orders={orders} onUpdateStatus={onUpdateOrderStatus} />
      )}

      {/* Search & Filter Control Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by crop name (e.g. Tomato, Mango), farmer, or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm font-medium transition-all"
            />
          </div>

          {/* Category Tabs (All / Vegetables / Fruits) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl space-x-1 shrink-0">
            {[
              { id: 'all', label: 'All Crops' },
              { id: 'vegetable', label: 'Vegetables' },
              { id: 'fruit', label: 'Fruits' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all touch-manipulation ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Locality Quick Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center shrink-0">
            <MapPin className="w-3.5 h-3.5 mr-1 text-amber-500" /> Locality:
          </span>
          {localities.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocality(loc)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedLocality === loc
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">
            Available Harvest Listings ({filteredListings.length})
          </h2>
          <button
            onClick={refreshListings}
            className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Produce</span>
          </button>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
            <Search className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No produce listings found</h3>
            <p className="text-xs text-slate-400">Try clearing filters or searching for a different crop name or locality.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => {
              const isAdded = cart.some(item => item._id === listing._id);
              return (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onAddToCart={onAddToCart}
                  isAdded={isAdded}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
        onOrderPlaced={refreshListings}
      />

    </div>
  );
}
