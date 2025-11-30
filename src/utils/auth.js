/**
 * Get the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The authentication token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get the authorization header for API requests
 * @returns {Object} The authorization header
 */
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handle API response and check for authentication errors
 * @param {Response} response - The fetch Response object
 * @returns {Promise<Object>} The parsed JSON response
 * @throws {Error} If the response is not OK
 */
export const handleApiResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

/**
 * Make an authenticated API request
 * @param {string} url - The API endpoint URL
 * @param {Object} options - The fetch options
 * @returns {Promise<Object>} The parsed JSON response
 */
export const authFetch = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return handleApiResponse(response);
};

/**
 * Make a GET request to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The parsed JSON response
 */
export const apiGet = (url, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return authFetch(fullUrl, { method: 'GET' });
};

/**
 * Make a POST request to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request body
 * @returns {Promise<Object>} The parsed JSON response
 */
export const apiPost = (url, data) => {
  return authFetch(url, {
    method: 'POST',
    body: data,
  });
};

/**
 * Make a PUT request to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request body
 * @returns {Promise<Object>} The parsed JSON response
 */
export const apiPut = (url, data) => {
  return authFetch(url, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Make a DELETE request to the API
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} The parsed JSON response
 */
export const apiDelete = (url) => {
  return authFetch(url, { method: 'DELETE' });
};

/**
 * Handle API errors and show appropriate toast messages
 * @param {Error} error - The error object
 * @param {string} defaultMessage - The default error message to show
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.message || error.message || defaultMessage;
  console.error('API Error:', error);
  // You can integrate with a toast notification library here
  // For example: toast.error(message);
  return message;
};
