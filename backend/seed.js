const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const User = require('./models/User');
const ProduceListing = require('./models/ProduceListing');
const Order = require('./models/Order');
const PickupPoint = require('./models/PickupPoint');
const RecurringOrder = require('./models/RecurringOrder');
const ForwardContract = require('./models/ForwardContract');

const sampleUsers = [
  {
    name: 'Ramesh Patil',
    phone: '+91 98220 11223',
    role: 'farmer',
    locality: 'Nashik',
    rating: 4.9,
    capacity: '40 Tons / Month'
  },
  {
    name: 'Suresh Deshmukh',
    phone: '+91 98221 33445',
    role: 'farmer',
    locality: 'Pimpalgaon',
    rating: 4.8,
    capacity: '25 Tons / Month'
  },
  {
    name: 'Sunita Sharma',
    phone: '+91 98765 43210',
    role: 'consumer',
    locality: 'Pune'
  },
  {
    name: 'BigBasket Wholesale Hub',
    phone: '+91 91234 56789',
    role: 'bulk_buyer',
    locality: 'Mumbai'
  }
];

const sampleListings = [
  // VEGETABLES
  {
    owner_id: 'farmer-01',
    farmer_name: 'Ramesh Patil (Nashik FPO)',
    category: 'vegetable',
    crop_name: 'Organic Red Tomato',
    quantity: 450,
    unit: 'kg',
    price: 34,
    ai_suggested_price: 38,
    locality: 'Nashik',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-02',
    farmer_name: 'Suresh Deshmukh',
    category: 'vegetable',
    crop_name: 'Farm Fresh Potatoes',
    quantity: 800,
    unit: 'kg',
    price: 22,
    ai_suggested_price: 25,
    locality: 'Pimpalgaon',
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-01',
    farmer_name: 'Ramesh Patil (Nashik FPO)',
    category: 'vegetable',
    crop_name: 'Nashik Red Onions',
    quantity: 1200,
    unit: 'kg',
    price: 29,
    ai_suggested_price: 32,
    locality: 'Nashik',
    image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-03',
    farmer_name: 'Anand Shinde (Ozar Co-op)',
    category: 'vegetable',
    crop_name: 'Crisp Green Spinach',
    quantity: 150,
    unit: 'kg',
    price: 18,
    ai_suggested_price: 22,
    locality: 'Ozar',
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-02',
    farmer_name: 'Suresh Deshmukh',
    category: 'vegetable',
    crop_name: 'Crunchy Orange Carrots',
    quantity: 350,
    unit: 'kg',
    price: 32,
    ai_suggested_price: 36,
    locality: 'Pimpalgaon',
    image_url: 'https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-04',
    farmer_name: 'Ganesh Kadam',
    category: 'vegetable',
    crop_name: 'Fresh Cauliflower',
    quantity: 280,
    unit: 'kg',
    price: 26,
    ai_suggested_price: 30,
    locality: 'Sinnar',
    image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-01',
    farmer_name: 'Ramesh Patil (Nashik FPO)',
    category: 'vegetable',
    crop_name: 'Capsicum / Bell Pepper',
    quantity: 200,
    unit: 'kg',
    price: 50,
    ai_suggested_price: 56,
    locality: 'Nashik',
    image_url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-03',
    farmer_name: 'Anand Shinde (Ozar Co-op)',
    category: 'vegetable',
    crop_name: 'Purple Brinjal / Eggplant',
    quantity: 300,
    unit: 'kg',
    price: 25,
    ai_suggested_price: 28,
    locality: 'Ozar',
    image_url: 'https://images.unsplash.com/photo-1623867634289-53e34b953d68?w=600&auto=format&fit=crop'
  },

  // FRUITS
  {
    owner_id: 'farmer-05',
    farmer_name: 'Kiran Pawar (Kashmir-Sahyadri Orchards)',
    category: 'fruit',
    crop_name: 'Crisp Shimla Apples',
    quantity: 600,
    unit: 'kg',
    price: 110,
    ai_suggested_price: 124,
    locality: 'Nashik',
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-06',
    farmer_name: 'Babu Rao (Jalgaon Banana Hub)',
    category: 'fruit',
    crop_name: 'Golden Robusta Bananas',
    quantity: 1500,
    unit: 'kg',
    price: 38,
    ai_suggested_price: 44,
    locality: 'Pimpalgaon',
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-07',
    farmer_name: 'Ratnagiri Agro Collective',
    category: 'fruit',
    crop_name: 'Alphonso Mangoes (Devgad)',
    quantity: 400,
    unit: 'kg',
    price: 180,
    ai_suggested_price: 195,
    locality: 'Mumbai',
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-08',
    farmer_name: 'Nagpur Citrus Farm',
    category: 'fruit',
    crop_name: 'Sweet Nagpur Oranges',
    quantity: 750,
    unit: 'kg',
    price: 58,
    ai_suggested_price: 66,
    locality: 'Nagpur',
    image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-01',
    farmer_name: 'Ramesh Patil (Nashik FPO)',
    category: 'fruit',
    crop_name: 'Seedless Black Grapes',
    quantity: 500,
    unit: 'kg',
    price: 72,
    ai_suggested_price: 82,
    locality: 'Nashik',
    image_url: 'https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-03',
    farmer_name: 'Anand Shinde (Ozar Co-op)',
    category: 'fruit',
    crop_name: 'Farm Fresh Papaya',
    quantity: 600,
    unit: 'kg',
    price: 30,
    ai_suggested_price: 35,
    locality: 'Ozar',
    image_url: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-04',
    farmer_name: 'Ganesh Kadam',
    category: 'fruit',
    crop_name: 'Red Bhagwa Pomegranate',
    quantity: 450,
    unit: 'kg',
    price: 120,
    ai_suggested_price: 135,
    locality: 'Sinnar',
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop'
  },
  {
    owner_id: 'farmer-02',
    farmer_name: 'Suresh Deshmukh',
    category: 'fruit',
    crop_name: 'Sugar Baby Watermelon',
    quantity: 900,
    unit: 'kg',
    price: 18,
    ai_suggested_price: 22,
    locality: 'Pimpalgaon',
    image_url: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=600&auto=format&fit=crop'
  }
];

