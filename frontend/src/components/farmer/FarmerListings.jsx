import React, { useState } from 'react';
import { Plus, Sparkles, MapPin, Trash2, Edit } from 'lucide-react';
import AddListingModal from './AddListingModal';

export default function FarmerListings({ listings, onListingAdded, onDeleteListing }) {
  const [activeTab, setActiveTab] = useState('vegetables'); // 'vegetables' | 'fruits'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter listings by category tab
  const categoryFilter = activeTab === 'vegetables' ? 'vegetable' : 'fruit';
  const currentTabListings = listings.filter(l => l.category === categoryFilter);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Top Header with Tab Switcher & Add New Listing Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        
        {/* Tab Buttons ("Vegetables" and "Fruits") */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl space-x-1 self-start">
          <button
            onClick={() => setActiveTab('vegetables')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all touch-manipulation ${
              activeTab === 'vegetables'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🥦 Vegetables ({listings.filter(l => l.category === 'vegetable').length})
          </button>

          <button
            onClick={() => setActiveTab('fruits')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all touch-manipulation ${
              activeTab === 'fruits'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍎 Fruits ({listings.filter(l => l.category === 'fruit').length})
          </button>
        </div>

        {/* Add New Listing Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center space-x-2 transition-all shadow-md shadow-amber-200 active:scale-95 touch-manipulation self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New {activeTab === 'vegetables' ? 'Vegetable' : 'Fruit'} Listing</span>
        </button>

      </div>

      {/* Active Tab Listings Grid */}
      <div>
        {currentTabListings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
            <p className="text-sm font-bold text-slate-600">No {activeTab} listings currently active</p>
            <p className="text-xs text-slate-400">Click the button above to publish a new {activeTab} harvest listing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTabListings.map((listing) => (
              <div
                key={listing._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <img src={listing.image_url} alt={listing.crop_name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">{listing.crop_name}</h4>
                      {onDeleteListing && (
                        <button
                          onClick={() => onDeleteListing(listing._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500 mr-1 shrink-0" /> {listing.locality}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      Stock: <strong className="text-slate-900">{listing.quantity} {listing.unit || 'kg'}</strong>
                    </p>
                  </div>
                </div>

                {/* Price & AI Suggested Price Badge */}
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Your Price</span>
                    <strong className="text-slate-900 text-sm font-extrabold">₹{listing.price} / kg</strong>
                  </div>

                  {listing.ai_suggested_price && (
                    <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-200/80 text-amber-900 text-right">
                      <span className="text-[10px] font-extrabold text-amber-800 flex items-center justify-end">
                        <Sparkles className="w-3 h-3 mr-0.5 text-amber-600" /> AI Dynamic Price
                      </span>
                      <strong className="text-xs font-extrabold block mt-0.5">₹{listing.ai_suggested_price} / kg</strong>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Listing Modal */}
      <AddListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTabCategory={activeTab}
        onListingAdded={onListingAdded}
      />

    </div>
  );
}
