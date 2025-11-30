import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Truck } from 'lucide-react';
import { fleetDB } from '../services/database';
import SimpleOrderForm from '../components/forms/SimpleOrderForm';
import { ExportOrdersButton } from '../components/common/ExportButton';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const orderData = fleetDB.getOrders();
    setOrders(orderData);
  };

  const handleOrderAdded = (newOrder) => {
    loadOrders(); // Refresh the list
    setShowAddForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !search || 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.origin.toLowerCase().includes(search.toLowerCase()) ||
      order.destination.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = !filters.status || order.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  if (showAddForm) {
    return (
      <div className="p-6">
        <SimpleOrderForm 
          onSuccess={handleOrderAdded}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders ({orders.length})</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all delivery orders
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button 
            onClick={loadOrders}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <ExportOrdersButton variant="outline" />
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </button>
        </div>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10"
                placeholder="Search by order ID, customer, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <select
                className="block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {(filters.status || search) && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-600">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </span>
              <button
                type="button"
                onClick={() => {
                  setFilters({ status: '' });
                  setSearch('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.origin} → {order.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.weight ? `${order.weight} kg` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.eta ? new Date(order.eta).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <div className="mx-auto w-16 h-16 p-3 mb-4 text-blue-500 bg-blue-100 rounded-full">
            <Truck className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {search || filters.status 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new order.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2 -ml-1" />
              Create New Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
