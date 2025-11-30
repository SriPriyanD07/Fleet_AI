import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { fleetDB } from '../../services/database';

const ExportButton = ({ 
  data, 
  filename = 'export', 
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (!data || data.length === 0) {
        alert('No data available to export');
        return;
      }

      // Use the database export functionality
      fleetDB.exportToCSV(data, filename);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !data || data.length === 0}
      className={getButtonClasses()}
    >
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};

// Specific export components for different data types
export const ExportVehiclesButton = ({ className = '' }) => {
  const vehicles = fleetDB.getVehicles();
  return (
    <ExportButton 
      data={vehicles} 
      filename="vehicles" 
      className={className}
    />
  );
};

export const ExportDriversButton = ({ className = '' }) => {
  const drivers = fleetDB.getDrivers();
  return (
    <ExportButton 
      data={drivers} 
      filename="drivers" 
      className={className}
    />
  );
};

export const ExportOrdersButton = ({ className = '' }) => {
  const orders = fleetDB.getOrders();
  return (
    <ExportButton 
      data={orders} 
      filename="orders" 
      className={className}
    />
  );
};

export const ExportMaintenanceButton = ({ className = '' }) => {
  const maintenance = fleetDB.getMaintenance();
  return (
    <ExportButton 
      data={maintenance} 
      filename="maintenance" 
      className={className}
    />
  );
};

export const ExportDispatchesButton = ({ className = '' }) => {
  const dispatches = fleetDB.getDispatches();
  return (
    <ExportButton 
      data={dispatches} 
      filename="dispatches" 
      className={className}
    />
  );
};

// Performance data export buttons
export const ExportDriverPerformanceButton = ({ className = '' }) => {
  const drivers = fleetDB.getDrivers();
  const orders = fleetDB.getOrders();
  
  // Generate driver performance data
  const performanceData = drivers.map(driver => {
    const driverOrders = orders.filter(order => order.driverId === driver.id);
    const completedOrders = driverOrders.filter(order => order.status === 'completed');
    
    return {
      driverName: driver.name,
      totalOrders: driverOrders.length,
      completedOrders: completedOrders.length,
      completionRate: driverOrders.length > 0 ? ((completedOrders.length / driverOrders.length) * 100).toFixed(2) + '%' : '0%',
      phone: driver.phone,
      licenseExpiry: driver.licenseExpiry,
      status: driver.status
    };
  });

  return (
    <ExportButton 
      data={performanceData} 
      filename="driver_performance" 
      className={className}
    />
  );
};

export const ExportDeliveryPerformanceButton = ({ className = '' }) => {
  const orders = fleetDB.getOrders();
  
  // Generate delivery performance data
  const deliveryData = orders.map(order => ({
    orderId: order.id,
    customerName: order.customerName,
    origin: order.origin,
    destination: order.destination,
    status: order.status,
    distance: order.distance,
    weight: order.weight,
    eta: order.eta,
    createdAt: order.createdAt
  }));

  return (
    <ExportButton 
      data={deliveryData} 
      filename="delivery_performance" 
      className={className}
    />
  );
};

export const ExportMaintenanceCostButton = ({ className = '' }) => {
  const maintenance = fleetDB.getMaintenance();
  const vehicles = fleetDB.getVehicles();
  
  // Generate maintenance cost data
  const costData = maintenance.map(item => {
    const vehicle = vehicles.find(v => v.id === item.vehicleId);
    return {
      maintenanceId: item.id,
      vehiclePlate: vehicle ? vehicle.licensePlate : 'Unknown',
      vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown',
      type: item.type,
      description: item.description,
      estimatedCost: item.estimatedCost || 0,
      scheduledDate: item.scheduledDate,
      status: item.status,
      serviceProvider: item.serviceProvider
    };
  });

  return (
    <ExportButton 
      data={costData} 
      filename="maintenance_costs" 
      className={className}
    />
  );
};

export const ExportRouteEfficiencyButton = ({ className = '' }) => {
  const orders = fleetDB.getOrders();
  const vehicles = fleetDB.getVehicles();
  
  // Generate route efficiency data
  const efficiencyData = orders.map(order => {
    const vehicle = vehicles.find(v => v.id === order.vehicleId);
    return {
      orderId: order.id,
      route: `${order.origin} → ${order.destination}`,
      vehiclePlate: vehicle ? vehicle.licensePlate : 'Unassigned',
      distance: order.distance || 0,
      weight: order.weight || 0,
      efficiency: order.distance && order.weight ? (order.weight / order.distance).toFixed(2) : 0,
      status: order.status,
      eta: order.eta
    };
  });

  return (
    <ExportButton 
      data={efficiencyData} 
      filename="route_efficiency" 
      className={className}
    />
  );
};

export default ExportButton;
