import { subDays, format, addDays, formatDistanceToNow } from 'date-fns';

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators
const generateVehicles = (count = 20) => {
  const types = ['Truck', 'Van', 'Car', 'Bike'];
  const statuses = ['active', 'inactive', 'maintenance'];
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 }
  ];

  return Array.from({ length: count }, (_, i) => {
    const city = randomElement(cities);
    return {
      id: `VH-${1000 + i}`,
      licensePlate: `${randomElement(['MH', 'DL', 'KA'])}${randomInt(10, 99)}${String.fromCharCode(65 + randomInt(0, 25))}${randomInt(1000, 9999)}`,
      make: randomElement(['Tata', 'Ashok Leyland', 'Mahindra']),
      model: randomElement(['Prima', 'Signa', 'Ultra']),
      type: randomElement(types),
      year: randomInt(2018, 2023),
      status: randomElement(statuses),
      fuelType: randomElement(['Diesel', 'Petrol', 'CNG']),
      mileage: randomInt(5000, 150000),
      location: city.name,
      // Spread vehicles more evenly around the city center
      lat: city.lat + (Math.random() * 0.5 - 0.25),
      lng: city.lng + (Math.random() * 0.5 - 0.25),
      lastUpdate: subDays(new Date(), randomInt(0, 30)).toISOString(),
      speed: randomInt(0, 100),
      fuelLevel: randomInt(10, 100),
    };
  });
};

const generateOrders = (count = 200) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${20230000 + i}`,
    status: randomElement(['pending', 'in_transit', 'delivered']),
    origin: randomElement(['Mumbai', 'Delhi', 'Bangalore']),
    destination: randomElement(['Chennai', 'Hyderabad', 'Pune']),
    vehicleId: `VH-${1000 + randomInt(0, 19)}`,
    driver: `Driver ${randomInt(1, 10)}`,
    startTime: subDays(new Date(), randomInt(0, 30)).toISOString(),
    distance: randomInt(50, 1500),
    weight: randomInt(100, 10000),
  }));
};

// Generate mock drivers
const generateDrivers = (count = 25) => {
  const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Kavya', 'Arjun', 'Meera', 'Rohit', 'Anjali', 'Suresh', 'Pooja', 'Kiran', 'Deepa', 'Manoj', 'Ritu', 'Sanjay', 'Nisha', 'Arun', 'Seema'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Jain', 'Agarwal', 'Verma', 'Yadav', 'Mishra', 'Tiwari', 'Chauhan', 'Joshi', 'Pandey', 'Srivastava', 'Malhotra', 'Kapoor', 'Chopra', 'Bansal', 'Aggarwal'];
  const statuses = ['active', 'on_leave', 'inactive'];
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
    { name: 'Surat', lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
    { name: 'Indore', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
    { name: 'Thane', lat: 19.2183, lng: 72.9781, state: 'Maharashtra' }
  ];

  const relationships = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend'];
  const streetNames = ['MG Road', 'Park Street', 'Gandhi Nagar', 'Nehru Place', 'Sector', 'Colony', 'Nagar', 'Vihar', 'Enclave', 'Extension'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const city = cities[i % cities.length];
    
    // Create more realistic status distribution (80% active, 15% on_leave, 5% inactive)
    let status;
    const rand = Math.random();
    if (rand < 0.8) status = 'active';
    else if (rand < 0.95) status = 'on_leave';
    else status = 'inactive';
    
    // Generate realistic license expiry dates (some expired, some expiring soon, most valid)
    let licenseExpiry;
    const expiryRand = Math.random();
    if (expiryRand < 0.1) {
      // 10% expired licenses (past dates)
      licenseExpiry = format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd');
    } else if (expiryRand < 0.2) {
      // 10% expiring soon (within 30 days)
      licenseExpiry = format(addDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd');
    } else {
      // 80% valid licenses (future dates)
      licenseExpiry = format(addDays(new Date(), Math.floor(Math.random() * 1000) + 30), 'yyyy-MM-dd');
    }
    
    const hireDate = subDays(new Date(), Math.floor(Math.random() * 2000) + 30);
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const houseNumber = Math.floor(Math.random() * 999) + 1;
    
    return {
      id: `DRV-${1000 + i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@fleetdriver.com`,
      phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      licenseNumber: `${city.state.substring(0, 2).toUpperCase()}${String(Math.floor(10000000000000 + Math.random() * 89999999999999)).substring(0, 13)}`,
      licenseExpiry: licenseExpiry,
      status: status,
      hireDate: format(hireDate, 'yyyy-MM-dd'),
      address: `${houseNumber}, ${streetName}, ${city.name}`,
      city: city.name,
      state: city.state,
      postalCode: Math.floor(100000 + Math.random() * 899999).toString(),
      country: 'India',
      emergencyContact: {
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`,
        phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
        relationship: relationships[Math.floor(Math.random() * relationships.length)]
      },
      currentLocation: {
        lat: city.lat + (Math.random() * 0.2 - 0.1),
        lng: city.lng + (Math.random() * 0.2 - 0.1),
        lastUpdated: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString(),
        speed: Math.floor(Math.random() * 80),
        heading: Math.floor(Math.random() * 360)
      },
      assignedVehicle: i % 3 === 0 ? `VH-${1000 + Math.floor(i / 3)}` : null,
      // Additional driver details
      experience: Math.floor((new Date() - hireDate) / (1000 * 60 * 60 * 24 * 365)) + Math.floor(Math.random() * 3),
      rating: (4 + Math.random()).toFixed(1),
      totalDeliveries: Math.floor(Math.random() * 500) + 50,
      onTimeDeliveries: Math.floor(Math.random() * 95) + 85,
      fuelEfficiencyRating: ['Excellent', 'Good', 'Average'][Math.floor(Math.random() * 3)],
      lastMedicalCheckup: format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
      trainingCertifications: [
        'Defensive Driving',
        'Hazardous Materials',
        'First Aid',
        'Vehicle Maintenance'
      ].slice(0, Math.floor(Math.random() * 4) + 1)
    };
  });
};

