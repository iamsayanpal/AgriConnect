import React from 'react';
import { ShoppingBag, Truck, Sprout, ShoppingCart, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, cartCount, onOpenCart }) {
  const roles = [
    {
      id: 'retail',
      label: 'Retail',
      desc: 'Consumer Produce Market',
      icon: ShoppingBag,
      activeBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-200',
      activeBorder: 'border-emerald-500',
      accentTag: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'bulk',
      label: 'Bulk Buyer',
      desc: 'Wholesale & FPO Contracts',
      icon: Truck,
      activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-200',
      activeBorder: 'border-blue-500',
      accentTag: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'farmer',
      label: 'Farmer',
      desc: 'Listings, Weather & Routes',
      icon: Sprout,
      activeBg: 'bg-amber-600 text-white shadow-md shadow-amber-200',
      activeBorder: 'border-amber-500',
      accentTag: 'bg-amber-100 text-amber-800'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-100">
              <Sprout className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700 bg-clip-text text-transparent">
                  AgriConnect
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Direct Market
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">Zero Intermediary Direct Farm Ecosystem</p>
            </div>
          </div>

          {/* Role Switcher Pills (Large Touch Targets for Android/Mobile Users) */}
          <nav className="flex items-center p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 space-x-1 sm:space-x-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 touch-manipulation ${
                    isActive
                      ? r.activeBg
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  aria-label={`Switch to ${r.label} mode`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="tracking-wide">{r.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities (Cart for Retail mode) */}
          <div className="flex items-center space-x-3">
            {activeRole === 'retail' && (
              <button
                onClick={onOpenCart}
                className="relative p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 transition-all active:scale-95 flex items-center space-x-2 font-semibold text-sm"
              >
                <ShoppingCart className="w-5 h-5 text-emerald-700" />
                <span className="hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
