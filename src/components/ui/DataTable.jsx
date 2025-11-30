import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

export const DataTable = ({
  columns,
  data,
  pageSize: initialPageSize = 10,
  showPagination = true,
  showPageSizeOptions = true,
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
  className = '',
  rowClassName = '',
  headerClassName = '',
  bodyClassName = '',
  onRowClick,
  loading = false,
  emptyState,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter and sort data
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) {
      console.error('DataTable: data prop must be an array');
      return [];
    }
    
    let result = [...data];
    
    // Apply search
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item => {
        if (!item) return false;
        return columns.some(column => {
          if (column.searchable === false) return false;
          const value = column.accessor.split('.').reduce((obj, key) => {
            return obj && obj[key] !== undefined ? obj[key] : null;
          }, item);
          return value !== null && 
                 value !== undefined && 
                 String(value).toLowerCase().includes(term);
        });
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const column = columns.find(col => col.accessor === sortConfig.key);
        if (!column) return 0;
        
        // Handle nested properties with dot notation
        const getValue = (obj) => {
          return sortConfig.key.split('.').reduce((o, key) => {
            return o && o[key] !== undefined ? o[key] : null;
          }, obj);
        };
        
        let aValue = getValue(a);
        let bValue = getValue(b);
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        
        // Handle dates
        if (aValue instanceof Date || !isNaN(new Date(aValue).getTime())) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Handle numbers
        if (!isNaN(parseFloat(aValue)) && isFinite(aValue) && !isNaN(parseFloat(bValue)) && isFinite(bValue)) {
          return sortConfig.direction === 'asc' 
            ? parseFloat(aValue) - parseFloat(bValue)
            : parseFloat(bValue) - parseFloat(aValue);
        }
        
        // Default string comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        return sortConfig.direction === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }
    
    return result;
  }, [data, searchTerm, columns, sortConfig]);
  
  // Alias for backward compatibility
  const sortedData = processedData;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPageClamped = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedData = sortedData.slice(
    (currentPageClamped - 1) * pageSize,
    currentPageClamped * pageSize
  );
  
  // Reset to first page if current page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      // Reset sorting if clicking the same column twice in descending order
      setSortConfig({ key: null, direction: 'asc' });
      return;
    }
    setSortConfig({ key, direction });
  };

  // Handle page change
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle row click
  const handleRowClick = (row, e) => {
    if (onRowClick) {
      onRowClick(row, e);
    }
  };

  // Render cell content
  const renderCell = (item, column) => {
    try {
      if (column.cell) {
        return column.cell({ 
          row: { original: item },
          getValue: () => {
            // Handle nested properties with dot notation for getValue
            if (!column.accessor) return '';
            return column.accessor.split('.').reduce((obj, key) => 
              (obj && obj[key] !== undefined) ? obj[key] : '', item);
          }
        });
      }
      
      if (!column.accessor) return '';
      
      // Handle nested properties with dot notation
      const value = column.accessor.split('.').reduce((obj, key) => 
        (obj && obj[key] !== undefined) ? obj[key] : '', item);
      
      // Format dates if the value looks like a date
      if (value && typeof value === 'string' && !isNaN(Date.parse(value))) {
        try {
          return new Date(value).toLocaleString();
        } catch (e) {
          console.warn('Failed to parse date:', value, e);
        }
      }
      
      return value !== undefined && value !== null ? String(value) : '';
    } catch (error) {
      console.error('Error rendering cell:', { column, item, error });
      return '';
    }
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPageClamped - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Handle empty state
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`} {...props}>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">
            {emptyState || 'Get started by adding a new record.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`} {...props}>
      {/* Search and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        {showSearch && (
          <div className="w-full sm:w-64">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                  if (onSearch) {
                    onSearch(e.target.value);
                  }
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>
        )}
        
        {showPageSizeOptions && data.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-20"
            >
              {[5, 10, 25, 50, 100, 200].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.accessor}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                          column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                        } ${headerClassName}`}
                        onClick={() => column.sortable !== false && requestSort(column.accessor)}
                      >
                        <div className="flex items-center">
                          {column.header || column.Header || column.accessor}
                          {column.sortable !== false && renderSortIcon(column.accessor)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <p className="text-sm text-gray-500">Loading data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {emptyState || 'Try adjusting your search or filter to find what you\'re looking for.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, rowIndex) => (
                      <tr
                        key={item.id || rowIndex}
                        className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName}`}
                        onClick={(e) => handleRowClick(item, e)}
                      >
                        {columns.map((column) => (
                          <td
                            key={`${column.accessor}-${rowIndex}`}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              column.className || ''
                            } ${
                              column.numeric ? 'text-right' : 'text-left'
                            }`}
                          >
                            {renderCell(item, column)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">
              {paginatedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, processedData.length)}
            </span>{' '}
            of <span className="font-medium">{processedData.length}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1"
            >
              <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            {getPageNumbers().map((page, index) =>
              page === '...' ? (
                <span key={`dots-${index}`} className="px-3 py-1">
                  {page}
                </span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={page === currentPage ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 ${page === currentPage ? 'bg-indigo-600 text-white' : ''}`}
                >
                  {page}
                </Button>
              )
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1"
            >
              <ChevronsRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage:
/*
<DataTable
  columns={[
    {
      Header: 'Name',
      accessor: 'name',
      sortable: true,
      searchable: true,
    },
    {
      Header: 'Email',
      accessor: 'email',
      sortable: true,
      searchable: true,
    },
    {
      Header: 'Status',
      accessor: 'status',
      cell: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      ),
    },
  ]}
  data={[
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  ]}
  onRowClick={(row) => console.log('Row clicked:', row)}
  loading={false}
  pageSize={10}
  showPagination={true}
  showSearch={true}
  className="mt-4"
/>
*/
