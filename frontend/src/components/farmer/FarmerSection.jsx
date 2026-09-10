import React, { useState } from 'react';
import FarmerListings from './FarmerListings';
import WeatherCard from './WeatherCard';
import PickupRouteCard from './PickupRouteCard';
import { Sprout, MapPin, Sparkles } from 'lucide-react';

export default function FarmerSection({ listings, onListingAdded, onDeleteListing }) {
  const [farmerLocality, setFarmerLocality] = useState('Nashik');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner for Farmer Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-800 via-amber-700 to-yellow-800 text-white p-8 sm:p-10 shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-900/60 text-amber-100 text-xs font-bold tracking-wide">
            <Sprout className="w-3.5 h-3.5" />
            <span>Farmer & FPO Producer Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Direct Farm Produce Management & AI Market Insights
          </h1>
          <p className="text-sm text-amber-100/90 font-normal leading-relaxed">
            Eliminate commission agents. Set real-time AI dynamic prices, view local Google Weather forecasts, and optimize multi-stop pickup logistics.
          </p>

          {/* Quick Locality Selector */}
          <div className="pt-2 flex items-center space-x-2 text-xs font-bold">
            <span className="text-amber-200 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" /> Selected Farm Region:
            </span>
            <select
              value={farmerLocality}
              onChange={(e) => setFarmerLocality(e.target.value)}
              className="bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-xl border border-white/30 focus:outline-none font-bold"
            >
              <option value="Nashik" className="text-slate-900">Nashik Region</option>
              <option value="Pimpalgaon" className="text-slate-900">Pimpalgaon</option>
              <option value="Ozar" className="text-slate-900">Ozar Organic Hub</option>
              <option value="Sinnar" className="text-slate-900">Sinnar Cold Chain</option>
              <option value="Pune" className="text-slate-900">Pune District</option>
            </select>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Sprout className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* 1. At the TOP of the Farmer Section: Listing manager split into Vegetables and Fruits tabs */}
      <FarmerListings
        listings={listings}
        onListingAdded={onListingAdded}
        onDeleteListing={onDeleteListing}
      />

      {/* 2. Weather Forecast Card (Google Weather / Forecast API) */}
      <WeatherCard locality={farmerLocality} />

      {/* 3. Multi-stop Pickup Route Optimization Card (Google Maps Directions API & Direct Navigation Link) */}
      <PickupRouteCard locality={farmerLocality} />

    </div>
  );
}
