import { NavLink, useLocation } from 'react-router-dom';
import { LogOut, Truck } from 'lucide-react';

const Sidebar = ({ navigation, onLogout }) => {
  const location = useLocation();
  return (
    <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <Truck className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">FleetTrack</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`
              }
            >
              {(() => {
                const Icon = item.icon;
                return (
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      location.pathname === item.href
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                );
              })()}
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          <button
            onClick={onLogout}
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
