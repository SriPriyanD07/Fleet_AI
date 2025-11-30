import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings, Truck, Package, Users, Home, MapPin, ListChecks, Calendar, Activity, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileSidebar from './MobileSidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Fleet Management', href: '/fleet', icon: ListChecks },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Drivers', href: '/drivers', icon: Users },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Maintenance', href: '/maintenance', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: Activity },
  { name: 'Quick Dispatch', href: '/dispatch', icon: Zap },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Mobile sidebar */}
      <MobileSidebar 
        navigation={navigation} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onLogout={handleLogout}
      />

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar navigation={navigation} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
