import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect clicks outside of a component
 * @param {Function} handler - Function to call when a click outside is detected
 * @param {boolean} listenWhen - Whether to listen for outside clicks
 * @returns {React.RefObject} Ref to attach to the component
 */
export const useClickOutside = (handler, listenWhen = true) => {
  const ref = useRef();

  useEffect(() => {
    if (!listenWhen) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handler, listenWhen]);

  return ref;
};

/**
 * Custom hook to handle debounced state updates
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook to handle async operations with loading and error states
 * @param {Function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Whether to execute the function immediately
 * @returns {Object} { execute, loading, error, data }
 */
export const useAsync = (asyncFunction, immediate = false) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      if (!mountedRef.current) return null;
      setData(result);
      return result;
    } catch (err) {
      if (!mountedRef.current) return null;
      setError(err);
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [execute, immediate]);

  return { execute, loading, error, data };
};

/**
 * Custom hook to handle infinite scrolling
 * @param {Function} fetchMore - Function to fetch more data
 * @param {Object} options - Options for the intersection observer
 * @returns {Array} [ref, loading, error]
 */
export const useInfiniteScroll = (fetchMore, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef();
  const loadMoreRef = useRef();
  const { root = null, rootMargin = '0px', threshold = 0.1 } = options;

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        setLoading(true);
        fetchMore()
          .catch((err) => {
            setError(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [fetchMore, loading]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    observerRef.current = new IntersectionObserver(handleObserver, {
      root,
      rootMargin,
      threshold,
    });

    if (element) {
      observerRef.current.observe(element);
    }

    return () => {
      if (element) {
        observerRef.current?.unobserve(element);
      }
    };
  }, [handleObserver, root, rootMargin, threshold]);

  return [loadMoreRef, loading, error];
};

/**
 * Custom hook to handle keyboard shortcuts
 * @param {string} key - The key to listen for
 * @param {Function} callback - Function to call when the key is pressed
 * @param {Array} dependencies - Dependencies for the callback
 * @param {Object} options - Options for the event listener
 */
export const useKeyPress = (key, callback, dependencies = [], options = {}) => {
  const { target = window, event = 'keydown', preventDefault = true } = options;

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === key || event.code === key) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    target.addEventListener(event, handleKeyPress);
    return () => {
      target.removeEventListener(event, handleKeyPress);
    };
  }, [key, callback, target, event, preventDefault, ...dependencies]);
};

/**
 * Custom hook to track previous value of a state or prop
 * @param {*} value - Value to track
 * @returns {*} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * Custom hook to handle localStorage state
 * @param {string} key - Key to use in localStorage
 * @param {*} initialValue - Initial value
 * @returns {Array} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook to handle sessionStorage state
 * @param {string} key - Key to use in sessionStorage
 * @param {*} initialValue - Initial value
 * @returns {Array} [storedValue, setValue]
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
