import React, { useState, useEffect } from 'react';
import { FleetDashboard } from '../components/charts/FleetCharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { format, subDays } from 'date-fns';

// Generate mock data for the dashboard
const generateMockData = () => ({
  activityData: Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
    trips: Math.floor(Math.random() * 15) + 5,
    distance: Math.floor(Math.random() * 500) + 100
  })),
  typeData: [
    { name: 'Truck', value: 8 },
    { name: 'Van', value: 5 },
    { name: 'Car', value: 3 },
    { name: 'Bike', value: 2 }
  ],
  statusData: {
    active: 12,
    inactive: 3,
    maintenance: 2,
    out_of_service: 1
  },
  fuelData: [
    { name: 'MH01AB1234', consumption: Math.floor(Math.random() * 100) + 50 },
    { name: 'MH02CD4567', consumption: Math.floor(Math.random() * 100) + 50 },
    { name: 'MH03EF7890', consumption: Math.floor(Math.random() * 100) + 50 },
    { name: 'MH04GH1234', consumption: Math.floor(Math.random() * 100) + 50 },
    { name: 'MH05IJ5678', consumption: Math.floor(Math.random() * 100) + 50 },
  ].sort((a, b) => b.consumption - a.consumption)
});

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [mockData, setMockData] = useState({
    activityData: [],
    typeData: [],
    statusData: {},
    fuelData: []
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setMockData(generateMockData());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const stats = [
    {
      id: 'total',
      name: 'Total Vehicles',
      value: Object.values(mockData.statusData).reduce((a, b) => a + b, 0),
      icon: 'Truck',
      change: '12%',
      changeType: 'increase',
      bgColor: 'from-indigo-500 to-indigo-600',
      description: 'Across all categories',
      trend: 'up',
    },
    {
      id: 'active',
      name: 'Active Vehicles',
      value: mockData.statusData.active || 0,
      icon: 'CheckCircle',
      change: '5%',
      changeType: 'increase',
      bgColor: 'from-green-500 to-green-600',
      description: 'Currently in operation',
      trend: 'up',
    },
    {
      id: 'maintenance',
      name: 'In Maintenance',
      value: mockData.statusData.maintenance || 0,
      icon: 'Wrench',
      change: '2%',
      changeType: 'decrease',
      bgColor: 'from-blue-500 to-blue-600',
      description: 'Undergoing service',
      trend: 'down',
    },
    {
      id: 'out_of_service',
      name: 'Out of Service',
      value: mockData.statusData.out_of_service || 0,
      icon: 'AlertTriangle',
      change: '1%',
      changeType: 'increase',
      bgColor: 'from-red-500 to-red-600',
      description: 'Requires attention',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h1>
        <div className="mt-4 flex space-x-2 sm:mt-0">
          {['day', 'week', 'month'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <FleetDashboard 
        statusData={mockData.statusData}
        activityData={mockData.activityData}
        typeData={mockData.typeData}
        fuelData={mockData.fuelData}
        loading={loading}
      />
    </div>
  );
};

export default DashboardPage;
