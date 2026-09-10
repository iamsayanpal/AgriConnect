import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Truck, ExternalLink, RefreshCw, Route } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function PickupRouteCard({ locality }) {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoute();
  }, [locality]);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/route/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locality: locality || 'Nashik' })
      });
      const data = await res.json();
      setRouteData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error computing optimized pickup route:', err);
      setLoading(false);
    }
  };

  const mapCenter = routeData?.stops?.[0]
    ? [routeData.stops[0].lat, routeData.stops[0].lng]
    : [20.0059, 73.7898];

  const polylineCoords = routeData?.stops
    ? routeData.stops.map(s => [s.lat, s.lng])
    : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold">
              Google Maps Directions API
            </span>
            <span className="text-xs text-slate-400 font-medium">Server-side TSP Optimization</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center">
            <Route className="w-5 h-5 text-amber-600 mr-1.5" />
            <span>Today's Multi-Stop Pickup Route (Hub ➔ Village Stops)</span>
          </h3>
        </div>

        <button
          onClick={fetchRoute}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-Optimize Stops</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-semibold">
          Calculating shortest pickup sequence via Google Maps Directions API...
        </div>
      ) : routeData ? (
        <div className="space-y-6">
          
          {/* Key Metrics Bar & Auto-Transfer to Google Maps Button */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <span className="text-amber-800/70 block text-[11px]">Total Pickup Distance</span>
                <strong className="text-slate-900 text-lg font-extrabold flex items-center">
                  <Truck className="w-4 h-4 text-amber-600 mr-1" /> {routeData.total_distance_km} km
                </strong>
              </div>

              <div>
                <span className="text-amber-800/70 block text-[11px]">Estimated Driving ETA</span>
                <strong className="text-slate-900 text-lg font-extrabold flex items-center">
                  <Clock className="w-4 h-4 text-amber-600 mr-1" /> ~{routeData.total_eta_mins} mins
                </strong>
              </div>

              <div>
                <span className="text-amber-800/70 block text-[11px]">Total Collection Stops</span>
                <strong className="text-slate-900 text-lg font-extrabold">
                  {routeData.stops?.length || 4} Stops
                </strong>
              </div>
            </div>

            {/* Cab-Driver Style Auto Transfer to Google Maps Navigation Button */}
            {routeData.google_maps_nav_url && (
              <a
                href={routeData.google_maps_nav_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-200 active:scale-95 touch-manipulation shrink-0"
              >
                <Navigation className="w-4 h-4 fill-white" />
                <span>Auto Transfer to Google Maps Navigation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

          </div>

          {/* Embedded Route Map */}
          <div className="h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
            <MapContainer
              center={mapCenter}
              zoom={10}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {routeData.stops?.map((stop, idx) => (
                <Marker key={stop._id || idx} position={[stop.lat, stop.lng]}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="font-bold text-slate-900">Stop #{idx + 1}: {stop.name}</strong>
                      <p className="text-slate-500 mt-1">{stop.address || stop.locality}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {polylineCoords.length > 1 && (
                <Polyline positions={polylineCoords} color="#d97706" weight={4} dashArray="6, 8" />
              )}
            </MapContainer>
          </div>

          {/* Stop Order List */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Optimized Stop Sequence</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
              {routeData.stops?.map((stop, idx) => (
                <div key={stop._id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-[11px] shrink-0">
                    {idx + 1}
                  </div>
                  <div className="truncate">
                    <span className="text-slate-900 font-bold block truncate">{stop.name}</span>
                    <span className="text-slate-400 text-[11px] font-normal">{stop.address || stop.locality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