const samplePickupPoints = [
  {
    locality: 'Nashik',
    name: 'Nashik Aggregation Hub (Start)',
    lat: 20.0059,
    lng: 73.7898,
    address: 'Main APMC Market Yard, Highway 3, Nashik',
    farmer_name: 'Nashik Central FPO Storage'
  },
  {
    locality: 'Pimpalgaon',
    name: 'Pimpalgaon Farmer Co-op Stop 1',
    lat: 20.1740,
    lng: 73.9890,
    address: 'Gate #4, Onion & Potato Yard, Pimpalgaon',
    farmer_name: 'Suresh Deshmukh'
  },
  {
    locality: 'Ozar',
    name: 'Ozar Organic Produce Collection Stop 2',
    lat: 20.0965,
    lng: 73.9312,
    address: 'Village Center, Near Bus Stand, Ozar',
    farmer_name: 'Anand Shinde'
  },
  {
    locality: 'Sinnar',
    name: 'Sinnar Cold Chain Logistics Stop 3 (End)',
    lat: 19.8453,
    lng: 73.9984,
    address: 'MIDC Cold Storage Complex, Sinnar',
    farmer_name: 'Ganesh Kadam'
  }
];

const sampleOrders = [
  {
    buyer_name: 'Sunita Sharma',
    buyer_phone: '+91 98765 43210',
    buyer_type: 'retail',
    crop_name: 'Organic Red Tomato',
    category: 'vegetable',
    quantity: 5,
    unit: 'kg',
    total_price: 170,
    farmer_name: 'Ramesh Patil (Nashik FPO)',
    locality: 'Nashik',
    pickup_lat: 20.0059,
    pickup_lng: 73.7898,
    status: 'in transit'
  },
  {
    buyer_name: 'Amit Verma',
    buyer_phone: '+91 98111 22334',
    buyer_type: 'retail',
    crop_name: 'Alphonso Mangoes',
    category: 'fruit',
    quantity: 10,
    unit: 'kg',
    total_price: 1800,
    farmer_name: 'Ratnagiri Agro Collective',
    locality: 'Mumbai',
    pickup_lat: 19.0760,
    pickup_lng: 72.8777,
    status: 'picked up'
  },
  {
    buyer_name: 'Green Grocers Retail',
    buyer_phone: '+91 99887 66554',
    buyer_type: 'retail',
    crop_name: 'Nashik Red Onions',
    category: 'vegetable',
    quantity: 50,
    unit: 'kg',
    total_price: 1450,
    farmer_name: 'Ramesh Patil (Nashik FPO)',
    locality: 'Nashik',
    pickup_lat: 20.0059,
    pickup_lng: 73.7898,
    status: 'placed'
  }
];

