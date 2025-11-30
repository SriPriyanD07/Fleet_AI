import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { Spinner } from '@/components/ui/Spinner';
import { mockAPI } from '@/services/mockApi';

// Generate mock data directly if needed
const generateMockVehicles = () => {
  const types = ['Truck', 'Van', 'Car', 'Bike'];
  const statuses = ['active', 'inactive', 'maintenance'];
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `VH-${1000 + i}`,
      licensePlate: `${['MH', 'DL', 'KA'][Math.floor(Math.random() * 3)]}${Math.floor(Math.random() * 90 + 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}`,
      make: ['Tata', 'Ashok Leyland', 'Mahindra'][Math.floor(Math.random() * 3)],
      model: ['Prima', 'Signa', 'Ultra'][Math.floor(Math.random() * 3)],
      type: types[Math.floor(Math.random() * types.length)],
      status: status,
      location: city.name,
      lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    };
  });
};

const columns = [
  {
    accessor: 'id',
    header: 'ID',
    sortable: true,
    cell: ({ row }) => (
      <div className="flex items-center group">
        <Link 
          to={`/vehicles/${row.original.id}`} 
          className="inline-flex items-center font-medium text-blue-600 hover:underline"
        >
          {row.original.id}
          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    ),
  },
  {
    accessor: 'licensePlate',
    header: 'License Plate',
    sortable: true,
  },
  {
    accessor: 'make',
    header: 'Make & Model',
    sortable: true,
    cell: ({ row }) => (
      <span>{row.original.make} {row.original.model}</span>
    ),
  },
  {
    accessor: 'type',
    header: 'Type',
    sortable: true,
  },
  {
    accessor: 'status',
    header: 'Status',
    sortable: true,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusMap = {
        active: { bg: 'bg-green-100 text-green-800', text: 'Active' },
        inactive: { bg: 'bg-gray-100 text-gray-800', text: 'Inactive' },
        maintenance: { bg: 'bg-yellow-100 text-yellow-800', text: 'Maintenance' },
        out_of_service: { bg: 'bg-red-100 text-red-800', text: 'Out of Service' },
      };
      const statusInfo = statusMap[status] || { bg: 'bg-gray-100 text-gray-800', text: 'Unknown' };
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
          <span className={`w-2 h-2 mr-1.5 rounded-full ${status === 'active' ? 'bg-green-500' : status === 'maintenance' ? 'bg-yellow-500' : status === 'out_of_service' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
          {statusInfo.text}
        </span>
      );
    },
  },
  {
    accessor: 'location',
    header: 'Location',
    sortable: true,
  },
  {
    accessor: 'lastUpdate',
    header: 'Last Update',
    sortable: true,
    cell: ({ value }) => new Date(value).toLocaleString(),
  },
];

export function Vehicles() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });

  // Use mock data directly
  const mockData = useMemo(() => generateMockVehicles(), []);
  
  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let result = [...mockData];
    
    // Apply search
    if (search) {
      const term = search.toLowerCase().trim();
      result = result.filter(vehicle => {
        const searchableFields = [
          vehicle.licensePlate?.toLowerCase(),
          vehicle.make?.toLowerCase(),
          vehicle.model?.toLowerCase(),
          vehicle.vin?.toLowerCase(),
          vehicle.type?.toLowerCase(),
          vehicle.location?.toLowerCase(),
        ];
        return searchableFields.some(field => field?.includes(term));
      });
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(vehicle => vehicle.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(vehicle => vehicle.type === filters.type);
    }
    
    return result;
  }, [mockData, search, filters.status, filters.type]);
  
  const totalVehicles = filteredData.length;
  const activeVehicles = filteredData.filter(v => v.status === 'active').length;

  const handleSearch = (e) => {
    e.preventDefault();
    // No need to refetch since we're using useMemo
  };

  const handleRefresh = () => {
    // Force re-render by updating state
    setFilters({...filters});
  };

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Fleet</h1>
          <p className="mt-1 text-sm text-gray-600">
            {filteredData.length} vehicles found • {filteredData.filter(v => v.status === 'active').length} active
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => navigate('/vehicles/new')}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10"
                placeholder="Search by license plate, make, model, or VIN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
              <select
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch('');
                  setFilters({ status: '', type: '' });
                }}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={filteredData}
          pageSize={10}
          showPagination
          showPageSizeOptions
          showSearch
          onRowClick={(row) => navigate(`/vehicles/${row.original.id}`)}
          className="bg-white rounded-lg border border-gray-200"
          headerClassName="bg-gray-50"
          rowClassName="hover:bg-gray-50 cursor-pointer"
          emptyState={
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || filters.status || filters.type 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No vehicles have been added yet.'}
              </p>
              {(search || filters.status || filters.type) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setFilters({ status: '', type: '' });
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Vehicles;
