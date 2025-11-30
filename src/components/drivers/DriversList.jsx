import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { fleetDB } from '../../services/database';
import SimpleDriverForm from '../forms/SimpleDriverForm';
import { ExportDriversButton } from '../common/ExportButton';

export const DriversList = () => {
  const [drivers, setDrivers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLicenseStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', color: 'bg-gray-100 text-gray-800' };
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry < 30) return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'valid', color: 'bg-green-100 text-green-800' };
  };

  if (showAddForm) {
    return (
      <SimpleDriverForm 
        onSuccess={handleDriverAdded}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Drivers ({drivers.length})</h2>
        <div className="flex space-x-3">
          <ExportDriversButton variant="outline" />
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Driver
          </button>
        </div>
      </div>
      
      {drivers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No drivers found</p>
          <p className="text-gray-400">Click "Add Driver" to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => {
                const licenseStatus = getLicenseStatus(driver.licenseExpiry);
                return (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {driver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{driver.licenseNumber}</span>
                        <span className={`px-2 py-1 mt-1 inline-flex text-xs leading-4 font-semibold rounded-full ${licenseStatus.color}`}>
                          {licenseStatus.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.assignedVehicle || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.city || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriversList;
