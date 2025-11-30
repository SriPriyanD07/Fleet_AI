import { useState, Fragment, useRef, useEffect } from 'react';
import { Menu, Bell, X, Search, UserCircle, ChevronDown, Package, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { formatDistanceToNow } from 'date-fns';
// Animation removed for now

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header({ setSidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const { user } = useAuth();
  // Animation state
  const [mounted, setMounted] = useState(false);

  // Notification data (moved from Dashboard)
  const notifications = [
    {
      id: 1,
      type: 'delivery',
      title: 'Delivery completed',
      description: 'Order #ORD-2023-0456 has been delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      type: 'alert',
      title: 'Maintenance required',
      description: 'Vehicle #TRK-045 needs maintenance',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 3,
      type: 'status',
      title: 'Vehicle back online',
      description: 'Vehicle #TRK-012 is back online',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 4,
      type: 'vehicle',
      title: 'New vehicle added',
      description: 'New vehicle #TRK-078 added to fleet',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      icon: Truck,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];
  
  useEffect(() => {
    // Trigger animations after mount
    setMounted(true);
  }, []);

  // Handle click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex items-center">
            <button
              type="button"
              className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            
            <div 
              className={`relative mx-4 lg:w-96 transition-all duration-500 transform ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full py-2 pl-10 pr-3 text-sm border-0 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:bg-white focus:ring-offset-white sm:text-sm"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                className="relative p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
                <span className="sr-only">View notifications</span>
                <Bell className="w-6 h-6" aria-hidden="true" />
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => {
                      const NotificationIcon = notification.icon;
                      return (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className={`${notification.bgColor} p-2 rounded-full`}>
                              <NotificationIcon className={`w-4 h-4 ${notification.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div 
              className={`relative ml-4 transition-all duration-500 transform ${
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <HeadlessMenu as="div" className="relative">
              <div>
                <HeadlessMenu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center">
                    <div className="mr-2 text-right">
                      <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <UserCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <ChevronDown className="ml-1 w-4 h-4 text-gray-500" />
                  </div>
                </HeadlessMenu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <HeadlessMenu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <HeadlessMenu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.href}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700 no-underline hover:no-underline'
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                  ))}
                  <div className="border-t border-gray-100"></div>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <a
                        href="/logout"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle logout
                        }}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-red-600'
                        )}
                      >
                        Sign out
                      </a>
                    )}
                  </HeadlessMenu.Item>
                </HeadlessMenu.Items>
              </Transition>
              </HeadlessMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
