import axios from 'axios';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Create axios instance with base URL and default headers
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to include auth token and handle request logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add timestamp to avoid caching
    if (config.method === 'get') {
      config.params = {
        ...(config.params || {}),
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    const errorResponse = error.response || {};
    const errorMessage = errorResponse.data?.message || error.message;
    const status = errorResponse.status;

    // Log error details
    console.error('API Error:', {
      url: error.config?.url,
      status,
      message: errorMessage,
      data: errorResponse.data,
    });

    // Handle specific error statuses
    if (status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken');
      // Only redirect if not already on login page to prevent infinite loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Add custom error handling for other status codes if needed
    if (status >= 500) {
      // Handle server errors
      console.error('Server Error:', errorMessage);
    } else if (status >= 400) {
      // Handle client errors
      console.error('Client Error:', errorMessage);
    }

    return Promise.reject({
      status,
      message: errorMessage,
      data: errorResponse.data,
      originalError: error,
    });
  }
);

/**
 * Authentication API Service
 * Handles user authentication and profile management
 */
export const authAPI = {
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} Axios response with user data and auth token
   */
  login: (credentials) => api.post('/auth/login', credentials),
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Axios response with created user data
   */
  register: (userData) => api.post('/auth/register', userData),
  
  /**
   * Get current user profile
   * @returns {Promise} Axios response with user profile data
   */
  getProfile: () => api.get('/auth/me'),
  
  /**
   * Update current user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Axios response with updated user data
   */
  updateProfile: (userData) => api.put('/auth/me', userData),
  
  /**
   * Request password reset
   * @param {string} email - User's email address
   * @returns {Promise} Axios response
   */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  /**
   * Reset password with token
   * @param {Object} data - Reset password data (token, newPassword, confirmPassword)
   * @returns {Promise} Axios response
   */
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

/**
 * Vehicles API Service
 * Handles all vehicle-related operations
 */
export const vehiclesAPI = {
  /**
   * Get all vehicles with optional filtering and pagination
   * @param {Object} params - Query parameters (page, limit, status, type, etc.)
   * @returns {Promise} Axios response with paginated vehicle data
   */
  getAll: (params = {}) => api.get('/vehicles', { params }),
  /**
   * Get vehicle by ID
   * @param {string} id - Vehicle ID
   * @returns {Promise} Axios response with vehicle details
   */
  getById: (id) => api.get(`/vehicles/${id}`),
  /**
   * Create a new vehicle
   * @param {Object} vehicleData - Vehicle data to create
   * @returns {Promise} Axios response with created vehicle data
   */
  create: (vehicleData) => api.post('/vehicles', vehicleData),
  /**
   * Update an existing vehicle
   * @param {string} id - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @returns {Promise} Axios response with updated vehicle data
   */
  update: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  /**
   * Delete a vehicle
   * @param {string} id - Vehicle ID to delete
   * @returns {Promise} Axios response
   */
  delete: (id) => api.delete(`/vehicles/${id}`),
  /**
   * Get vehicle status summary
   * @returns {Promise} Axios response with status counts
   */
  getStatus: () => api.get('/vehicles/status'),
  /**
   * Get real-time vehicle locations
   * @returns {Promise} Axios response with vehicle locations
   */
  getLocations: () => api.get('/vehicles/locations'),
  /**
   * Get vehicle maintenance history
   * @param {string} id - Vehicle ID
   * @returns {Promise} Axios response with maintenance records
   */
  getMaintenanceHistory: (id) => api.get(`/vehicles/${id}/maintenance`),
  /**
   * Add maintenance record
   * @param {string} id - Vehicle ID
   * @param {Object} maintenanceData - Maintenance record data
   * @returns {Promise} Axios response with created maintenance record
   */
  addMaintenanceRecord: (id, maintenanceData) => 
    api.post(`/vehicles/${id}/maintenance`, maintenanceData),
  /**
   * Get vehicle utilization metrics
   * @param {Object} params - Query parameters (startDate, endDate, etc.)
   * @returns {Promise} Axios response with utilization data
   */
  getUtilization: (params = {}) => 
    api.get('/vehicles/analytics/utilization', { params }),
};

/**
 * Orders API Service
 * Handles all order-related operations
 */
export const ordersAPI = {
  /**
   * Get all orders with optional filtering and pagination
   * @param {Object} params - Query parameters (page, limit, status, dateRange, etc.)
   * @returns {Promise} Axios response with paginated order data
   */
  getAll: (params = {}) => api.get('/orders', { params }),
  /**
   * Get order by ID
   * @param {string} id - Order ID
   * @returns {Promise} Axios response with order details
   */
  getById: (id) => api.get(`/orders/${id}`),
  /**
   * Create a new order
   * @param {Object} orderData - Order data to create
   * @returns {Promise} Axios response with created order data
   */
  create: (orderData) => api.post('/orders', orderData),
  /**
   * Update an existing order
   * @param {string} id - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {Promise} Axios response with updated order data
   */
  update: (id, orderData) => api.put(`/orders/${id}`, orderData),
  /**
   * Delete an order
   * @param {string} id - Order ID to delete
   * @returns {Promise} Axios response
   */
  delete: (id) => api.delete(`/orders/${id}`),
  /**
   * Get order status
   * @param {string} id - Order ID
   * @returns {Promise} Axios response with order status
   */
  getStatus: (id) => api.get(`/orders/${id}/status`),
  /**
   * Assign a driver to an order
   * @param {string} orderId - Order ID
   * @param {string} driverId - Driver ID to assign
   * @returns {Promise} Axios response with updated order data
   */
  assignDriver: (orderId, driverId) => 
    api.post(`/orders/${orderId}/assign-driver`, { driverId }),
  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @param {string} notes - Optional status change notes
   * @returns {Promise} Axios response with updated order data
   */
  updateStatus: (orderId, status, notes = '') => 
    api.patch(`/orders/${orderId}/status`, { status, notes }),
  /**
   * Get order history
   * @param {string} id - Order ID
   * @returns {Promise} Axios response with order history
   */
  getHistory: (id) => api.get(`/orders/${id}/history`),
  /**
   * Get orders by status
   * @param {string} status - Order status to filter by
   * @param {Object} params - Additional query parameters
   * @returns {Promise} Axios response with filtered orders
   */
  getByStatus: (status, params = {}) => 
    api.get('/orders', { params: { ...params, status } }),
};

/**
 * Drivers API Service
 * Handles all driver-related operations
 */
export const driversAPI = {
  /**
   * Get all drivers with optional filtering
   * @param {Object} params - Query parameters (status, isAvailable, etc.)
   * @returns {Promise} Axios response with driver list
   */
  getAll: (params = {}) => api.get('/drivers', { params }),
  /**
   * Get driver by ID
   * @param {string} id - Driver ID
   * @returns {Promise} Axios response with driver details
   */
  getById: (id) => api.get(`/drivers/${id}`),
  /**
   * Create a new driver
   * @param {Object} driverData - Driver data to create
   * @returns {Promise} Axios response with created driver data
   */
  create: (driverData) => api.post('/drivers', driverData),
  /**
   * Update an existing driver
   * @param {string} id - Driver ID
   * @param {Object} driverData - Updated driver data
   * @returns {Promise} Axios response with updated driver data
   */
  update: (id, driverData) => api.put(`/drivers/${id}`, driverData),
  /**
   * Delete a driver
   * @param {string} id - Driver ID to delete
   * @returns {Promise} Axios response
   */
  delete: (id) => api.delete(`/drivers/${id}`),
  /**
   * Get orders assigned to a driver
   * @param {string} driverId - Driver ID
   * @param {Object} params - Query parameters (status, dateRange, etc.)
   * @returns {Promise} Axios response with assigned orders
   */
  getAssignedOrders: (driverId, params = {}) => 
    api.get(`/drivers/${driverId}/orders`, { params }),
  /**
   * Get driver's current location
   * @param {string} driverId - Driver ID
   * @returns {Promise} Axios response with location data
   */
  getLocation: (driverId) => api.get(`/drivers/${driverId}/location`),
  /**
   * Update driver's availability status
   * @param {string} driverId - Driver ID
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} Axios response with updated driver data
   */
  updateAvailability: (driverId, isAvailable) => 
    api.patch(`/drivers/${driverId}/availability`, { isAvailable }),
  /**
   * Get driver's performance metrics
   * @param {string} driverId - Driver ID
   * @param {Object} params - Query parameters (startDate, endDate, etc.)
   * @returns {Promise} Axios response with performance data
   */
  getPerformance: (driverId, params = {}) => 
    api.get(`/drivers/${driverId}/performance`, { params }),
};

/**
 * Analytics API Service
 * Handles all analytics and reporting operations
 */
export const analyticsAPI = {
  /**
   * Get fleet-wide metrics and KPIs
   * @param {Object} params - Query parameters (timeRange, groupBy, etc.)
   * @returns {Promise} Axios response with fleet metrics
   */
  getFleetMetrics: (params = {}) => 
    api.get('/analytics/fleet-metrics', { params }),
  /**
   * Get driver performance analytics
   * @param {Object} params - Query parameters (driverId, dateRange, metrics, etc.)
   * @returns {Promise} Axios response with performance data
   */
  getDriverPerformance: (params = {}) => 
    api.get('/analytics/driver-performance', { params }),
  /**
   * Get vehicle utilization metrics
   * @param {Object} params - Query parameters (vehicleId, dateRange, groupBy, etc.)
   * @returns {Promise} Axios response with utilization data
   */
  getVehicleUtilization: (params = {}) => 
    api.get('/analytics/vehicle-utilization', { params }),
  /**
   * Get delivery performance metrics
   * @param {Object} params - Query parameters (dateRange, status, driverId, etc.)
   * @returns {Promise} Axios response with delivery metrics
   */
  getDeliveryMetrics: (params = {}) => 
    api.get('/analytics/delivery-metrics', { params }),
  /**
   * Get maintenance and downtime analytics
   * @param {Object} params - Query parameters (vehicleId, dateRange, etc.)
   * @returns {Promise} Axios response with maintenance analytics
   */
  getMaintenanceAnalytics: (params = {}) => 
    api.get('/analytics/maintenance', { params }),
  /**
   * Get fuel consumption analytics
   * @param {Object} params - Query parameters (vehicleId, dateRange, groupBy, etc.)
   * @returns {Promise} Axios response with fuel consumption data
   */
  getFuelAnalytics: (params = {}) => 
    api.get('/analytics/fuel-consumption', { params }),
};

/**
 * Utility function to handle API errors consistently
 * @param {Error} error - The error object from axios
 * @param {Function} errorHandler - Custom error handler function
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error, errorHandler) => {
  const errorResponse = {
    success: false,
    message: 'An unexpected error occurred',
    status: error.response?.status || 500,
    data: error.response?.data || null,
    originalError: error,
  };

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorResponse.message = 
      error.response.data?.message || 
      error.response.statusText ||
      'An error occurred while processing your request';
  } else if (error.request) {
    // The request was made but no response was received
    errorResponse.message = 'No response received from the server';
  }

  // Call custom error handler if provided
  if (typeof errorHandler === 'function') {
    return errorHandler(errorResponse);
  }

  return errorResponse;
};

// Vehicle related functions
export const fetchVehicles = async () => {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

// Order related functions
export const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Export the configured axios instance
export default api;
