const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let vehicles = [
  { 
    id: 1, 
    name: 'Truck 1', 
    lat: 13.0827, 
    lng: 80.2707, 
    status: 'available',
    speed: 0,
    battery: 85,
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 2, 
    name: 'Van 1', 
    lat: 13.0622, 
    lng: 80.2537, 
    status: 'in_transit',
    speed: 45,
    battery: 92,
    lastUpdated: new Date().toISOString()
  }
];

// Helper function to generate random number in range
const randomInRange = (min, max) => Math.random() * (max - min) + min;

// Update vehicle positions every 30 seconds
setInterval(() => {
  vehicles.forEach(vehicle => {
    if (vehicle.status === 'in_transit') {
      // Small random movement
      vehicle.lat += randomInRange(-0.001, 0.001);
      vehicle.lng += randomInRange(-0.001, 0.001);
      vehicle.speed = Math.round(randomInRange(30, 70));
      vehicle.battery = Math.max(10, vehicle.battery - 0.1);
      vehicle.lastUpdated = new Date().toISOString();
      
      // Randomly change status
      if (Math.random() > 0.95) {
        vehicle.status = 'maintenance';
      }
    } else if (vehicle.status === 'maintenance' && Math.random() > 0.9) {
      vehicle.status = 'available';
      vehicle.battery = 100;
    }
  });
}, 5000);

// Routes
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(vehicle);
});

app.put('/api/vehicles/:id/location', (req, res) => {
  const { lat, lng } = req.body;
  const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
  
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  
  if (lat !== undefined) vehicle.lat = parseFloat(lat);
  if (lng !== undefined) vehicle.lng = parseFloat(lng);
  
  vehicle.lastUpdated = new Date().toISOString();
  res.json(vehicle);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚚 Fleet Management System`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log(`📋 GET  http://localhost:${PORT}/api/vehicles`);
  console.log(`🔍 GET  http://localhost:${PORT}/api/vehicles/1`);
  console.log(`📍 PUT  http://localhost:${PORT}/api/vehicles/1/location`);
  console.log('\nTry these in your browser or Postman!');
});
