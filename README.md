# AgriConnect - Digital Farm-to-Consumer & Bulk Marketplace

AgriConnect is a full-stack web prototype that directly connects farmers and Farmer Producer Organizations (FPOs) with retail consumers and bulk buyers, cutting out intermediary middlemen.

---

## 🌟 Key Features & Prototype Highlights

### 1. Zero-Auth Role Switcher (Top Navigation Bar)
- Instant view switcher between **Retail**, **Bulk Buyer**, and **Farmer** views.
- No sign-up flow, credentials, or authentication gates required for prototype testing.
- Subtle role-specific color theme accents (Emerald for Retail, Royal Blue for Bulk Buyer, Amber for Farmer).

### 2. Retail Section
- **Real Produce Imagery**: Produce cards featuring crisp, real photos of vegetables and fruits.
- **Search & Filters**: Filter by category (`Vegetables` / `Fruits`), locality (Nashik, Pimpalgaon, Ozar, Sinnar, Pune, Mumbai, Nagpur), or crop search.
- **Cart & Checkout**: Interactive slide-over cart drawer with quantity adjusters, subtotal calculation, and mock payment options (UPI / COD / Card).
- **Order Tracking Timeline**: Visual tracking steps (`Placed` ➔ `Picked Up` ➔ `In Transit` ➔ `Delivered`).
- **Direct Pickup Navigation**: Cab-driver style "Navigate in Google Maps to Pickup Location" deep-link button.

### 3. Bulk Buyer Section
- **Standing / Recurring Order Form**: Automate recurring wholesale produce shipments (Daily, Weekly, Bi-weekly, Monthly).
- **FPO & Supplier Directory**: Verified FPO profiles with supply capacity (e.g. 120 Tons/Month), average price per kg, ratings, and contact details.
- **Forward-Pricing Contracts**: Request and lock in seasonal harvest price offers with regional FPO collectives.

### 4. Farmer Section
- **Tabbed Produce Manager (Top of Farmer Page)**: Split into **"Vegetables"** and **"Fruits"** tabs. Allows farmers to publish new produce listings with category auto-selected based on the active tab.
- **Python AI Dynamic Price Engine**: Real-time suggested price recommendation badge next to each listing, powered by the Python FastAPI microservice.
- **Google Weather Forecast Card**: Multi-day temperature, rain chance %, and agricultural harvesting advice for the farmer's locality.
- **Pickup Route Optimization Card**: Computes an optimized multi-stop pickup sequence (Aggregation Hub ➔ Village Stops) using server-side Google Maps Directions API, complete with interactive Leaflet map, distance, ETA, and a prominent **"Auto Transfer to Google Maps Navigation"** button.

---

## 🏗️ Project Architecture & Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Leaflet Maps (`/frontend`)
- **Backend REST API**: Node.js, Express.js, Mongoose, Axios (`/backend`)
- **Database**: MongoDB with Mongoose (includes automatic zero-config `mongodb-memory-server` fallback if local MongoDB server is not running)
- **AI Microservice**: Python FastAPI, Uvicorn, Pydantic (`/ai-service`)
- **Maps & Weather**: Google Maps Directions API & Google Weather API (called server-side from Node backend for key security)

---

## 🚀 How to Run the App

### Prerequisites
- Node.js (v18+) & npm
- Python 3.9+ with pip

---

### Step 1: Start the AI Microservice (Python FastAPI)

```bash
cd ai-service
pip install -r requirements.txt
python main.py
```
*Runs on `http://localhost:8000`*

---

### Step 2: Seed & Start the Backend REST API (Node.js + Express)

```bash
cd backend
npm install

# Seed sample database (Farmers, Real Produce Listings, Pickup Points, Orders)
npm run seed

# Start Express server
npm start
```
*Runs on `http://localhost:5000`*

---

### Step 3: Start the Frontend Application (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
*Runs on `http://localhost:3000`*

---

## 🔑 Adding Google Maps & Google Weather API Keys

API keys are **always called server-side** in the Node backend to keep secret keys completely safe from frontend exposure.

Create or update a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agriconnect
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_DIRECTIONS_API_KEY
GOOGLE_WEATHER_API_KEY=YOUR_GOOGLE_WEATHER_API_KEY
AI_SERVICE_URL=http://localhost:8000
```

> **Note**: If no API keys are provided in `.env`, AgriConnect automatically uses its built-in server-side route optimization engine and weather forecast generator. All deep-link transfers to Google Maps (`https://www.google.com/maps/dir/?api=1&...`) work out of the box!
