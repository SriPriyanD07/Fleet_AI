import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
const MapDemo = lazy(() => import('./pages/MapDemo'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Drivers = lazy(() => import('./pages/Drivers'));
const DriverDetails = lazy(() => import('./pages/DriverDetails'));
const DriverReportPage = lazy(() => import('./pages/DriverReportPage'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const FleetManagement = lazy(() => import('./pages/FleetManagement'));
const VehicleForm = lazy(() => import('./pages/VehicleForm'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MaintenanceSchedule = lazy(() => import('./pages/MaintenanceSchedule'));
const Reports = lazy(() => import('./pages/Reports'));
const Locations = lazy(() => import('./pages/Locations'));
const QuickDispatch = lazy(() => import('./pages/QuickDispatch'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Driver Dashboard - No Layout wrapper for full-screen experience */}
            <Route path="/driver-dashboard" element={
              <ProtectedRoute>
                <DriverDashboard />
              </ProtectedRoute>
            } />
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map-demo" element={<MapDemo />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/drivers/:id" element={<DriverDetails />} />
              <Route path="/drivers/:id/report" element={<DriverReportPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/fleet" element={<FleetManagement />} />
              <Route path="/vehicles/new" element={<VehicleForm />} />
              <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
              <Route path="/maintenance" element={<MaintenanceSchedule />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/dispatch" element={<QuickDispatch />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
