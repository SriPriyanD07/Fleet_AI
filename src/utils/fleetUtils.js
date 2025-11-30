/**
 * Utility functions for fleet management operations
 */

/**
 * Calculates the distance between two coordinates (in kilometers)
 * using the Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Converts numeric degrees to radians
 */
const toRad = (value) => {
  return (value * Math.PI) / 180;
};

/**
 * Calculates estimated time of arrival (ETA) in minutes
 * @param {number} distance - Distance in kilometers
 * @param {number} speed - Average speed in km/h
 * @returns {number} ETA in minutes
 */
export const calculateETA = (distance, speed) => {
  if (!speed || speed <= 0) return 0;
  return Math.round((distance / speed) * 60); // Convert hours to minutes
};

/**
 * Formats a duration in minutes to a human-readable string
 * e.g., 125 -> "2h 5m"
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

/**
 * Calculates fuel consumption based on distance and consumption rate
 * @param {number} distance - Distance in kilometers
 * @param {number} consumptionRate - Liters per 100km
 * @returns {number} Fuel consumption in liters
 */
export const calculateFuelConsumption = (distance, consumptionRate) => {
  return (distance * consumptionRate) / 100;
};

/**
 * Groups vehicles by status
 * @param {Array} vehicles - Array of vehicle objects
 * @returns {Object} Vehicles grouped by status
 */
export const groupVehiclesByStatus = (vehicles = []) => {
  return vehicles.reduce((acc, vehicle) => {
    const status = vehicle.status || 'unknown';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(vehicle);
    return acc;
  }, {});
};

/**
 * Sorts vehicles by a given property
 * @param {Array} vehicles - Array of vehicle objects
 * @param {string} property - Property to sort by
 * @param {boolean} ascending - Sort direction
 * @returns {Array} Sorted array of vehicles
 */
export const sortVehicles = (vehicles, property, ascending = true) => {
  return [...vehicles].sort((a, b) => {
    let valueA = a[property];
    let valueB = b[property];

    // Handle nested properties
    if (property.includes('.')) {
      valueA = property.split('.').reduce((o, i) => o?.[i], a);
      valueB = property.split('.').reduce((o, i) => o?.[i], b);
    }

    // Handle different data types
    if (typeof valueA === 'string') {
      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // Numeric comparison
    return ascending ? valueA - valueB : valueB - valueA;
  });
};

/**
 * Filters vehicles based on search criteria
 * @param {Array} vehicles - Array of vehicle objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered array of vehicles
 */
export const filterVehicles = (vehicles = [], filters = {}) => {
  return vehicles.filter(vehicle => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      const vehicleValue = vehicle[key];
      
      // Handle nested properties
      if (key.includes('.')) {
        const nestedValue = key.split('.').reduce((o, i) => o?.[i], vehicle);
        return String(nestedValue).toLowerCase().includes(String(value).toLowerCase());
      }
      
      // Handle different filter types
      if (Array.isArray(value)) {
        return value.includes(vehicleValue);
      }
      
      if (typeof value === 'string') {
        return String(vehicleValue).toLowerCase().includes(value.toLowerCase());
      }
      
      if (typeof value === 'function') {
        return value(vehicle);
      }
      
      return vehicleValue === value;
    });
  });
};

/**
 * Calculates statistics for a fleet
 * @param {Array} vehicles - Array of vehicle objects
 * @returns {Object} Fleet statistics
 */
export const calculateFleetStats = (vehicles = []) => {
  if (!vehicles.length) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      maintenance: 0,
      utilization: 0,
      averageMileage: 0,
    };
  }

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const totalMileage = vehicles.reduce((sum, v) => sum + (v.mileage || 0), 0);

  return {
    total: vehicles.length,
    active: activeVehicles,
    inactive: vehicles.filter(v => v.status === 'inactive').length,
    maintenance: maintenanceVehicles,
    utilization: Math.round((activeVehicles / vehicles.length) * 100),
    averageMileage: Math.round(totalMileage / vehicles.length),
  };
};

/**
 * Generates a unique ID for a vehicle
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateVehicleId = (prefix = 'VH') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Validates vehicle data
 * @param {Object} vehicle - Vehicle data to validate
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateVehicle = (vehicle) => {
  const errors = {};
  
  if (!vehicle.licensePlate?.trim()) {
    errors.licensePlate = 'License plate is required';
  }
  
  if (!vehicle.make?.trim()) {
    errors.make = 'Make is required';
  }
  
  if (!vehicle.model?.trim()) {
    errors.model = 'Model is required';
  }
  
  if (!vehicle.year || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
    errors.year = 'Invalid year';
  }
  
  if (vehicle.mileage < 0) {
    errors.mileage = 'Mileage cannot be negative';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Formats vehicle data for display
 * @param {Object} vehicle - Vehicle data
 * @returns {Object} Formatted vehicle data
 */
export const formatVehicleData = (vehicle) => {
  if (!vehicle) return {};
  
  return {
    ...vehicle,
    // Add any formatting for display purposes
    formattedMileage: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A',
    formattedLastService: vehicle.lastServiceDate 
      ? new Date(vehicle.lastServiceDate).toLocaleDateString()
      : 'N/A',
    status: vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1) || 'Unknown',
  };
};

/**
 * Simulates vehicle movement for demo purposes
 * @param {Object} currentPosition - Current position { lat, lng }
 * @returns {Object} New position { lat, lng }
 */
export const simulateMovement = (currentPosition) => {
  // Small random movement (in degrees)
  const moveBy = () => (Math.random() * 0.01) - 0.005;
  
  return {
    lat: currentPosition.lat + moveBy(),
    lng: currentPosition.lng + moveBy(),
  };
};
