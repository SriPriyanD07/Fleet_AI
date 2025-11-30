import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Combines multiple class names
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}


/**
 * Format date to a readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM d, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format time ago (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time ago string
 */
export const formatTimeAgo = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return 'Some time ago';
  }
};

/**
 * Format distance in kilometers
 * @param {number} meters - Distance in meters
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted distance string
 */
export const formatDistance = (meters, decimals = 1) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(decimals)} km`;
};

/**
 * Format speed in km/h
 * @param {number} speed - Speed in m/s
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted speed string
 */
export const formatSpeed = (speed, decimals = 0) => {
  // Convert m/s to km/h
  const kmh = speed * 3.6;
  return `${kmh.toFixed(decimals)} km/h`;
};

/**
 * Format duration in hours and minutes
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours === 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '0m';
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format phone number
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digit characters
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Check if number is valid
  const match = cleaned.match(/^(\d{1,3})?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    // Format as (123) 456-7890
    return `(${match[2]}) ${match[3]}-${match[4]}`;
  }
  
  // Return original if format doesn't match
  return phone;
};

/**
 * Convert object to query string
 * @param {Object} params - Object with query parameters
 * @returns {string} Query string
 */
export const toQueryString = (params) => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string (with or without leading ?)
 * @returns {Object} Parsed query parameters
 */
export const parseQueryString = (queryString) => {
  const params = {};
  // Remove leading ? if present
  const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  
  query.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });
  
  return params;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Generate a random color
 * @returns {string} Hex color code
 */
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
