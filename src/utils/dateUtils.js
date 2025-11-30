/**
 * Formats a date object to YYYY-MM-DD format for date inputs
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return ''; // Invalid date
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date to a more readable format
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @param {boolean} [options.includeTime=false] - Whether to include time in the output
 * @returns {string} Formatted date string
 */
export const formatDate = (date, { includeTime = false } = {}) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString(undefined, options);
};

/**
 * Calculates the difference between two dates in the specified unit
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date (defaults to now)
 * @param {string} unit - The unit of time to return (days, hours, minutes, seconds)
 * @returns {number} The difference in the specified unit
 */
export const dateDiff = (date1, date2 = new Date(), unit = 'days') => {
  const diffMs = new Date(date2) - new Date(date1);
  const diffSec = Math.floor(diffMs / 1000);
  
  switch (unit.toLowerCase()) {
    case 'days':
      return Math.floor(diffSec / (60 * 60 * 24));
    case 'hours':
      return Math.floor(diffSec / (60 * 60));
    case 'minutes':
      return Math.floor(diffSec / 60);
    case 'seconds':
      return diffSec;
    default:
      return diffMs;
  }
};

/**
 * Adds a specified amount of time to a date
 * @param {Date} date - The starting date
 * @param {number} amount - The amount to add
 * @param {string} unit - The unit of time to add (days, months, years, hours, minutes)
 * @returns {Date} The new date
 */
export const addToDate = (date, amount, unit = 'days') => {
  const d = new Date(date);
  
  switch (unit.toLowerCase()) {
    case 'days':
      d.setDate(d.getDate() + amount);
      break;
    case 'months':
      d.setMonth(d.getMonth() + amount);
      break;
    case 'years':
      d.setFullYear(d.getFullYear() + amount);
      break;
    case 'hours':
      d.setHours(d.getHours() + amount);
      break;
    case 'minutes':
      d.setMinutes(d.getMinutes() + amount);
      break;
    default:
      break;
  }
  
  return d;
};

/**
 * Checks if a date is between two other dates (inclusive)
 * @param {Date} date - The date to check
 * @param {Date} start - The start date
 * @param {Date} end - The end date
 * @returns {boolean} True if the date is between start and end (inclusive)
 */
export const isDateBetween = (date, start, end) => {
  const d = new Date(date).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  
  return d >= s && d <= e;
};

/**
 * Returns the start of the day for a given date
 * @param {Date} date - The date
 * @returns {Date} The start of the day (00:00:00.000)
 */
export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Returns the end of the day for a given date
 * @param {Date} date - The date
 * @returns {Date} The end of the day (23:59:59.999)
 */
export const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Checks if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Formats a duration in milliseconds to a human-readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration (e.g., "2h 30m" or "1d 5h")
 */
export const formatDuration = (ms) => {
  if (!ms && ms !== 0) return 'N/A';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  
  return `${seconds}s`;
};

/**
 * Converts a time string (e.g., "14:30") to a Date object
 * @param {string} timeString - The time string (HH:MM or HH:MM:SS)
 * @param {Date} [referenceDate] - Optional reference date (defaults to today)
 * @returns {Date} The combined date and time
 */
export const timeStringToDate = (timeString, referenceDate = new Date()) => {
  if (!timeString) return null;
  
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date(referenceDate);
  
  date.setHours(hours || 0, minutes || 0, seconds || 0, 0);
  
  return date;
};

/**
 * Converts a Date object to a time string (HH:MM)
 * @param {Date} date - The date
 * @returns {string} The time string (HH:MM)
 */
export const dateToTimeString = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};
