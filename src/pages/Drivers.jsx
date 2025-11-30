import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, Phone, MapPin, Calendar, AlertTriangle, CheckCircle, Clock, FileText, XCircle, Shield, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fleetDB } from '../services/database';
import SimpleDriverForm from '../components/forms/SimpleDriverForm';
import { ExportDriversButton } from '../components/common/ExportButton';

// Simple mock data - embedded directly to avoid import issues
const mockDrivers = [
  {
    id: 'DRV-1001',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@fleetdriver.com',
    phone: '+91 9876543210',
    licenseNumber: 'MH1234567890123',
    licenseExpiry: '2025-12-15',
    status: 'active',
    hireDate: '2022-03-15',
    address: '123, MG Road, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    assignedVehicle: 'VH-1001',
    emergencyContact: {
      name: 'Sunita Sharma',
      phone: '+91 9876543211',
      relationship: 'Spouse'
    }
  },
  {
    id: 'DRV-1002',
    name: 'Priya Patel',
    email: 'priya.patel@fleetdriver.com',
    phone: '+91 8765432109',
    licenseNumber: 'GJ9876543210987',
    licenseExpiry: '2024-08-20',
    status: 'active',
    hireDate: '2021-07-10',
    address: '456, Gandhi Nagar, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    assignedVehicle: 'VH-1002',
    emergencyContact: {
      name: 'Amit Patel',
      phone: '+91 8765432108',
      relationship: 'Parent'
    }
  },
  {
    id: 'DRV-1003',
    name: 'Amit Singh',
    email: 'amit.singh@fleetdriver.com',
    phone: '+91 7654321098',
    licenseNumber: 'DL5432109876543',
    licenseExpiry: '2024-11-30',
    status: 'on_leave',
    hireDate: '2020-01-20',
    address: '789, Nehru Place, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    assignedVehicle: null,
    emergencyContact: {
      name: 'Kavya Singh',
      phone: '+91 7654321097',
      relationship: 'Sibling'
    }
  },
  {
    id: 'DRV-1004',
    name: 'Sunita Kumar',
    email: 'sunita.kumar@fleetdriver.com',
    phone: '+91 6543210987',
    licenseNumber: 'KA2109876543210',
    licenseExpiry: '2023-12-01',
    status: 'active',
    hireDate: '2019-11-05',
    address: '321, Park Street, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    assignedVehicle: 'VH-1003',
    emergencyContact: {
      name: 'Vikram Kumar',
      phone: '+91 6543210986',
      relationship: 'Spouse'
    }
  },
  {
    id: 'DRV-1005',
    name: 'Vikram Gupta',
    email: 'vikram.gupta@fleetdriver.com',
    phone: '+91 5432109876',
    licenseNumber: 'UP0987654321098',
    licenseExpiry: '2025-06-15',
    status: 'active',
    hireDate: '2023-02-14',
    address: '654, Colony Road, Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    assignedVehicle: null,
    emergencyContact: {
      name: 'Meera Gupta',
      phone: '+91 5432109875',
      relationship: 'Parent'
    }
  }
];

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { bg: 'bg-green-100 text-green-800', text: 'Active', icon: CheckCircle },
    on_leave: { bg: 'bg-yellow-100 text-yellow-800', text: 'On Leave', icon: Clock },
    inactive: { bg: 'bg-red-100 text-red-800', text: 'Inactive', icon: XCircle }
  };
  
  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
};

const LicenseStatus = ({ licenseExpiry }) => {
  const expiryDate = new Date(licenseExpiry);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntilExpiry < 0;
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  
  if (isExpired) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        EXPIRED
      </span>
    );
  }
  
  if (isExpiringSoon) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        EXPIRING SOON
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
      <CheckCircle className="w-3 h-3 mr-1" />
      VALID
    </span>
  );
};

export function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDriverReport, setShowDriverReport] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = () => {
    const driverData = fleetDB.getDrivers();
    setDrivers(driverData);
  };

  const handleDriverAdded = (newDriver) => {
    loadDrivers(); // Refresh the list
    setShowAddForm(false);
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && driver.status === 'active') ||
                         (filterStatus === 'inactive' && driver.status === 'inactive') ||
                         (filterStatus === 'on_leave' && driver.status === 'on_leave');
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const assignedDrivers = drivers.filter(d => d.assignedVehicle).length;
  const expiredLicenses = drivers.filter(d => {
    const expiryDate = new Date(d.licenseExpiry);
    const today = new Date();
    return expiryDate < today;
  }).length;
  const expiringLicenses = drivers.filter(d => {
    const expiryDate = new Date(d.licenseExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  if (showAddForm) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <SimpleDriverForm 
          onSuccess={handleDriverAdded}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drivers ({drivers.length})</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your fleet drivers and their information
          </p>
        </div>
        <div className="flex space-x-3">
          <ExportDriversButton variant="outline" />
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Drivers</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalDrivers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Drivers</dt>
                  <dd className="text-lg font-medium text-gray-900">{activeDrivers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Vehicle Assigned</dt>
                  <dd className="text-lg font-medium text-gray-900">{assignedDrivers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className={`h-6 w-6 ${expiredLicenses > 0 ? 'text-red-400' : expiringLicenses > 0 ? 'text-yellow-400' : 'text-green-400'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">License Issues</dt>
                  <dd className="text-lg font-medium text-gray-900">{expiredLicenses + expiringLicenses}</dd>
                  {(expiredLicenses > 0 || expiringLicenses > 0) && (
                    <dd className="text-xs text-gray-500">
                      {expiredLicenses > 0 && `${expiredLicenses} expired`}
                      {expiredLicenses > 0 && expiringLicenses > 0 && ', '}
                      {expiringLicenses > 0 && `${expiringLicenses} expiring`}
                    </dd>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredDrivers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emergency Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/drivers/${driver.id}`} className="text-blue-600 hover:underline">
                              {driver.name}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">ID: {driver.id}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {driver.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {driver.phone}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {driver.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">{driver.licenseNumber}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}
                        </div>
                        <LicenseStatus licenseExpiry={driver.licenseExpiry} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={driver.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {driver.assignedVehicle || (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.emergencyContact.name}</div>
                      <div className="text-xs text-gray-500">{driver.emergencyContact.relationship}</div>
                      <div className="text-xs text-gray-400">{driver.emergencyContact.phone}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 p-3 mb-4 text-blue-500 bg-blue-100 rounded-full">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No drivers found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new driver.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriversPage;
