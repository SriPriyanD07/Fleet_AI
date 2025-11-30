import React, { useState } from 'react';
import { Search, MapPin, Clock, Truck, User, Package, Calendar, Filter, Plus, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Sample data for available drivers
const availableDrivers = [
  { id: 1, name: 'Rajesh Yadav', status: 'available', location: 'Mumbai Central', vehicle: 'MH-01-AB-1234', vehicleType: 'Delivery Van', rating: 4.8 },
  { id: 2, name: 'Sunil Shinde', status: 'available', location: 'Andheri East', vehicle: 'MH-02-CD-5678', vehicleType: 'Mini Truck', rating: 4.7 },
  { id: 3, name: 'Ajay Kumar', status: 'available', location: 'Dadar', vehicle: 'MH-03-EF-9012', vehicleType: 'Delivery Van', rating: 4.9 },
  { id: 4, name: 'Ramesh Kumar', status: 'busy', location: 'Bandra', vehicle: 'MH-04-GH-3456', vehicleType: 'Refrigerated Truck', rating: 4.5 },
  { id: 5, name: 'Pratik Sarkar', status: 'available', location: 'Kurla', vehicle: 'MH-05-IJ-7890', vehicleType: 'Mini Truck', rating: 4.6 },
];

// Sample data for pending deliveries
const pendingDeliveries = [
  { 
    id: 'DEL-001', 
    customer: 'Reliance Industries', 
    pickupLocation: 'Santacruz Warehouse', 
    deliveryLocation: 'Reliance Corporate Park, Navi Mumbai', 
    items: '5 Pallets of Electronics', 
    priority: 'high', 
    requestedTime: '2023-07-10 10:00 AM',
    estimatedDistance: '28 km',
    estimatedDuration: '45 min'
  },
  { 
    id: 'DEL-002', 
    customer: 'Tata Consultancy Services', 
    pickupLocation: 'Andheri Warehouse', 
    deliveryLocation: 'TCS Banyan Park, Andheri East', 
    items: '2 Server Racks', 
    priority: 'high', 
    requestedTime: '2023-07-10 11:30 AM',
    estimatedDistance: '5 km',
    estimatedDuration: '15 min'
  },
  { 
    id: 'DEL-003', 
    customer: 'Infosys', 
    pickupLocation: 'Goregaon Warehouse', 
    deliveryLocation: 'Infosys Office, Powai', 
    items: '10 Boxes of Office Supplies', 
    priority: 'medium', 
    requestedTime: '2023-07-10 02:00 PM',
    estimatedDistance: '12 km',
    estimatedDuration: '25 min'
  },
  { 
    id: 'DEL-004', 
    customer: 'Mahindra & Mahindra', 
    pickupLocation: 'Thane Warehouse', 
    deliveryLocation: 'Mahindra Towers, Worli', 
    items: '3 Pallets of Automotive Parts', 
    priority: 'medium', 
    requestedTime: '2023-07-10 03:30 PM',
    estimatedDistance: '32 km',
    estimatedDuration: '55 min'
  },
  { 
    id: 'DEL-005', 
    customer: 'Wipro Limited', 
    pickupLocation: 'Borivali Warehouse', 
    deliveryLocation: 'Wipro Campus, Navi Mumbai', 
    items: '8 Boxes of IT Equipment', 
    priority: 'low', 
    requestedTime: '2023-07-11 09:00 AM',
    estimatedDistance: '35 km',
    estimatedDuration: '60 min'
  },
];

// Sample data for recent dispatches
const recentDispatches = [
  { 
    id: 'DIS-001', 
    delivery: 'DEL-098', 
    driver: 'Vikram Singh', 
    vehicle: 'MH-06-KL-1234', 
    dispatchTime: '2023-07-09 09:15 AM', 
    status: 'in_transit',
    eta: '10:30 AM'
  },
  { 
    id: 'DIS-002', 
    delivery: 'DEL-097', 
    driver: 'Manoj Tiwari', 
    vehicle: 'MH-07-MN-5678', 
    dispatchTime: '2023-07-09 08:45 AM', 
    status: 'delivered',
    eta: 'Delivered at 09:50 AM'
  },
  { 
    id: 'DIS-003', 
    delivery: 'DEL-096', 
    driver: 'Sanjay Patil', 
    vehicle: 'MH-08-OP-9012', 
    dispatchTime: '2023-07-09 10:00 AM', 
    status: 'in_transit',
    eta: '11:15 AM'
  },
];

// Vehicle types for filtering
const vehicleTypes = [
  'All Types',
  'Delivery Van',
  'Mini Truck',
  'Refrigerated Truck',
  'Heavy Duty Truck'
];

const QuickDispatch = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All Types');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter drivers based on vehicle type and search term
  const filteredDrivers = availableDrivers.filter(driver => {
    const matchesVehicleType = vehicleTypeFilter === 'All Types' || driver.vehicleType === vehicleTypeFilter;
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVehicleType && matchesSearch;
  });

  // Handle dispatch confirmation
  const handleDispatchConfirm = () => {
    // In a real app, this would send the dispatch to the backend
    setShowConfirmation(true);
    // Reset selections after a short delay
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedDelivery(null);
      setSelectedDriver(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quick Dispatch</h1>
        <p className="text-gray-600 mt-1">Quickly assign deliveries to available drivers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Deliveries Column */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-500" />
              Pending Deliveries
            </h2>
          </div>
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search deliveries..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
              {pendingDeliveries.map((delivery) => (
                <div 
                  key={delivery.id}
                  onClick={() => setSelectedDelivery(delivery)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedDelivery?.id === delivery.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{delivery.customer}</h3>
                      <p className="text-sm text-gray-500">{delivery.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${delivery.priority === 'high' ? 'bg-red-100 text-red-800' : delivery.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {delivery.priority.charAt(0).toUpperCase() + delivery.priority.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                      <div>
                        <p className="text-gray-600">From: {delivery.pickupLocation}</p>
                        <p className="text-gray-600">To: {delivery.deliveryLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-gray-600">{delivery.requestedTime}</p>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-gray-600">{delivery.items}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Drivers Column */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Available Drivers
            </h2>
          </div>
          <div className="p-4">
            <div className="flex space-x-2 mb-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search drivers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={vehicleTypeFilter}
                  onChange={(e) => setVehicleTypeFilter(e.target.value)}
                >
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
              {filteredDrivers.map((driver) => (
                <div 
                  key={driver.id}
                  onClick={() => driver.status === 'available' ? setSelectedDriver(driver) : null}
                  className={`p-3 border rounded-lg transition-colors ${driver.status !== 'available' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${selectedDriver?.id === driver.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{driver.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${driver.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <p className="text-sm text-gray-500 capitalize">{driver.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{driver.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-gray-600">{driver.location}</p>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-gray-600">{driver.vehicle} ({driver.vehicleType})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dispatch Details Column */}
        <div>
          {/* Dispatch Form */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-800 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-500" />
                Dispatch Details
              </h2>
            </div>
            <div className="p-4">
              {selectedDelivery && selectedDriver ? (
                <div>
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">ID:</span> {selectedDelivery.id}</p>
                      <p><span className="text-gray-500">Customer:</span> {selectedDelivery.customer}</p>
                      <p><span className="text-gray-500">Pickup:</span> {selectedDelivery.pickupLocation}</p>
                      <p><span className="text-gray-500">Delivery:</span> {selectedDelivery.deliveryLocation}</p>
                      <p><span className="text-gray-500">Items:</span> {selectedDelivery.items}</p>
                      <p><span className="text-gray-500">Requested Time:</span> {selectedDelivery.requestedTime}</p>
                      <div className="flex justify-between">
                        <p><span className="text-gray-500">Distance:</span> {selectedDelivery.estimatedDistance}</p>
                        <p><span className="text-gray-500">Duration:</span> {selectedDelivery.estimatedDuration}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Driver Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {selectedDriver.name}</p>
                      <p><span className="text-gray-500">Vehicle:</span> {selectedDriver.vehicle}</p>
                      <p><span className="text-gray-500">Vehicle Type:</span> {selectedDriver.vehicleType}</p>
                      <p><span className="text-gray-500">Current Location:</span> {selectedDriver.location}</p>
                      <p><span className="text-gray-500">Rating:</span> {selectedDriver.rating}/5.0</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full py-3 text-base"
                    onClick={handleDispatchConfirm}
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    Confirm Dispatch
                  </Button>
                  
                  {showConfirmation && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-green-700">Dispatch confirmed! Driver has been notified.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a delivery and a driver to create a dispatch</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Dispatches */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-800 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Recent Dispatches
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {recentDispatches.map((dispatch) => (
                  <div key={dispatch.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{dispatch.delivery}</h3>
                        <p className="text-sm text-gray-500">{dispatch.id}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${dispatch.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {dispatch.status === 'delivered' ? 'Delivered' : 'In Transit'}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-gray-600">{dispatch.driver}</p>
                      </div>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-gray-600">{dispatch.vehicle}</p>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-gray-600">{dispatch.dispatchTime}</p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <p className={`${dispatch.status === 'delivered' ? 'text-green-600' : 'text-blue-600'}`}>{dispatch.eta}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Dispatches
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickDispatch;