import React, { useState, useEffect } from 'react';
import { X, Sprout, Sparkles, CheckCircle2, DollarSign } from 'lucide-react';

export default function AddListingModal({ isOpen, onClose, activeTabCategory, onListingAdded }) {
  const [farmerName, setFarmerName] = useState('Ramesh Patil (Nashik FPO)');
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState(250);
  const [price, setPrice] = useState(35);
  const [locality, setLocality] = useState('Nashik');
  const [imageUrl, setImageUrl] = useState('');
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Category auto-set by active tab ('vegetable' | 'fruit')
  const category = activeTabCategory === 'fruits' ? 'fruit' : 'vegetable';

  // Default real images presets for quick selection
  const imagePresets = category === 'fruit' ? [
    { label: 'Red Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop' },
    { label: 'Yellow Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop' },
    { label: 'Alphonso Mangoes', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop' },
    { label: 'Black Grapes', url: 'https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?w=600&auto=format&fit=crop' },
    { label: 'Fresh Oranges', url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop' }
  ] : [
    { label: 'Red Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop' },
    { label: 'Fresh Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop' },
    { label: 'Nashik Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop' },
    { label: 'Green Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop' },
    { label: 'Fresh Carrots', url: 'https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=600&auto=format&fit=crop' }
  ];

  // Fetch AI suggested price whenever cropName or locality changes
  useEffect(() => {
    if (!cropName || cropName.length < 2) return;
    const timer = setTimeout(() => {
      fetchAiForecast();
    }, 400);
    return () => clearTimeout(timer);
  }, [cropName, locality]);

  const fetchAiForecast = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/ai/forecast/${encodeURIComponent(cropName)}/${encodeURIComponent(locality || 'Nashik')}`);
      const data = await res.json();
      if (data && data.suggested_price) {
        setAiSuggestedPrice(data.suggested_price);
        setAiRecommendation(data.recommendation);
        // Pre-fill price with AI suggested price if not set manually
        if (!price || price === 35) {
          setPrice(data.suggested_price);
        }
      }
      setAiLoading(false);
    } catch (err) {
      console.error('AI forecast fetch error:', err);
      setAiLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedImg = imageUrl || imagePresets[0].url;
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_name: farmerName,
          category,
          crop_name: cropName,
          quantity: Number(quantity),
          price: Number(price),
          ai_suggested_price: aiSuggestedPrice || price,
          locality,
          image_url: selectedImg
        })
      });

      const newListing = await res.json();
      setSubmitting(false);
      if (onListingAdded) onListingAdded(newListing);
      onClose();
    } catch (err) {
      console.error('Error adding new listing:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Post New Produce Listing</h3>
              <p className="text-xs text-slate-500 font-medium">Category auto-set to <strong className="text-amber-800 capitalize">{category}s</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          
          <div>
            <label className="block mb-1 text-slate-800">Farmer / FPO Name</label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/30 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-800">Crop Name</label>
              <input
                type="text"
                placeholder="e.g. Tomato, Mango"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/30 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-800">Harvest Locality</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/30 outline-none"
              />
            </div>
          </div>

          {/* AI Price Suggestion Callout Card */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-amber-900 font-extrabold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Python FastAPI Dynamic Price Engine</span>
              </div>
              {aiLoading && <span className="text-[10px] text-amber-700 font-normal">Calculating...</span>}
            </div>

            {aiSuggestedPrice ? (
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-slate-900">₹{aiSuggestedPrice}</span>
                  <span className="text-xs text-amber-800 font-bold">/ kg suggested target</span>
                  <button
                    type="button"
                    onClick={() => setPrice(aiSuggestedPrice)}
                    className="ml-auto px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold shadow-sm"
                  >
                    Apply AI Price
                  </button>
                </div>
                <p className="text-[11px] text-amber-900/90 font-medium">{aiRecommendation}</p>
              </div>
            ) : (
              <p className="text-[11px] text-amber-800 font-medium">
                Type a crop name above to fetch live Python AI market price suggestions.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-800">Quantity Available (kg)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="10"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/30 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-800">Your Price (₹ / kg)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/30 outline-none"
              />
            </div>
          </div>

          {/* Real Photo Selector */}
          <div>
            <label className="block mb-1 text-slate-800">Select Real Produce Photo</label>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {imagePresets.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                    (imageUrl === img.url || (!imageUrl && img === imagePresets[0]))
                      ? 'border-amber-600 ring-2 ring-amber-200 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm transition-all shadow-md shadow-amber-200 active:scale-98 touch-manipulation"
            >
              {submitting ? 'Publishing Listing...' : `Publish ${category === 'fruit' ? 'Fruit' : 'Vegetable'} Listing`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
