import React, { useState, useEffect } from 'react';
import { Truck, Clock, MapPin, User, Package } from 'lucide-react';
import { fleetDB } from '../../services/database';
import { ExportDispatchesButton } from '../common/ExportButton';

const DispatchViewer = () => {
  const [dispatches, setDispatches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDispatches(fleetDB.getDispatches());
    setVehicles(fleetDB.getVehicles());
    setDrivers(fleetDB.getDrivers());
    setOrders(fleetDB.getOrders());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Unknown Vehicle';
  };

  const getDriverInfo = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.name} (${driver.phone})` : 'Unknown Driver';
  };

  const getOrderInfo = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    return order ? order.customerName : 'Unknown Customer';
  };

  const filteredDispatches = dispatches.filter(dispatch => {
    if (filter === 'all') return true;
    return dispatch.status === filter;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Dispatches</h2>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ExportDispatchesButton />
        </div>
      </div>

      {filteredDispatches.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No dispatches found</p>
          <p className="text-gray-400">Dispatches will appear here when orders are assigned to vehicles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDispatches.map((dispatch) => (
            <div key={dispatch.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-800">
                  {dispatch.id}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispatch.status)}`}>
                  {dispatch.status.charAt(0).toUpperCase() + dispatch.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span>Customer: {getOrderInfo(dispatch.orderId)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{dispatch.route}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>{getVehicleInfo(dispatch.vehicleId)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{getDriverInfo(dispatch.driverId)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    Dispatch: {new Date(dispatch.dispatchTime).toLocaleDateString()}
                  </span>
                </div>

                {dispatch.estimatedArrival && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      ETA: {new Date(dispatch.estimatedArrival).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button className="w-full px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Dispatch Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total: </span>
            <span className="font-medium">{dispatches.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Active: </span>
            <span className="font-medium text-green-600">
              {dispatches.filter(d => d.status === 'active').length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Scheduled: </span>
            <span className="font-medium text-blue-600">
              {dispatches.filter(d => d.status === 'scheduled').length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Completed: </span>
            <span className="font-medium text-gray-600">
              {dispatches.filter(d => d.status === 'completed').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchViewer;
