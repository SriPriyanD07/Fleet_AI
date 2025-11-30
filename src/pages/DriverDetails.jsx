import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, MapPin, Car,
  CheckCircle, Edit, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { mockAPI } from '../services/mockApi';

export function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDriver = async () => {
      try {
        console.log('Loading driver with ID:', id);
        const response = await mockAPI.drivers.getById(id);
        console.log('Driver API response:', response);
        setDriver(response.data);
      } catch (err) {
        console.error('Error loading driver:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadDriver();
    }
  }, [id]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusMap = {
      active: { bg: 'bg-green-100 text-green-800', text: 'Active' },
      on_leave: { bg: 'bg-yellow-100 text-yellow-800', text: 'On Leave' },
      inactive: { bg: 'bg-red-100 text-red-800', text: 'Inactive' },
    };
    const statusInfo = statusMap[status] || { bg: 'bg-gray-100 text-gray-800', text: 'Active' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      // In a real app, you would call an API to delete the driver
      console.log('Deleting driver:', id);
      // For now, just navigate back to the drivers list
      navigate('/fleet-management/drivers');
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  if (error) return <div className="p-4 text-red-600 bg-red-100 rounded-lg">Error: {error}</div>;
  if (!driver) return <div className="p-4 text-yellow-600 bg-yellow-100 rounded-lg">Driver not found</div>;

  return (
    <div className="p-6">
      <Button variant="ghost" as={Link} to="/fleet-management/drivers" className="mb-6 flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Drivers
      </Button>

      {/* Header */}
      <div className="flex flex-col justify-between pb-6 mb-6 border-b border-gray-200 md:items-center md:flex-row">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
              <div className="ml-3"><StatusBadge status={driver.status} /></div>
            </div>
            <p className="text-gray-600">License: {driver.licenseNumber}</p>
          </div>
        </div>
        
        <div className="flex mt-4 space-x-3 md:mt-0">
          <Button variant="outline" as={Link} to={`/fleet-management/drivers/${id}/edit`} className="flex items-center">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDelete} 
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Personal Information</h3>
              <dl className="space-y-4">
                <div className="pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Driver Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.name}</dd>
                </div>
                <div className="pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">License Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.licenseNumber}</dd>
                </div>
                <div className="pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.email}</dd>
                </div>
                <div className="pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.phone}</dd>
                </div>
                <div className="pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Assigned Vehicle</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.assignedVehicle || 'Not assigned'}</dd>
                </div>
              </dl>
            </Card>

            {/* Driver Information */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Driver Information</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">
                      {Math.floor(Math.random() * 50) + 10} Deliveries Completed
                    </h4>
                    <div className="mt-1 text-sm text-gray-500">
                      Total deliveries to date
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Current City: {driver.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-2 text-green-500" />
                    <span>Address: {driver.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                    <span>Hire Date: {new Date(driver.hireDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card className="p-6">
            <p className="text-gray-500">No documents found.</p>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card className="p-6">
            <p className="text-gray-500">No recent activity.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DriverDetails;