// Initialize mock data with localStorage persistence
const STORAGE_KEYS = {
  VEHICLES: 'fleet_vehicles',
  ORDERS: 'fleet_orders',
  DRIVERS: 'fleet_drivers'
};

// Load data from localStorage or generate new data
const loadOrGenerateData = (key, generator) => {
  console.log(`Loading data for key: ${key}`);
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      console.log(`Loaded ${key} from localStorage:`, parsed.length, 'items');
      return parsed;
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
    }
  }
  console.log(`Generating new data for key: ${key}`);
  const data = generator();
  console.log(`Generated ${key} data:`, data.length, 'items');
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

// Force regenerate drivers data (remove this after first load)
if (localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
  console.log('Clearing existing driver data to regenerate with new format...');
  localStorage.removeItem(STORAGE_KEYS.DRIVERS);
}

// Initialize data
console.log('Initializing mock data...');
let mockVehicles = loadOrGenerateData(STORAGE_KEYS.VEHICLES, generateVehicles);
import { ordersData } from './ordersData';
let mockOrders = ordersData;
let mockDrivers = loadOrGenerateData(STORAGE_KEYS.DRIVERS, generateDrivers);
console.log('Mock data initialized. Drivers count:', mockDrivers.length);

// Mock API implementation
export const mockAPI = {
  // Auth
  auth: {
    login: async (credentials) => {
      await delay(800);
      if (credentials.email === 'admin@fleet.com' && credentials.password === 'password') {
        return {
          data: {
            token: 'mock-jwt-token',
            user: { id: 'user-1', name: 'Admin', email: 'admin@fleet.com', role: 'admin' }
          }
        };
      }
      throw { response: { status: 401, data: { message: 'Invalid credentials' } } };
    },
    getProfile: async () => ({
      data: { id: 'user-1', name: 'Admin', email: 'admin@fleet.com', role: 'admin' }
    }),
  },

  // Vehicles
  vehicles: {
    getAll: async (params = {}) => {
      await delay(500);
      const { page = 1, limit = 10, status } = params;
      let filtered = [...mockVehicles];
      
      if (status) {
        filtered = filtered.filter(v => v.status === status);
      }
      
      const start = (page - 1) * limit;
      return {
        data: filtered.slice(start, start + limit),
        pagination: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        }
      };
    },
    
    getById: async (id) => {
      await delay(300);
      const vehicle = mockVehicles.find(v => v.id === id);
      if (!vehicle) throw { response: { status: 404 } };
      return { data: vehicle };
    },
    
    create: async (data) => {
      await delay(700);
      const vehicle = { 
        ...data, 
        id: `VH-${1000 + mockVehicles.length}`,
        lastUpdate: new Date().toISOString()
      };
      mockVehicles.unshift(vehicle);
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(mockVehicles));
      return { data: vehicle };
    },
    
    update: async (id, data) => {
      await delay(700);
      const index = mockVehicles.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      mockVehicles[index] = { 
        ...mockVehicles[index], 
        ...data, 
        lastUpdate: new Date().toISOString() 
      };
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(mockVehicles));
      return { data: mockVehicles[index] };
    },
    
    getLocations: async () => ({
      data: mockVehicles.map(v => ({
        id: v.id,
        lat: v.lat,
        lng: v.lng,
        status: v.status,
        lastUpdate: v.lastUpdate,
      }))
    }),
  },
  
  // Orders
  orders: {
    getAll: async (params = {}) => {
      await delay(500);
      const { page = 1, limit = 10, status, search = '' } = params;
      let filtered = [...mockOrders];

      // Apply text search across common order fields from ordersData
      if (search) {
        const query = String(search).toLowerCase();
        filtered = filtered.filter(o =>
          String(o['Product ID'] || '').toLowerCase().includes(query) ||
          String(o['Customer Name'] || '').toLowerCase().includes(query) ||
          String(o['Vehicle Number'] || '').toLowerCase().includes(query)
        );
      }

      // Map UI status to dataset status (ordersData uses capitalized labels like "Delivered")
      if (status) {
        const statusMap = {
          pending: 'Pending',
          in_progress: 'In Progress',
          completed: 'Delivered',
          cancelled: 'Cancelled',
        };
        const target = (statusMap[status] || status).toLowerCase();
        filtered = filtered.filter(o => String(o.Status || o.status || '').toLowerCase() === target);
      }

      // If limit is very high (like 200), return all data without pagination
      if (limit >= filtered.length) {
        return {
          data: filtered,
          pagination: {
            total: filtered.length,
            page: 1,
            limit: filtered.length,
            totalPages: 1,
          }
        };
      }

      // Otherwise, apply normal pagination
      const start = (page - 1) * limit;
      return {
        data: filtered.slice(start, start + limit),
        pagination: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        }
      };
    },
  },
  
  // Drivers
  drivers: {
    getAll: async (params = {}) => {
      await delay(500);
      const { page = 1, limit = 10, status, search = '' } = params;
      
      console.log('mockDrivers array:', mockDrivers);
      console.log('mockDrivers length:', mockDrivers.length);
      let filtered = [...mockDrivers];
      
      // Apply status filter
      if (status && status !== 'all') {
        filtered = filtered.filter(driver => driver.status === status);
      }
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(driver => 
          driver.name.toLowerCase().includes(searchLower) ||
          (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchLower)) ||
          driver.phone.includes(search) ||
          driver.email.toLowerCase().includes(searchLower)
        );
      }
      
      const start = (page - 1) * limit;
      return {
        data: filtered.slice(start, start + limit),
        pagination: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit)
        }
      };
    },
    
    getById: async (id) => {
      await delay(300);
      console.log('Looking for driver with ID:', id);
      console.log('Available driver IDs:', mockDrivers.map(d => d.id));
      const driver = mockDrivers.find(d => d.id === id);
      if (!driver) {
        console.log('Driver not found with ID:', id);
        throw { response: { status: 404, data: { message: 'Driver not found' } } };
      }
      console.log('Found driver:', driver);
      
      // Get assigned vehicle details if any
      let assignedVehicle = null;
      if (driver.assignedVehicle) {
        assignedVehicle = mockVehicles.find(v => v.id === driver.assignedVehicle);
      }
      
      // Get recent trips/orders for this driver
      const recentTrips = mockOrders
        .filter(order => order.driverId === id)
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, 5);
      
      return {
        data: {
          ...driver,
          assignedVehicle,
          recentTrips,
          stats: {
            totalTrips: mockOrders.filter(o => o.driverId === id).length,
            completedTrips: mockOrders.filter(o => o.driverId === id && o.status === 'delivered').length,
            totalDistance: Math.floor(Math.random() * 10000) + 1000,
            onTimeRate: Math.floor(Math.random() * 30) + 70 // 70-100%
          }
        }
      };
    }
  },
  
  // Analytics
  analytics: {
    getFleetMetrics: async () => ({
      data: {
        totalVehicles: mockVehicles.length,
        activeVehicles: mockVehicles.filter(v => v.status === 'active').length,
        inMaintenance: mockVehicles.filter(v => v.status === 'maintenance').length,
        totalDrivers: mockDrivers.length,
        activeDrivers: mockDrivers.filter(d => d.status === 'active').length,
        onTimeDelivery: 92.5,
        avgFuelEfficiency: 8.2,
        totalDistance: 125000,
        totalOrders: mockOrders.length,
        completedOrders: mockOrders.filter(o => o.status === 'delivered').length,
      }
    }),
  },
};

export default mockAPI;
