import { useState, useEffect } from 'react';
import { 
  Truck, Package, MapPin, Clock, AlertTriangle, 
  CheckCircle, ArrowUp, ArrowDown, RefreshCw, AlertCircle, 
  Calendar, Clock as ClockIcon, Map as MapIcon, Activity, Zap
} from 'lucide-react';
import Map from '../components/Map';
import StatCard from '../components/dashboard/StatCard';
import VehicleStatusChart from '../components/dashboard/VehicleStatusChart';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { fetchVehicles, fetchOrders } from '../services/api';
import { getAllDrivers } from '../services/excelDataService';
import mockAPI from '../services/mockApi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [activeVehicles, setActiveVehicles] = useState(0);
  const [delayedOrders, setDelayedOrders] = useState(0);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();


  // City coordinates for mapping drivers to locations
  const cityCoordinates = {
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Bengaluru': { lat: 12.9716, lng: 77.5946 },
    'Mysuru': { lat: 12.2958, lng: 76.6394 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 },
    'Lucknow': { lat: 26.8467, lng: 80.9462 },
    'Bhopal': { lat: 23.2599, lng: 77.4126 },
    'Kochi': { lat: 9.9312, lng: 76.2673 },
    'Patna': { lat: 25.5941, lng: 85.1376 },
    'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
    'Chandigarh': { lat: 30.7333, lng: 76.7794 },
    'Gurgaon': { lat: 28.4595, lng: 77.0266 },
    'Dehradun': { lat: 30.3165, lng: 78.0322 },
    'Aurangabad': { lat: 19.8762, lng: 75.3433 },
    'Vadodara': { lat: 22.3072, lng: 73.1812 },
    'Vijayawada': { lat: 16.5062, lng: 80.6480 },
    'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
    'Amritsar': { lat: 31.6340, lng: 74.8723 },
    'Faridabad': { lat: 28.4089, lng: 77.3178 },
    'Haridwar': { lat: 29.9457, lng: 78.1642 },
    'New Jalpaiguri': { lat: 26.6996, lng: 88.3191 },
    'Kanpur': { lat: 26.4499, lng: 80.3319 },
    'Ajmer': { lat: 26.4499, lng: 74.6399 },
    'Indore': { lat: 22.7196, lng: 75.8577 },
    'Gaya': { lat: 24.7955, lng: 85.0000 },
    'Puri': { lat: 19.8134, lng: 85.8315 }
  };

  // Fetch drivers data
  const { data: drivers = [] } = useQuery('drivers', async () => {
    // Direct mapping of your 20 vehicles - fast and reliable
    const vehicleData = [
      { id: 1, driverName: 'Rajesh Yadav', vehicleNumber: 'MH12AB1234', endLocation: 'Lonavala' },
      { id: 2, driverName: 'Sunil Shinde', vehicleNumber: 'MH12AB2234', endLocation: 'Pune' },
      { id: 3, driverName: 'Ajay Kumar', vehicleNumber: 'KA01CD1234', endLocation: 'Mandya' },
      { id: 4, driverName: 'Ramesh Kumar', vehicleNumber: 'TN09EF1234', endLocation: 'Vellore' },
      { id: 5, driverName: 'Pratik Sarkar', vehicleNumber: 'WB12GH3234', endLocation: 'Serampore' },
      { id: 6, driverName: 'Vikram Singh', vehicleNumber: 'DL03IJ5678', endLocation: 'Delhi' },
      { id: 7, driverName: 'Rajiv Mehta', vehicleNumber: 'GJ05KL9012', endLocation: 'Ahmedabad' },
      { id: 8, driverName: 'Sanjay Patel', vehicleNumber: 'MH14MN3456', endLocation: 'Mumbai' },
      { id: 9, driverName: 'Amit Sharma', vehicleNumber: 'KA02OP7890', endLocation: 'Mysuru' },
      { id: 10, driverName: 'Rahul Desai', vehicleNumber: 'TN10QR1234', endLocation: 'Coimbatore' },
      { id: 11, driverName: 'Deepak Verma', vehicleNumber: 'UP16ST5678', endLocation: 'Lucknow' },
      { id: 12, driverName: 'Anil Kapoor', vehicleNumber: 'RJ14UV9012', endLocation: 'Jaipur' },
      { id: 13, driverName: 'Vijay Malhotra', vehicleNumber: 'MP09WX3456', endLocation: 'Bhopal' },
      { id: 14, driverName: 'Suresh Reddy', vehicleNumber: 'AP07YZ7890', endLocation: 'Visakhapatnam' },
      { id: 15, driverName: 'Kumar Swamy', vehicleNumber: 'KA03AB5678', endLocation: 'Bengaluru' },
      { id: 16, driverName: 'Prakash Singh', vehicleNumber: 'MP10CD9012', endLocation: 'Indore' },
      { id: 17, driverName: 'Rajesh Patel', vehicleNumber: 'GJ06EF3456', endLocation: 'Surat' },
      { id: 18, driverName: 'Mohan Kumar', vehicleNumber: 'TN11GH7890', endLocation: 'Chennai' },
      { id: 19, driverName: 'Suresh Kumar', vehicleNumber: 'UP17IJ1234', endLocation: 'Kanpur' },
      { id: 20, driverName: 'Amit Patel', vehicleNumber: 'MH15KL5678', endLocation: 'Thane' }
    ];
    
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log(`Loaded ${vehicleData.length} vehicles directly`);
    
    return vehicleData.map(driver => ({
      ...driver,
      type: 'driver',
      lat: cityCoordinates[driver.endLocation]?.lat || cityCoordinates['Mumbai']?.lat,
      lng: cityCoordinates[driver.endLocation]?.lng || cityCoordinates['Mumbai']?.lng,
      status: 'active',
      name: driver.driverName,
      vehicle: driver.vehicleNumber
    }));
  }, {
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch vehicles data
  const { data: vehicles = [] } = useQuery('vehicles', async () => {
    // First try the API, fallback to mock data if it fails
    try {
      const response = await fetchVehicles();
      return response.data || [];
    } catch (error) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.warn('Using mock vehicle data due to API error:', error);
      // Request all vehicles by setting a high limit
      const mockResponse = await mockAPI.vehicles.getAll({ limit: 50 });
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log(`Fetched ${mockResponse.data?.length || 0} vehicles from mock API`);
      return mockResponse.data || [];
    }
  }, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch orders data
  const { data: orders = [] } = useQuery('orders', async () => {
    // First try the API, fallback to mock data if it fails
    try {
      const response = await fetchOrders();
      return response.data || [];
    } catch (error) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.warn('Using mock order data due to API error:', error);
      // Request all orders by setting a high limit
      const mockResponse = await mockAPI.orders.getAll({ limit: 200 });
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.log(`Fetched ${mockResponse.data?.length || 0} orders from mock API`);
      return mockResponse.data || [];
    }
  }, {
    refetchInterval: 60000, // Refetch every minute
  });

  // Calculate stats when data changes
  useEffect(() => {
    // Combine vehicles and drivers for stats
    const allVehicles = [...vehicles];
    const allDrivers = [...drivers];
    
    if (allVehicles.length > 0) {
      const activeCount = allVehicles.filter(v => v.status === 'active').length;
      setActiveVehicles(activeCount);
      
      // Calculate center point of all vehicles and drivers for the map
      const validVehicles = allVehicles.filter(v => v.lat != null && v.lng != null);
      const validDrivers = allDrivers.filter(d => d.lat != null && d.lng != null);
      const allLocations = [...validVehicles, ...validDrivers];
      
      if (allLocations.length > 0) {
        const avgLat = allLocations.reduce((sum, v) => {
          const lat = parseFloat(v.lat);
          return isNaN(lat) ? sum : sum + lat;
        }, 0) / allLocations.length;
        
        const avgLng = allLocations.reduce((sum, v) => {
          const lng = parseFloat(v.lng);
          return isNaN(lng) ? sum : sum + lng;
        }, 0) / allLocations.length;
        
        setMapCenter({ lat: avgLat, lng: avgLng });
      }
    }
    
    if (orders) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.log('Orders data loaded:', orders.length, 'orders');
        console.log('Sample order:', orders[0]);
        console.log('Statuses found:', [...new Set(orders.map(o => o.Status))]);
      }

      const delayedCount = orders.filter(o => o.Status === 'Delayed').length;
      const deliveredCount = orders.filter(o => o.Status === 'Delivered').length;

      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.log('Delayed orders count:', delayedCount);
        console.log('Delivered orders count:', deliveredCount);
      }
      
      setDelayedOrders(delayedCount);
      setTotalDeliveries(deliveredCount);
    }
    
    setLastUpdated(new Date());
  }, [vehicles, orders, drivers]);

  const stats = [
    { 
      id: 'active-vehicles',
      name: 'Active Vehicles', 
      value: activeVehicles, 
      icon: Truck,
      change: '+2.5%',
      changeType: 'increase',
      bgColor: 'from-blue-500 to-blue-600',
      description: 'Currently on the road',
      trend: 'up',
      data: drivers.filter(d => d.status === 'active'),
      dataType: 'vehicles'
    },
    { 
      id: 'delayed-orders',
      name: 'Delayed Orders', 
      value: delayedOrders, 
      icon: AlertTriangle,
      change: delayedOrders > 0 ? '+3.2%' : '0%',
      changeType: delayedOrders > 0 ? 'increase' : 'neutral',
      bgColor: delayedOrders > 0 ? 'from-amber-500 to-amber-600' : 'from-green-500 to-green-600',
      description: delayedOrders > 0 ? 'Requires attention' : 'All on time',
      trend: delayedOrders > 0 ? 'up' : 'down',
      data: orders.filter(o => o.Status === 'Delayed'),
      dataType: 'orders'
    },
    { 
      id: 'total-deliveries',
      name: 'Total Deliveries', 
      value: totalDeliveries, 
      icon: CheckCircle,
      change: '+12%',
      changeType: 'increase',
      bgColor: 'from-green-500 to-green-600',
      description: 'This month',
      trend: 'up',
      data: orders.filter(o => o.Status === 'Delivered'),
      dataType: 'orders'
    },
  ];
  
  const quickActions = [
    { 
      name: 'Add New Vehicle', 
      icon: Truck, 
      action: () => navigate('/vehicles/new'),
      description: 'Register a new vehicle to your fleet'
    },
    { 
      name: 'Schedule Maintenance', 
      icon: Calendar, 
      action: () => navigate('/maintenance'),
      description: 'Schedule vehicle maintenance or service'
    },
    { 
      name: 'View Reports', 
      icon: Activity, 
      action: () => navigate('/reports'),
      description: 'View fleet performance and analytics'
    },
    { 
      name: 'Quick Dispatch', 
      icon: Zap, 
      action: () => navigate('/dispatch'),
      description: 'Quickly assign a new delivery'
    },
  ];
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg rounded-xl p-6 text-white"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="mt-1 text-blue-100">
              Welcome back! Here's what's happening with your fleet today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-blue-100 text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>Last updated: {formatTime(lastUpdated)}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={`stat-${stat.name}-${index}`} variants={fadeIn}>
            <StatCard stat={stat} />
          </motion.div>
        ))}
        
        {/* Quick Actions Card */}
        <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={`action-${action.name}-${index}`}
                onClick={(e) => {
                  e.preventDefault();
                  action.action();
                }}
                className="w-full flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left group"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">{action.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white shadow-xl rounded-xl overflow-hidden"
        >
          <div className="p-6 pb-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Locations</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapIcon className="w-4 h-4" />
                <span>{vehicles?.length || 0} vehicles shown</span>
              </div>
            </div>
          </div>
          <div className="h-[700px] w-full">
            <div className="h-full w-full rounded-lg border border-gray-200 overflow-hidden">
              <Map 
                center={mapCenter}
                zoom={5}
                className="h-full w-full"
                vehicles={[...vehicles, ...drivers]}
                key={`map-${vehicles?.length || 0}`}
                showControls={false}
              />
            </div>
          </div>
        </motion.div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Vehicle Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white shadow-xl rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Status</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>
            <VehicleStatusChart vehicles={vehicles || []} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
