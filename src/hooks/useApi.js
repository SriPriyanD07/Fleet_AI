import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for making GET requests with React Query
 * @param {string} key - Unique key for the query
 * @param {Function} fetchFn - Function that returns a promise with the data
 * @param {Object} options - React Query options
 * @returns {Object} Query result with data, loading, error, etc.
 */
export const useApiQuery = (key, fetchFn, options = {}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      try {
        return await fetchFn();
      } catch (error) {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          logout();
          navigate('/login', { replace: true });
          toast.error('Your session has expired. Please log in again.');
        }
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Custom hook for making POST/PUT/DELETE requests with React Query
 * @param {Function} mutationFn - Function that performs the mutation
 * @param {Object} options - React Query mutation options
 * @returns {Object} Mutation result with mutate function, loading, error, etc.
 */
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      try {
        return await mutationFn(data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          logout();
          navigate('/login', { replace: true });
          toast.error('Your session has expired. Please log in again.');
        }
        throw error;
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      // Invalidate relevant queries to refetch data
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries);
      }
    },
    ...options,
  });
};

/**
 * Custom hook for handling paginated API queries
 * @param {string} key - Base key for the query
 * @param {Function} fetchFn - Function that accepts pagination params and returns a promise
 * @param {Object} options - Additional options
 * @returns {Object} Paginated query result
 */
export const usePaginatedQuery = (key, fetchFn, options = {}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.pageSize || 10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const queryKey = [...(Array.isArray(key) ? key : [key]), { page, pageSize }];
  
  const query = useApiQuery(
    queryKey,
    async () => {
      const response = await fetchFn({ page, pageSize });
      setTotalItems(response.total || 0);
      setTotalPages(response.totalPages || 1);
      return response.data || response;
    },
    {
      keepPreviousData: true,
      ...options,
    }
  );

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const changePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  return {
    ...query,
    page,
    pageSize,
    totalItems,
    totalPages,
    goToPage,
    changePageSize,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPage: () => goToPage(Math.min(page + 1, totalPages)),
    previousPage: () => goToPage(Math.max(1, page - 1)),
  };
};

/**
 * Hook for handling infinite scroll queries
 * @param {string} key - Base key for the query
 * @param {Function} fetchFn - Function that accepts page param and returns a promise
 * @param {Object} options - Additional options
 * @returns {Object} Infinite query result
 */
export const useInfiniteQuery = (key, fetchFn, options = {}) => {
  return useInfiniteQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    ...options,
  });
};