const sampleRecurringOrders = [
  {
    buyer_name: 'Reliance Fresh Logistics',
    crop_name: 'Nashik Red Onions',
    quantity_per_delivery: 500,
    frequency: 'Weekly',
    locality: 'Nashik',
    preferred_supplier: 'Nashik Valley Farmer Producer Co-op',
    status: 'Active'
  },
  {
    buyer_name: 'More Megastore Bulk',
    crop_name: 'Organic Red Tomato',
    quantity_per_delivery: 300,
    frequency: 'Bi-weekly',
    locality: 'Pune',
    preferred_supplier: 'Sahyadri Agro Farmers Federation',
    status: 'Active'
  }
];

const sampleContracts = [
  {
    buyer_name: 'BigBasket Direct Sourcing',
    supplier_name: 'Nashik Valley Farmer Producer Co-op',
    crop_name: 'Alphonso Mangoes',
    quantity_tons: 15,
    target_price_per_kg: 165,
    delivery_month: 'April 2027',
    status: 'Accepted'
  },
  {
    buyer_name: 'Star Bazaar Procurement',
    supplier_name: 'Sahyadri Agro Farmers Federation',
    crop_name: 'Crisp Shimla Apples',
    quantity_tons: 25,
    target_price_per_kg: 105,
    delivery_month: 'October 2026',
    status: 'Pending Approval'
  }
];

async function seedData() {
  const customUri = process.env.MONGODB_URI;
  if (customUri) {
    try {
      await mongoose.connect(customUri);
      console.log('Connected to MongoDB via URI for seeding...');
    } catch (err) {
      console.warn('Could not connect to custom MONGODB_URI, initializing MongoMemoryServer for seed...');
    }
  }

  if (mongoose.connection.readyState !== 1) {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Connected to In-Memory MongoDB for seeding:', mongoUri);
  }

  console.log('Seeding Database records...');

  await User.deleteMany({});
  await ProduceListing.deleteMany({});
  await Order.deleteMany({});
  await PickupPoint.deleteMany({});
  await RecurringOrder.deleteMany({});
  await ForwardContract.deleteMany({});

  await User.insertMany(sampleUsers);
  await ProduceListing.insertMany(sampleListings);
  await Order.insertMany(sampleOrders);
  await PickupPoint.insertMany(samplePickupPoints);
  await RecurringOrder.insertMany(sampleRecurringOrders);
  await ForwardContract.insertMany(sampleContracts);

  console.log('Database Seeding Completed Successfully!');
  console.log(`- ${sampleListings.length} Produce Listings (Vegetables & Fruits with Real Images)`);
  console.log(`- ${samplePickupPoints.length} Pickup Points`);
  console.log(`- ${sampleOrders.length} Tracked Orders`);
  console.log(`- ${sampleRecurringOrders.length} Recurring Orders`);
  console.log(`- ${sampleContracts.length} Forward Contracts`);

  if (!process.env.MONGODB_URI) {
    // Keep alive if run stand-alone or exit clean
    process.exit(0);
  } else {
    process.exit(0);
  }
}

seedData().catch(err => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
