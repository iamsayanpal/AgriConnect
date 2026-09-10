import os
import math
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AgriConnect AI Pricing & Demand Microservice",
    description="Dynamic price suggestion & demand forecasting for agricultural produce",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Baseline crop market reference prices (INR per kg)
CROP_BASE_PRICES = {
    "Tomato": 38.0,
    "Potato": 24.0,
    "Onion": 32.0,
    "Spinach": 20.0,
    "Carrot": 35.0,
    "Cauliflower": 30.0,
    "Bell Pepper": 55.0,
    "Brinjal": 28.0,
    "Garlic": 140.0,
    "Ginger": 110.0,
    "Apple": 120.0,
    "Banana": 45.0,
    "Mango": 90.0,
    "Orange": 65.0,
    "Grapes": 80.0,
    "Papaya": 35.0,
    "Guava": 40.0,
    "Pomegranate": 130.0,
    "Watermelon": 22.0
}

# Locality demand index multipliers
LOCALITY_MULTIPLIERS = {
    "Nashik": 0.95,      # Major production hub, slightly lower price
    "Pune": 1.08,        # High retail & bulk demand
    "Mumbai": 1.25,      # High urban demand & transit cost
    "Nagpur": 1.00,
    "Aurangabad": 0.98,
    "Bangalore": 1.18,
    "Delhi": 1.22
}

class ForecastResponse(BaseModel):
    crop: str
    locality: str
    base_price: float
    suggested_price: float
    min_price: float
    max_price: float
    demand_index: str  # "HIGH", "MODERATE", "VERY HIGH"
    demand_percentage: float
    market_trend: str
    recommendation: str

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "AgriConnect AI Microservice"}

@app.get("/predict", response_model=ForecastResponse)
@app.get("/api/ai/forecast/{crop}/{locality}", response_model=ForecastResponse)
def get_price_forecast(crop: str, locality: str):
    # Normalize inputs
    crop_clean = crop.strip().title()
    locality_clean = locality.strip().title()

    # Get base price or generate fallback based on string hashing
    base = CROP_BASE_PRICES.get(crop_clean)
    if base is None:
        # Fallback hash for unknown crops
        hash_val = sum(ord(c) for c in crop_clean)
        base = round(25.0 + (hash_val % 60), 2)

    # Locality multiplier
    loc_mult = LOCALITY_MULTIPLIERS.get(locality_clean, 1.05)

    # Dynamic factor based on crop name length & characters for deterministic realistic simulation
    crop_factor = 1.0 + (sum(ord(c) for c in crop_clean) % 15 - 5) / 100.0

    # Calculate dynamic price
    suggested = round(base * loc_mult * crop_factor, 2)
    min_p = round(suggested * 0.88, 2)
    max_p = round(suggested * 1.15, 2)

    # Calculate demand metrics
    demand_pct = round(10.0 + (sum(ord(c) for c in crop_clean + locality_clean) % 25), 1)
    
    if demand_pct >= 25:
        demand_str = "VERY HIGH"
        trend = "Surging (+20% demand from bulk buyers)"
        rec = f"High urban demand in {locality_clean}. You can price up to ₹{max_p}/kg."
    elif demand_pct >= 18:
        demand_str = "HIGH"
        trend = "Steady High (+12% above 30-day avg)"
        rec = f"Favorable market conditions. Recommended listing price: ₹{suggested}/kg."
    else:
        demand_str = "MODERATE"
        trend = "Stable (+5% consistent demand)"
        rec = f"Balanced supply & demand. Fast sales expected near ₹{suggested}/kg."

    return ForecastResponse(
        crop=crop_clean,
        locality=locality_clean,
        base_price=base,
        suggested_price=suggested,
        min_price=min_p,
        max_price=max_p,
        demand_index=demand_str,
        demand_percentage=demand_pct,
        market_trend=trend,
        recommendation=rec
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
