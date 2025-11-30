import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Package, 
  DollarSign,
  Edit,
  Trash2,
  Loader2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { mockAPI } from '@/services/mockApi';

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('details');

  // Fetch order details
  const { data: order, isLoading, isError, error } = useQuery(
    ['order', id],
    () => mockAPI.orders.getById(id).then(res => res.data),
    { enabled: !!id }
  );

  // Delete order mutation
  const deleteMutation = useMutation(
    () => mockAPI.orders.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        navigate('/orders');
      },
    }
  );

  // Update order status mutation
  const updateStatusMutation = useMutation(
    (status) => mockAPI.orders.updateStatus(id, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', id]);
        queryClient.invalidateQueries('orders');
      },
    }
  );

  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      updateStatusMutation.mutate(newStatus);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

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
        Error loading order: {error.message}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 text-yellow-600 bg-yellow-100 rounded-lg">
        Order not found
      </div>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusMap = {
      pending: { 
        bg: 'bg-yellow-100 text-yellow-800', 
        text: 'Pending', 
        icon: <Clock className="w-4 h-4 mr-1" /> 
      },
      in_progress: { 
        bg: 'bg-blue-100 text-blue-800', 
        text: 'In Progress', 
        icon: <Truck className="w-4 h-4 mr-1" /> 
      },
      completed: { 
        bg: 'bg-green-100 text-green-800', 
        text: 'Completed', 
        icon: <CheckCircle className="w-4 h-4 mr-1" /> 
      },
      cancelled: { 
        bg: 'bg-red-100 text-red-800', 
        text: 'Cancelled', 
        icon: <XCircle className="w-4 h-4 mr-1" /> 
      },
    };
    
    const statusInfo = statusMap[status] || { 
      bg: 'bg-gray-100 text-gray-800', 
      text: 'Unknown', 
      icon: <AlertCircle className="w-4 h-4 mr-1" /> 
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg}`}>
        {statusInfo.icon}
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
          to="/orders"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>

      <div className="flex flex-col justify-between mb-6 md:items-center md:flex-row">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <div className="ml-3">
              <StatusBadge status={order.status} />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Created on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex mt-4 space-x-3 md:mt-0">
          <Button
            variant="outline"
            as={Link}
            to={`/orders/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('in_progress')}
              disabled={updateStatusMutation.isLoading}
              className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              {updateStatusMutation.isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Truck className="w-4 h-4 mr-2" />
              )}
              Mark as In Progress
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
            className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
          >
            {deleteMutation.isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Order Details
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Order Summary */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Order Summary</h3>
              <dl className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="text-sm text-gray-900">#{order.id}</dd>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm">
                    <StatusBadge status={order.status} />
                  </dd>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{formatDate(order.updatedAt)}</dd>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="text-sm font-medium text-gray-900">${order.totalAmount?.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            {/* Customer Information */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                <Button variant="ghost" size="sm" as={Link} to={`/customers/${order.customer?.id || 'new'}`}>
                  View Profile
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-400" />
                  <div className="ml-3">
                    <a 
                      href={`mailto:${order.customer?.email}`} 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {order.customer?.email || 'N/A'}
                    </a>
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-400" />
                  <div className="ml-3">
                    <a 
                      href={`tel:${order.customer?.phone}`} 
                      className="text-sm text-gray-900 hover:text-blue-600"
                    >
                      {order.customer?.phone || 'N/A'}
                    </a>
                    <p className="text-sm text-gray-500">Phone</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="p-6 bg-white rounded-lg shadow md:col-span-2">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Delivery Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <MapPin className="flex-shrink-0 w-5 h-5 mr-2 text-gray-400" />
                    Pickup Location
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{order.pickupLocation?.name || 'N/A'}</p>
                    <p>{order.pickupLocation?.address || ''}</p>
                    <p>{order.pickupLocation?.city}, {order.pickupLocation?.state} {order.pickupLocation?.zipCode}</p>
                  </div>
                  {order.pickupInstructions && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500">Instructions:</p>
                      <p className="text-xs text-gray-600">{order.pickupInstructions}</p>
                    </div>
                  )}
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <MapPin className="flex-shrink-0 w-5 h-5 mr-2 text-gray-400" />
                    Delivery Location
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{order.deliveryLocation?.name || 'N/A'}</p>
                    <p>{order.deliveryLocation?.address || ''}</p>
                    <p>{order.deliveryLocation?.city}, {order.deliveryLocation?.state} {order.deliveryLocation?.zipCode}</p>
                  </div>
                  {order.deliveryInstructions && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500">Instructions:</p>
                      <p className="text-xs text-gray-600">{order.deliveryInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
                {order.vehicle?.id && (
                  <Button variant="ghost" size="sm" as={Link} to={`/vehicles/${order.vehicle.id}`}>
                    View Vehicle
                  </Button>
                )}
              </div>
              {order.vehicle ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.vehicle.make} {order.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500">{order.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.vehicle.licensePlate}
                    </p>
                    <p className="text-sm text-gray-500">License Plate</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.vehicle.vin}
                    </p>
                    <p className="text-sm text-gray-500">VIN</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No vehicle assigned</p>
              )}
            </div>

            {/* Order Items */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Order Items</h3>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={item.id ?? `${item.name ?? 'item'}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500">{item.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          ${item.price?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          ${(item.quantity * item.price)?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                        Subtotal
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        ${order.subtotal?.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                        Tax
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        ${order.tax?.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="px-6 py-3 text-sm font-medium text-right text-gray-500">
                        Shipping
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        ${order.shippingCost?.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="px-6 py-3 text-sm font-medium text-right text-gray-900 border-t border-gray-200">
                        Total
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900 border-t border-gray-200">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-6 text-lg font-medium text-gray-900">Order Timeline</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {order.timeline?.map((event, index) => (
                  <li key={event.id ?? `${event.timestamp ?? index}`}>
                    <div className="relative pb-8">
                      {index !== order.timeline.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            event.type === 'status_change' ? 'bg-blue-500' : 
                            event.type === 'note' ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}>
                            {event.type === 'status_change' ? (
                              <Truck className="w-4 h-4 text-white" />
                            ) : event.type === 'note' ? (
                              <span className="text-xs font-medium text-white">N</span>
                            ) : (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-800">
                              {event.description}
                            </p>
                            {event.note && (
                              <p className="mt-1 text-sm text-gray-500">{event.note}</p>
                            )}
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {formatDate(event.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-6 text-lg font-medium text-gray-900">Order Documents</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.documents?.length > 0 ? (
                    order.documents.map((doc, index) => (
                      <tr key={doc.id ?? `${doc.name ?? index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-400">
                              <span className="text-sm font-medium">.{doc.type}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {doc.documentType || 'Other'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(doc.uploadedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">View</a>
                          <a href="#" className="text-blue-600 hover:text-blue-900">Download</a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No documents found for this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
