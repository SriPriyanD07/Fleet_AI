import React, { useState } from 'react';
import { VehiclesList } from '../components/vehicles/VehiclesList';
import { DriversList } from '../components/drivers/DriversList';

const FleetManagement = () => {
  const [activeTab, setActiveTab] = useState('vehicles');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Fleet Management</h1>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'vehicles' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'drivers' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Drivers
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === 'vehicles' ? <VehiclesList /> : <DriversList />}
      </div>
    </div>
  );
};

export default FleetManagement;
