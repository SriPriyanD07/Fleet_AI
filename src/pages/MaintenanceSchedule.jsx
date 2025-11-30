import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Truck, Wrench, Filter, Plus, Search } from 'lucide-react';
import { fleetDB } from '../services/database';
import SimpleMaintenanceForm from '../components/forms/SimpleMaintenanceForm';
import { ExportMaintenanceButton } from '../components/common/ExportButton';

// Sample data for maintenance schedules
const maintenanceData = [
  {
    id: 1,
    vehicleId: 'MH12AB1234',
    vehicleName: 'Tata 407 Truck',
    maintenanceType: 'Regular Service',
    scheduledDate: '2023-07-15',
    scheduledTime: '10:00 AM',
    status: 'scheduled',
    priority: 'medium',
    assignedTo: 'Rajesh Mechanic',
    estimatedDuration: '2 hours',
    notes: 'Regular oil change and brake inspection'
  },
  {
    id: 2,
    vehicleId: 'KA01CD1234',
    vehicleName: 'Force Traveller',
    maintenanceType: 'Tire Replacement',
    scheduledDate: '2023-07-16',
    scheduledTime: '11:30 AM',
    status: 'scheduled',
    priority: 'high',
    assignedTo: 'Sunil Mechanic',
    estimatedDuration: '1.5 hours',
    notes: 'Replace front tires with new ones'
  },
  {
    id: 3,
    vehicleId: 'TN09EF1234',
    vehicleName: 'Tata Ace',
    maintenanceType: 'Engine Repair',
    scheduledDate: '2023-07-14',
    scheduledTime: '09:00 AM',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Mohan Mechanic',
    estimatedDuration: '4 hours',
    notes: 'Engine overheating issue needs to be fixed'
  },
  {
    id: 4,
    vehicleId: 'WB12GH1234',
    vehicleName: 'Tata Sumo',
    maintenanceType: 'Brake Service',
    scheduledDate: '2023-07-18',
    scheduledTime: '02:00 PM',
    status: 'scheduled',
    priority: 'medium',
    assignedTo: 'Ajay Mechanic',
    estimatedDuration: '2 hours',
    notes: 'Replace brake pads and check brake fluid'
  },
  {
    id: 5,
    vehicleId: 'MH12AB2234',
    vehicleName: 'Ashok Leyland',
    maintenanceType: 'Electrical System Check',
    scheduledDate: '2023-07-13',
    scheduledTime: '10:30 AM',
    status: 'completed',
    priority: 'low',
    assignedTo: 'Prakash Mechanic',
    estimatedDuration: '1 hour',
    notes: 'Check and fix headlights and wiring issues'
  },
  {
    id: 6,
    vehicleId: 'MH12AB3234',
    vehicleName: 'Mahindra Bolero',
    maintenanceType: 'Suspension Check',
    scheduledDate: '2023-07-17',
    scheduledTime: '11:00 AM',
    status: 'scheduled',
    priority: 'medium',
    assignedTo: 'Ganesh Mechanic',
    estimatedDuration: '2.5 hours',
    notes: 'Inspect and repair suspension system'
  },
  {
    id: 7,
    vehicleId: 'KA01CD2234',
    vehicleName: 'Tata Sumo',
    maintenanceType: 'Air Conditioning Repair',
    scheduledDate: '2023-07-19',
    scheduledTime: '03:00 PM',
    status: 'scheduled',
    priority: 'low',
    assignedTo: 'Ramesh Mechanic',
    estimatedDuration: '2 hours',
    notes: 'Fix AC cooling issue'
  },
  {
    id: 8,
    vehicleId: 'TN09EF2234',
    vehicleName: 'Mahindra Bolero',
    maintenanceType: 'Transmission Service',
    scheduledDate: '2023-07-14',
    scheduledTime: '01:00 PM',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Suresh Mechanic',
    estimatedDuration: '3 hours',
    notes: 'Transmission fluid change and inspection'
  }
];

