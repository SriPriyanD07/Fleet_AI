// Simple localStorage-based database for FleetTracker
class FleetDatabase {
  constructor() {
    this.keys = {
      VEHICLES: 'fleet_vehicles',
      DRIVERS: 'fleet_drivers', 
      ORDERS: 'fleet_orders',
      MAINTENANCE: 'fleet_maintenance',
      DISPATCHES: 'fleet_dispatches'
    };
    this.initializeData();
  }

  initializeData() {
    // Initialize with sample data if not exists
    if (!this.get(this.keys.VEHICLES)) {
      this.set(this.keys.VEHICLES, this.generateSampleVehicles());
    }
    if (!this.get(this.keys.DRIVERS)) {
      this.set(this.keys.DRIVERS, this.generateSampleDrivers());
    }
    if (!this.get(this.keys.ORDERS)) {
      this.set(this.keys.ORDERS, this.generateSampleOrders());
    }
    if (!this.get(this.keys.MAINTENANCE)) {
      this.set(this.keys.MAINTENANCE, []);
    }
    if (!this.get(this.keys.DISPATCHES)) {
      this.set(this.keys.DISPATCHES, this.generateSampleDispatches());
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  }

  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error setting data:', error);
      return false;
    }
  }

  // Vehicle operations
  addVehicle(vehicle) {
    const vehicles = this.get(this.keys.VEHICLES) || [];
    const newVehicle = {
      ...vehicle,
      id: `VH-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };
    vehicles.push(newVehicle);
    this.set(this.keys.VEHICLES, vehicles);
    return newVehicle;
  }

  getVehicles() {
    return this.get(this.keys.VEHICLES) || [];
  }

  // Driver operations
  addDriver(driver) {
    const drivers = this.get(this.keys.DRIVERS) || [];
    const newDriver = {
      ...driver,
      id: `DRV-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    drivers.push(newDriver);
    this.set(this.keys.DRIVERS, drivers);
    return newDriver;
  }

  getDrivers() {
    return this.get(this.keys.DRIVERS) || [];
  }

  // Order operations
  addOrder(order) {
    const orders = this.get(this.keys.ORDERS) || [];
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    orders.push(newOrder);
    this.set(this.keys.ORDERS, orders);
    return newOrder;
  }

  getOrders() {
    return this.get(this.keys.ORDERS) || [];
  }

  // Maintenance operations
  addMaintenance(maintenance) {
    const maintenanceList = this.get(this.keys.MAINTENANCE) || [];
    const newMaintenance = {
      ...maintenance,
      id: `MAINT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };
    maintenanceList.push(newMaintenance);
    this.set(this.keys.MAINTENANCE, maintenanceList);
    return newMaintenance;
  }

  getMaintenance() {
    return this.get(this.keys.MAINTENANCE) || [];
  }

  // Dispatch operations
  addDispatch(dispatch) {
    const dispatches = this.get(this.keys.DISPATCHES) || [];
    const newDispatch = {
      ...dispatch,
      id: `DISP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    dispatches.push(newDispatch);
    this.set(this.keys.DISPATCHES, dispatches);
    return newDispatch;
  }

  getDispatches() {
    return this.get(this.keys.DISPATCHES) || [];
  }

  // Export functionality
  exportToCSV(data, filename) {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Sample data generators
  generateSampleVehicles() {
    return [
      {
        id: 'VH-1001',
        make: 'Tata',
        model: 'Prima',
        licensePlate: 'MH01AB1234',
        type: 'Truck',
        year: 2022,
        status: 'active',
        fuelType: 'Diesel',
        mileage: 45000,
        location: 'Mumbai',
        driverName: 'Rajesh Sharma',
        driverId: 'DRV-1001'
      },
      {
        id: 'VH-1002',
        make: 'Ashok Leyland',
        model: 'Signa',
        licensePlate: 'GJ02CD5678',
        type: 'Truck',
        year: 2021,
        status: 'active',
        fuelType: 'Diesel',
        mileage: 52000,
        location: 'Ahmedabad',
        driverName: 'Priya Patel',
        driverId: 'DRV-1002'
      }
    ];
  }

  generateSampleDrivers() {
    return [
      {
        id: 'DRV-1001',
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@fleetdriver.com',
        phone: '+91 9876543210',
        licenseNumber: 'MH1234567890123',
        licenseExpiry: '2025-12-15',
        status: 'active',
        hireDate: '2022-03-15',
        city: 'Mumbai',
        assignedVehicle: 'VH-1001'
      },
      {
        id: 'DRV-1002',
        name: 'Priya Patel',
        email: 'priya.patel@fleetdriver.com',
        phone: '+91 8765432109',
        licenseNumber: 'GJ9876543210987',
        licenseExpiry: '2024-08-20',
        status: 'active',
        hireDate: '2021-07-10',
        city: 'Ahmedabad',
        assignedVehicle: 'VH-1002'
      }
    ];
  }

  generateSampleOrders() {
    return [
      {
        id: 'ORD-1001',
        customerName: 'ABC Company',
        origin: 'Mumbai',
        destination: 'Delhi',
        vehicleId: 'VH-1001',
        driverId: 'DRV-1001',
        status: 'in_transit',
        weight: 5000,
        distance: 1400,
        eta: '2024-12-06'
      },
      {
        id: 'ORD-1002',
        customerName: 'XYZ Industries',
        origin: 'Ahmedabad',
        destination: 'Bangalore',
        vehicleId: 'VH-1002',
        driverId: 'DRV-1002',
        status: 'pending',
        weight: 3500,
        distance: 900,
        eta: '2024-12-07'
      }
    ];
  }

  generateSampleDispatches() {
    return [
      {
        id: 'DISP-1001',
        orderId: 'ORD-1001',
        vehicleId: 'VH-1001',
        driverId: 'DRV-1001',
        route: 'Mumbai → Delhi',
        status: 'active',
        dispatchTime: new Date().toISOString(),
        estimatedArrival: '2024-12-06T18:00:00Z'
      },
      {
        id: 'DISP-1002',
        orderId: 'ORD-1002',
        vehicleId: 'VH-1002',
        driverId: 'DRV-1002',
        route: 'Ahmedabad → Bangalore',
        status: 'scheduled',
        dispatchTime: new Date(Date.now() + 86400000).toISOString(),
        estimatedArrival: '2024-12-07T20:00:00Z'
      }
    ];
  }
}

// Create singleton instance
export const fleetDB = new FleetDatabase();
export default fleetDB;
