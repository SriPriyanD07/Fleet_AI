import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTable } from '../DataTable';

// Mock data for testing
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
];

const mockColumns = [
  { Header: 'Name', accessor: 'name', sortable: true },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Status',
    accessor: 'status',
    cell: (item) => (
      <span className={`status-${item.status}`}>
        {item.status}
      </span>
    ),
  },
];

describe('DataTable', () => {
  test('renders table with data', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    
    // Check if table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check if data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  test('sorts data when column header is clicked', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    
    // Click on the sortable column header
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    // Get all name cells
    const nameCells = screen.getAllByRole('cell', { name: /John Doe|Jane Smith|Bob Johnson/ });
    
    // Check if data is sorted in ascending order
    expect(nameCells[0]).toHaveTextContent('Bob Johnson');
    expect(nameCells[1]).toHaveTextContent('Jane Smith');
    expect(nameCells[2]).toHaveTextContent('John Doe');
    
    // Click again to sort in descending order
    fireEvent.click(nameHeader);
    const updatedNameCells = screen.getAllByRole('cell', { name: /John Doe|Jane Smith|Bob Johnson/ });
    
    // Check if data is sorted in descending order
    expect(updatedNameCells[0]).toHaveTextContent('John Doe');
    expect(updatedNameCells[1]).toHaveTextContent('Jane Smith');
    expect(updatedNameCells[2]).toHaveTextContent('Bob Johnson');
  });

  test('filters data when search term is entered', () => {
    render(<DataTable columns={mockColumns} data={mockData} showSearch={true} />);
    
    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'jane' } });
    
    // Check if only matching row is shown
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  test('paginates data when page size is changed', () => {
    const longData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 2 === 0 ? 'active' : 'inactive',
    }));
    
    render(
      <DataTable 
        columns={mockColumns} 
        data={longData} 
        pageSize={5}
        showPagination={true}
      />
    );
    
    // Check if only first page is shown
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 5')).toBeInTheDocument();
    expect(screen.queryByText('User 6')).not.toBeInTheDocument();
    
    // Go to next page
    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);
    
    // Check if second page is shown
    expect(screen.queryByText('User 5')).not.toBeInTheDocument();
    expect(screen.getByText('User 6')).toBeInTheDocument();
  });

  test('calls onRowClick when a row is clicked', () => {
    const handleRowClick = jest.fn();
    
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        onRowClick={handleRowClick}
      />
    );
    
    // Click on first row
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow);
    
    // Check if handler was called with correct data
    expect(handleRowClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
      }),
      expect.anything()
    );
  });

  test('shows loading state when loading prop is true', () => {
    render(<DataTable columns={mockColumns} data={[]} loading={true} />);
    
    // Check if loading spinner is shown
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('shows empty state when no data is available', () => {
    render(<DataTable columns={mockColumns} data={[]} />);
    
    // Check if empty state is shown
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('shows custom empty state when provided', () => {
    const customEmptyState = (
      <div className="custom-empty">No records found</div>
    );
    
    render(
      <DataTable 
        columns={mockColumns} 
        data={[]} 
        emptyState={customEmptyState} 
      />
    );
    
    // Check if custom empty state is shown
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });
});
