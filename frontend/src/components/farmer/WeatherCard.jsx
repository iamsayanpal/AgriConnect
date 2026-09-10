import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSun, MapPin, RefreshCw, Sparkles, Thermometer } from 'lucide-react';

export default function WeatherCard({ locality }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, [locality]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather/${encodeURIComponent(locality || 'Nashik')}`);
      const data = await res.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather forecast:', err);
      setLoading(false);
    }
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'cloud-rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'cloud-sun':
        return <CloudSun className="w-8 h-8 text-amber-500" />;
      default:
        return <Sun className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold">
              Google Weather / Forecast API
            </span>
            <span className="text-xs text-slate-400 font-medium">Server-side Proxied</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center">
            <MapPin className="w-5 h-5 text-amber-500 mr-1.5" />
            <span>Multi-Day Agricultural Forecast for {locality || 'Nashik'}</span>
          </h3>
        </div>

        <button
          onClick={fetchWeather}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Refresh Forecast"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs font-semibold">
          Fetching live weather data from server API...
        </div>
      ) : weatherData ? (
        <div className="space-y-6">
          
          {/* Day-by-Day Forecast Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {weatherData.forecast?.map((fc, idx) => (
              <div
                key={fc.day}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-b from-amber-50 to-orange-50/50 border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200/70 hover:bg-white'
                }`}
              >
                <span className="text-xs font-extrabold text-slate-800 block">{fc.day}</span>
                <span className="text-[10px] text-slate-400 block mb-2">{fc.date}</span>

                <div className="my-2 flex justify-center">
                  {renderIcon(fc.icon)}
                </div>

                <div className="text-xs font-extrabold text-slate-900 mt-1">
                  {fc.max_temp}°C <span className="text-slate-400 text-[11px] font-medium">/ {fc.min_temp}°C</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] font-bold text-blue-700">
                  ☔ {fc.rain_chance}% Rain
                </div>
              </div>
            ))}
          </div>

          {/* Agricultural Actionable Insights */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3 text-xs text-amber-950 font-medium">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold block text-amber-900 mb-0.5">Farmer Harvest & Spraying Advisory:</strong>
              <p>{weatherData.forecast?.[0]?.advice || 'Ideal conditions for crop harvesting and transport today.'}</p>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
