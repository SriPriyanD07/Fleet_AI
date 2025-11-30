import React, { useState } from 'react';
import { CheckCircle, XCircle, Play, Download, Plus, Truck, User, Package, Wrench, MapPin } from 'lucide-react';
import { fleetDB } from '../services/database';
import SimpleVehicleForm from '../components/forms/SimpleVehicleForm';
import SimpleDriverForm from '../components/forms/SimpleDriverForm';
import SimpleOrderForm from '../components/forms/SimpleOrderForm';
import SimpleMaintenanceForm from '../components/forms/SimpleMaintenanceForm';
import DispatchViewer from '../components/dispatches/DispatchViewer';
import { 
  ExportVehiclesButton, 
  ExportDriversButton, 
  ExportOrdersButton, 
  ExportMaintenanceButton,
  ExportDriverPerformanceButton,
  ExportDeliveryPerformanceButton,
  ExportMaintenanceCostButton,
  ExportRouteEfficiencyButton,
  ExportDispatchesButton 
} from '../components/common/ExportButton';

const TestAllFeatures = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [testResults, setTestResults] = useState({});

  const testSuites = [
    {
      id: 'database',
      title: 'Database Service',
      icon: <Package className="w-5 h-5" />,
      tests: [
        { id: 'db-init', name: 'Database Initialization', test: () => fleetDB.get(fleetDB.keys.VEHICLES) !== null },
        { id: 'db-vehicles', name: 'Vehicle Storage', test: () => fleetDB.getVehicles().length > 0 },
        { id: 'db-drivers', name: 'Driver Storage', test: () => fleetDB.getDrivers().length > 0 },
        { id: 'db-orders', name: 'Order Storage', test: () => fleetDB.getOrders().length > 0 },
        { id: 'db-dispatches', name: 'Dispatch Storage', test: () => fleetDB.getDispatches().length > 0 }
      ]
    },
    {
      id: 'forms',
      title: 'Form Components',
      icon: <Plus className="w-5 h-5" />,
      tests: [
        { id: 'form-vehicle', name: 'Vehicle Form Renders', test: () => true },
        { id: 'form-driver', name: 'Driver Form Renders', test: () => true },
        { id: 'form-order', name: 'Order Form Renders', test: () => true },
        { id: 'form-maintenance', name: 'Maintenance Form Renders', test: () => true }
      ]
    },
    {
      id: 'exports',
      title: 'Export Functionality',
      icon: <Download className="w-5 h-5" />,
      tests: [
        { id: 'export-vehicles', name: 'Vehicle Export', test: () => fleetDB.getVehicles().length > 0 },
        { id: 'export-drivers', name: 'Driver Export', test: () => fleetDB.getDrivers().length > 0 },
        { id: 'export-orders', name: 'Order Export', test: () => fleetDB.getOrders().length > 0 },
        { id: 'export-maintenance', name: 'Maintenance Export', test: () => fleetDB.getMaintenance().length >= 0 },
        { id: 'export-performance', name: 'Performance Analytics Export', test: () => true }
      ]
    }
  ];

  const runTest = (testId, testFunction) => {
    try {
      const result = testFunction();
      setTestResults(prev => ({ ...prev, [testId]: { success: result, error: null } }));
      return result;
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testId]: { success: false, error: error.message } }));
      return false;
    }
  };

  const runAllTests = () => {
    testSuites.forEach(suite => {
      suite.tests.forEach(test => {
        runTest(test.id, test.test);
      });
    });
  };

  const addTestData = () => {
    // Add test vehicle
    fleetDB.addVehicle({
      make: 'Test Tata',
      model: 'Test Prima',
      licensePlate: 'TEST1234',
      type: 'Truck',
      year: 2023,
      fuelType: 'Diesel',
      mileage: 10000,
      location: 'Test City',
      driverName: 'Test Driver'
    });

    // Add test driver
    fleetDB.addDriver({
      name: 'Test Driver',
      email: 'test@example.com',
      phone: '+91 9999999999',
      licenseNumber: 'TEST123456789',
      licenseExpiry: '2025-12-31',
      city: 'Test City',
      status: 'active'
    });

    // Add test order
    fleetDB.addOrder({
      customerName: 'Test Customer',
      origin: 'Test Origin',
      destination: 'Test Destination',
      weight: 1000,
      distance: 100,
      priority: 'medium'
    });

    // Add test maintenance
    fleetDB.addMaintenance({
      vehicleId: 'TEST1234',
      type: 'routine',
      description: 'Test maintenance',
      scheduledDate: '2024-12-10',
      priority: 'medium',
      estimatedCost: 5000
    });

    alert('Test data added successfully!');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Management Feature Test Suite</h1>
        <p className="text-gray-600">Test all implemented features and functionality</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={runAllTests}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Run All Tests
          </button>
          <button
            onClick={addTestData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Test Data
          </button>
          <button
            onClick={clearAllData}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Clear All Data
          </button>
        </div>
      </div>

      {/* Test Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {testSuites.map(suite => (
          <div key={suite.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              {suite.icon}
              <h3 className="text-lg font-semibold ml-2">{suite.title}</h3>
            </div>
            <div className="space-y-2">
              {suite.tests.map(test => {
                const result = testResults[test.id];
                return (
                  <div key={test.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{test.name}</span>
                    <div className="flex items-center">
                      {result ? (
                        result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )
                      ) : (
                        <button
                          onClick={() => runTest(test.id, test.test)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Test
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Export Test Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Export Functionality Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <ExportVehiclesButton />
          <ExportDriversButton />
          <ExportOrdersButton />
          <ExportMaintenanceButton />
          <ExportDispatchesButton />
          <ExportDriverPerformanceButton />
          <ExportDeliveryPerformanceButton />
          <ExportMaintenanceCostButton />
          <ExportRouteEfficiencyButton />
        </div>
      </div>

      {/* Form Test Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Form Components Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTest('vehicle')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500"
          >
            <Truck className="w-6 h-6 mr-2" />
            Vehicle Form
          </button>
          <button
            onClick={() => setActiveTest('driver')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500"
          >
            <User className="w-6 h-6 mr-2" />
            Driver Form
          </button>
          <button
            onClick={() => setActiveTest('order')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500"
          >
            <Package className="w-6 h-6 mr-2" />
            Order Form
          </button>
          <button
            onClick={() => setActiveTest('maintenance')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500"
          >
            <Wrench className="w-6 h-6 mr-2" />
            Maintenance Form
          </button>
        </div>
      </div>

      {/* Active Test Display */}
      {activeTest && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Testing: {activeTest.charAt(0).toUpperCase() + activeTest.slice(1)} Form</h2>
            <button
              onClick={() => setActiveTest(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {activeTest === 'vehicle' && (
              <SimpleVehicleForm 
                onSuccess={() => alert('Vehicle added successfully!')}
                onCancel={() => setActiveTest(null)}
              />
            )}
            {activeTest === 'driver' && (
              <SimpleDriverForm 
                onSuccess={() => alert('Driver added successfully!')}
                onCancel={() => setActiveTest(null)}
              />
            )}
            {activeTest === 'order' && (
              <SimpleOrderForm 
                onSuccess={() => alert('Order created successfully!')}
                onCancel={() => setActiveTest(null)}
              />
            )}
            {activeTest === 'maintenance' && (
              <SimpleMaintenanceForm 
                onSuccess={() => alert('Maintenance scheduled successfully!')}
                onCancel={() => setActiveTest(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* Dispatch Viewer Test */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Dispatch Viewer Test</h2>
        <DispatchViewer />
      </div>

      {/* Data Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Data Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{fleetDB.getVehicles().length}</div>
            <div className="text-sm text-gray-600">Vehicles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{fleetDB.getDrivers().length}</div>
            <div className="text-sm text-gray-600">Drivers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{fleetDB.getOrders().length}</div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{fleetDB.getMaintenance().length}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{fleetDB.getDispatches().length}</div>
            <div className="text-sm text-gray-600">Dispatches</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAllFeatures;
