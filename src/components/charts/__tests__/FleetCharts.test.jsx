    import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  VehicleStatusChart, 
  ActivityTimelineChart, 
  VehicleTypeChart, 
  FuelConsumptionChart 
} from '../FleetCharts';

// Mock data for tests
const mockStatusData = {
  active: 12,
  inactive: 3,
  maintenance: 2,
  out_of_service: 1
};

const mockActivityData = [
  { date: '2023-06-01', trips: 5, distance: 240 },
  { date: '2023-06-02', trips: 8, distance: 320 },
  { date: '2023-06-03', trips: 6, distance: 280 }
];

const mockTypeData = [
  { name: 'Truck', value: 8 },
  { name: 'Van', value: 5 },
  { name: 'Car', value: 3 }
];

const mockFuelData = [
  { name: 'MH01AB1234', consumption: 120 },
  { name: 'MH02CD4567',  consumption: 95 },
  { name: 'MH03EF7890',  consumption: 110 }
];

describe('FleetCharts Components', () => {
  describe('VehicleStatusChart', () => {
    it('renders loading state', () => {
      render(<VehicleStatusChart loading={true} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders chart with data', () => {
      render(<VehicleStatusChart data={mockStatusData} />);
      
      // Check if chart title is rendered
      expect(screen.getByText('Vehicle Status Distribution')).toBeInTheDocument();
      
      // Check if all statuses are rendered
      Object.keys(mockStatusData).forEach(status => {
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
        expect(screen.getByText(formattedStatus)).toBeInTheDocument();
      });
    });
  });

  describe('ActivityTimelineChart', () => {
    it('renders loading state', () => {
      render(<ActivityTimelineChart loading={true} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders chart with data', () => {
      render(<ActivityTimelineChart data={mockActivityData} />);
      
      expect(screen.getByText('Activity Timeline')).toBeInTheDocument();
      expect(screen.getByText('Trips')).toBeInTheDocument();
      expect(screen.getByText('Distance (km)')).toBeInTheDocument();
    });
  });

  describe('VehicleTypeChart', () => {
    it('renders loading state', () => {
      render(<VehicleTypeChart loading={true} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders chart with data', () => {
      render(<VehicleTypeChart data={mockTypeData} />);
      
      expect(screen.getByText('Vehicle Types')).toBeInTheDocument();
      
      // Check if all vehicle types are rendered
      mockTypeData.forEach(type => {
        expect(screen.getByText(type.name)).toBeInTheDocument();
      });
    });
  });

  describe('FuelConsumptionChart', () => {
    it('renders loading state', () => {
      render(<FuelConsumptionChart loading={true} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders chart with data', () => {
      render(<FuelConsumptionChart data={mockFuelData} />);
      
      expect(screen.getByText('Fuel Consumption (Last 30 Days)')).toBeInTheDocument();
      
      // Check if all vehicle IDs are rendered
      mockFuelData.forEach(vehicle => {
        expect(screen.getByText(vehicle.name)).toBeInTheDocument();
      });
    });
  });

  // Test error handling
  it('handles empty data gracefully', () => {
    const { container } = render(<VehicleStatusChart data={{}} />);
    expect(container).toBeInTheDocument();
  });
});
