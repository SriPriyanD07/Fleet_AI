import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Droplet, Wrench, Shield, Clock, AlertTriangle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { mockAPI } from '@/services/mockApi';
import Map from '@/components/Map';

export function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch vehicle details
  const { data: vehicle, isLoading, isError, error } = useQuery(
    ['vehicle', id],
    () => mockAPI.vehicles.getById(id).then(res => res.data),
    { enabled: !!id }
  );

  // Delete vehicle mutation
  const deleteMutation = useMutation(
    () => mockAPI.vehicles.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
        navigate('/vehicles');
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        Error loading vehicle: {error.message}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-4 text-yellow-600 bg-yellow-100 rounded-lg">
        Vehicle not found
      </div>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusMap = {
      active: { bg: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { bg: 'bg-gray-100 text-gray-800', text: 'Inactive' },
      maintenance: { bg: 'bg-yellow-100 text-yellow-800', text: 'In Maintenance' },
      out_of_service: { bg: 'bg-red-100 text-red-800', text: 'Out of Service' },
    };
    
    const statusInfo = statusMap[status] || { bg: 'bg-gray-100', text: 'Unknown' };
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.bg}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          as={Link}
          to="/vehicles"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vehicles
        </Button>
      </div>

      <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {vehicle.make} {vehicle.model} <span className="text-gray-500">({vehicle.licensePlate})</span>
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <StatusBadge status={vehicle.status} />
            <span className="text-sm text-gray-500">
              Last updated: {formatDate(vehicle.updatedAt)}
            </span>
          </div>
        </div>
        <div className="flex mt-4 space-x-2 md:mt-0">
          <Button
            variant="outline"
            as={Link}
            to={`/vehicles/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this vehicle?')) {
                deleteMutation.mutate();
              }
            }}
            className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
            disabled={deleteMutation.isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'location'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Location
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Vehicle Info Card */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
              <dl className="mt-4 space-y-3">
                <div className="flex items-start">
                  <dt className="w-1/3 text-sm font-medium text-gray-500">Make</dt>
                  <dd className="text-sm text-gray-900">{vehicle.make}</dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-1/3 text-sm font-medium text-gray-500">Model</dt>
                  <dd className="text-sm text-gray-900">{vehicle.model}</dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-1/3 text-sm font-medium text-gray-500">Year</dt>
                  <dd className="text-sm text-gray-900">{vehicle.year}</dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-1/3 text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900 capitalize">{vehicle.type}</dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-1/3 text-sm font-medium text-gray-500">VIN</dt>
                  <dd className="text-sm font-mono text-gray-900">{vehicle.vin || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            {/* Status Card */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Status</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-blue-600 bg-blue-100 rounded-full">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Current Status</p>
                    <p className="text-sm text-gray-500">
                      {vehicle.status === 'active' ? 'Vehicle is currently in service' : 
                       vehicle.status === 'maintenance' ? 'Vehicle is under maintenance' : 
                       vehicle.status === 'out_of_service' ? 'Vehicle is out of service' : 
                       'Vehicle status unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-green-600 bg-green-100 rounded-full">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Fuel Level</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          vehicle.fuelLevel < 20 ? 'bg-red-500' : 
                          vehicle.fuelLevel < 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{vehicle.fuelLevel}%</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-purple-600 bg-purple-100 rounded-full">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Current Location</p>
                    <p className="text-sm text-gray-500">
                      {vehicle.location || 'Unknown location'}
                    </p>
                  </div>
                </div>

                {vehicle.status === 'maintenance' && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 text-yellow-600 bg-yellow-100 rounded-full">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Maintenance Required</p>
                      <p className="text-sm text-gray-500">
                        {vehicle.notes || 'Maintenance in progress'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Card */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Maintenance</h3>
                <Button variant="ghost" size="sm" as={Link} to={`/vehicles/${id}/maintenance`}>
                  View All
                </Button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-orange-600 bg-orange-100 rounded-full">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Last Service</p>
                    <p className="text-sm text-gray-500">
                      {vehicle.lastServiceDate ? formatDate(vehicle.lastServiceDate) : 'No service history'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-red-600 bg-red-100 rounded-full">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Next Service Due</p>
                    <p className="text-sm text-gray-500">
                      {vehicle.nextServiceDue ? formatDate(vehicle.nextServiceDue) : 'Not scheduled'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-indigo-600 bg-indigo-100 rounded-full">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Insurance</p>
                    <p className="text-sm text-gray-500">
                      {vehicle.insuranceProvider ? (
                        <>
                          {vehicle.insuranceProvider}
                          <br />
                          <span className="text-xs">Expires: {formatDate(vehicle.insuranceExpiry)}</span>
                        </>
                      ) : 'No insurance information'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Detailed Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-500 uppercase">Specifications</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{vehicle.type}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
                    <dd className="text-sm text-gray-900">{vehicle.fuelType || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Mileage</dt>
                    <dd className="text-sm text-gray-900">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Odometer</dt>
                    <dd className="text-sm text-gray-900">{vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Color</dt>
                    <dd className="text-sm text-gray-900 capitalize">{vehicle.color || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-500 uppercase">Driver Information</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Driver</dt>
                    <dd className="text-sm text-gray-900">{vehicle.driverName || 'Unassigned'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Driver ID</dt>
                    <dd className="text-sm text-gray-900">{vehicle.driverId || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Assigned Since</dt>
                    <dd className="text-sm text-gray-900">
                      {vehicle.assignedDate ? formatDate(vehicle.assignedDate) : 'N/A'}
                    </dd>
                  </div>
                </dl>

                <h4 className="mt-6 mb-3 text-sm font-medium text-gray-500 uppercase">Registration</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                    <dd className="text-sm text-gray-900">{vehicle.licensePlate || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">VIN</dt>
                    <dd className="text-sm font-mono text-gray-900">{vehicle.vin || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Year</dt>
                    <dd className="text-sm text-gray-900">{vehicle.year || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Vehicle Location</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
              <div className="h-[500px] rounded-lg overflow-hidden">
                <Map 
                  center={vehicle.locationCoords || { lat: 40.7128, lng: -74.0060 }}
                  zoom={vehicle.locationCoords ? 15 : 12}
                  className="w-full h-full"
                />
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 text-blue-600 bg-blue-100 rounded-full">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Current Location</p>
                    <p className="text-sm text-gray-500">
                      {vehicle.location || 'Location not available'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Last updated: {vehicle.locationUpdatedAt ? formatDate(vehicle.locationUpdatedAt) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Vehicle History</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Odometer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicle.maintenanceRecords && vehicle.maintenanceRecords.length > 0 ? (
                    vehicle.maintenanceRecords.map((record, index) => (
                      <tr key={record.id ?? `${record.date ?? 'rec'}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {record.description}
                          {record.notes && (
                            <p className="mt-1 text-xs text-gray-400">{record.notes}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {record.mileage ? `${record.mileage.toLocaleString()} km` : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500">
                        No maintenance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleDetails;
