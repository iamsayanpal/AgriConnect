import React from 'react';
import { MapPin, User, Tag, Plus, Check } from 'lucide-react';

export default function ListingCard({ listing, onAddToCart, isAdded }) {
  const isFruit = listing.category === 'fruit';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Produce Image Container with real image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={listing.image_url}
          alt={listing.crop_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
            isFruit 
              ? 'bg-amber-500 text-white' 
              : 'bg-emerald-600 text-white'
          }`}>
            {listing.category}
          </span>
        </div>

        {/* Available Stock Tag */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
          {listing.quantity} {listing.unit || 'kg'} available
        </div>
      </div>

      {/* Produce Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
              {listing.crop_name}
            </h3>
          </div>

          {/* Farmer & Locality Metadata */}
          <div className="mt-2.5 space-y-1 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-1.5 text-slate-700">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{listing.farmer_name}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{listing.locality}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900">₹{listing.price}</span>
            <span className="text-xs text-slate-500 font-semibold"> / {listing.unit || 'kg'}</span>
            {listing.ai_suggested_price && (
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                AI Value Price
              </p>
            )}
          </div>

          <button
            onClick={() => onAddToCart(listing)}
            disabled={listing.quantity <= 0}
            className={`px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center space-x-1.5 transition-all active:scale-95 touch-manipulation ${
              listing.quantity <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
