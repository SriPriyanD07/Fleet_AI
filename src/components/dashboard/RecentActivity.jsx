import { Clock, CheckCircle, AlertTriangle, Truck, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const activityTypes = {
  delivery: {
    icon: Package,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  status: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  vehicle: {
    icon: Truck,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
};

// Mock data - in a real app, this would come from an API
const mockActivities = [
  {
    id: 1,
    type: 'delivery',
    title: 'Delivery completed',
    description: 'Order #ORD-2023-0456 has been delivered',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: 2,
    type: 'alert',
    title: 'Maintenance required',
    description: 'Vehicle #TRK-045 needs maintenance',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: 3,
    type: 'status',
    title: 'Vehicle back online',
    description: 'Vehicle #TRK-012 is back online',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    id: 4,
    type: 'vehicle',
    title: 'New vehicle added',
    description: 'New vehicle #TRK-078 added to fleet',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

export default function RecentActivity() {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {mockActivities.map((activity, activityIdx) => {
          const ActivityIcon = activityTypes[activity.type]?.icon || Clock;
          const iconColor = activityTypes[activity.type]?.color || 'text-gray-400';
          const iconBgColor = activityTypes[activity.type]?.bgColor || 'bg-gray-50';
          
          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== mockActivities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`${iconBgColor} h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                    >
                      <ActivityIcon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-800">
                        {activity.description}
                        <span className="font-medium text-gray-900"> {activity.title}</span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={activity.timestamp.toISOString()}>
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <a
          href="#"
          className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
        >
          View all activity
        </a>
      </div>
    </div>
  );
}