// Sample data for available vehicles
const availableVehicles = [
  { id: 1, vehicleNumber: 'MH12AB1234', model: 'Tata 407', type: 'Truck', lastService: '2023-05-15' },
  { id: 2, vehicleNumber: 'MH12AB2234', model: 'Ashok Leyland', type: 'Truck', lastService: '2023-04-20' },
  { id: 3, vehicleNumber: 'KA01CD1234', model: 'Force Traveller', type: 'Van', lastService: '2023-06-01' },
  { id: 4, vehicleNumber: 'TN09EF1234', model: 'Tata Ace', type: 'Mini Truck', lastService: '2023-05-10' },
  { id: 5, vehicleNumber: 'WB12GH1234', model: 'Tata Sumo', type: 'SUV', lastService: '2023-06-05' },
  { id: 6, vehicleNumber: 'MH12AB3234', model: 'Mahindra Bolero', type: 'Pickup', lastService: '2023-05-25' },
  { id: 7, vehicleNumber: 'KA01CD2234', model: 'Tata Sumo', type: 'SUV', lastService: '2023-04-15' },
  { id: 8, vehicleNumber: 'TN09EF2234', model: 'Mahindra Bolero', type: 'Pickup', lastService: '2023-06-10' }
];

// Sample data for maintenance types
const maintenanceTypes = [
  { id: 1, name: 'Regular Service', duration: '2 hours', description: 'Standard maintenance service including oil change, filter replacement, and general inspection' },
  { id: 2, name: 'Tire Replacement', duration: '1.5 hours', description: 'Replacement of worn out tires with new ones' },
  { id: 3, name: 'Engine Repair', duration: '4 hours', description: 'Diagnosis and repair of engine-related issues' },
  { id: 4, name: 'Brake Service', duration: '2 hours', description: 'Inspection and replacement of brake components' },
  { id: 5, name: 'Electrical System Check', duration: '1 hour', description: 'Diagnosis and repair of electrical system issues' },
  { id: 6, name: 'Suspension Check', duration: '2.5 hours', description: 'Inspection and repair of suspension system' },
  { id: 7, name: 'Air Conditioning Repair', duration: '2 hours', description: 'Diagnosis and repair of AC system issues' },
  { id: 8, name: 'Transmission Service', duration: '3 hours', description: 'Transmission fluid change and inspection' }
];

// Sample data for mechanics/technicians
const mechanics = [
  { id: 1, name: 'Rajesh Mechanic', specialization: 'General Maintenance', availability: 'Available' },
  { id: 2, name: 'Sunil Mechanic', specialization: 'Tire Specialist', availability: 'Available' },
  { id: 3, name: 'Mohan Mechanic', specialization: 'Engine Specialist', availability: 'Busy' },
  { id: 4, name: 'Ajay Mechanic', specialization: 'Brake Specialist', availability: 'Available' },
  { id: 5, name: 'Prakash Mechanic', specialization: 'Electrical Specialist', availability: 'Available' },
  { id: 6, name: 'Ganesh Mechanic', specialization: 'Suspension Specialist', availability: 'Busy' },
  { id: 7, name: 'Ramesh Mechanic', specialization: 'AC Specialist', availability: 'Available' },
  { id: 8, name: 'Suresh Mechanic', specialization: 'Transmission Specialist', availability: 'Busy' }
];

const MaintenanceSchedule = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMaintenanceForm, setShowNewMaintenanceForm] = useState(false);

  useEffect(() => {
    loadMaintenance();
  }, []);

  const loadMaintenance = () => {
    const maintenanceData = fleetDB.getMaintenance();
    setMaintenance(maintenanceData);
  };

  const handleMaintenanceAdded = (newMaintenance) => {
    loadMaintenance(); // Refresh the list
    setShowNewMaintenanceForm(false);
  };

  // Filter maintenance data based on status and search term
  const filteredMaintenanceData = maintenance.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge color
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maintenance Schedule ({maintenance.length})</h1>
          <p className="text-gray-600 mt-1">Schedule and track vehicle maintenance</p>
        </div>
        <div className="flex space-x-3">
          <ExportMaintenanceButton variant="outline" />
          <button 
            onClick={() => setShowNewMaintenanceForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400" />
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setFilter('scheduled')}
              >
                Scheduled
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setFilter('in_progress')}
              >
                In Progress
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by vehicle or maintenance type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Maintenance Schedule Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaintenanceData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">No maintenance scheduled</p>
                      <p className="text-sm">Click "Schedule Maintenance" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMaintenanceData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.vehicleId}</div>
                          <div className="text-sm text-gray-500">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 mr-2">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">{item.type}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : '—'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cost: ₹{item.estimatedCost || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadge(item.priority)}`}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.serviceProvider || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-2 text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Maintenance Form */}
      {showNewMaintenanceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <SimpleMaintenanceForm 
              onSuccess={handleMaintenanceAdded}
              onCancel={() => setShowNewMaintenanceForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceSchedule;