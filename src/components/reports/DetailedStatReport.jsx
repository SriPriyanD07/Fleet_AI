import React from 'react';
import { X, Download, Truck, Package, CheckCircle, AlertTriangle, User, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export const DetailedStatReport = ({ stat, onClose }) => {
  const { name, data, dataType, value } = stat;

  const renderVehicleReport = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Active Vehicles Summary</h3>
        <p className="text-blue-700">Total Active Vehicles: {value}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((vehicle, index) => (
              <tr key={vehicle.id ?? vehicle.vehicleNumber ?? `vehicle-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{vehicle.driverName || vehicle.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{vehicle.vehicleNumber || vehicle.vehicle}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{vehicle.endLocation || vehicle.location || 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrderReport = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${
        name === 'Delayed Orders' ? 'bg-amber-50' : 'bg-green-50'
      }`}>
        <h3 className={`text-lg font-semibold mb-2 ${
          name === 'Delayed Orders' ? 'text-amber-900' : 'text-green-900'
        }`}>
          {name} Summary
        </h3>
        <p className={name === 'Delayed Orders' ? 'text-amber-700' : 'text-green-700'}>
          Total {name}: {value}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((order, index) => (
              <tr key={order.id ?? order['Product ID'] ?? `order-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{order['Product ID']}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{order['Customer Name']}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{order['Vehicle Number']}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    name === 'Delayed Orders' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{order.ETA || '—'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (dataType) {
      case 'vehicles':
        return renderVehicleReport();
      case 'orders':
        return renderOrderReport();
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">No detailed data available for this category.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{name} - Detailed Report</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {renderReport()}
        </div>
        
        <div className="flex justify-end items-center space-x-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
