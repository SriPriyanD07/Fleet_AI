import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { format } from 'date-fns';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

// Color palette for charts
const CHART_COLORS = {
  active: '#10B981',    // Green
  inactive: '#EF4444',  // Red
  maintenance: '#3B82F6', // Blue
  warning: '#F59E0B',   // Amber
  success: '#10B981',   // Green
  info: '#3B82F6',      // Blue
  primary: '#6366F1',   // Indigo
  secondary: '#6B7280', // Gray
};

/**
 * Bar chart showing vehicle status distribution
 */
export const VehicleStatusChart = ({ data, className = '', loading = false }) => {
  if (loading) {
    return (
      <Card className={`flex items-center justify-center h-80 ${className}`}>
        <Spinner size="lg" />
      </Card>
    );
  }

  const chartData = Object.entries(data || {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: CHART_COLORS[status] || CHART_COLORS.secondary
  }));

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Status Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              width={30}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value) => [value, 'Vehicles']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList 
                dataKey="value" 
                position="top" 
                fill="#374151"
                fontSize={12}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

/**
 * Line chart showing vehicle activity over time
 */
export const ActivityTimelineChart = ({ data, className = '', loading = false }) => {
  if (loading) {
    return (
      <Card className={`flex items-center justify-center h-80 ${className}`}>
        <Spinner size="lg" />
      </Card>
    );
  }

  // Format date for display
  const formatXAxis = (tickItem) => {
    return format(new Date(tickItem), 'MMM d');
  };

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              width={30}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="trips" 
              name="Trips"
              stroke={CHART_COLORS.primary} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="distance" 
              name="Distance (km)"
              stroke={CHART_COLORS.success} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: CHART_COLORS.success, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

/**
 * Pie chart showing vehicle type distribution
 */
export const VehicleTypeChart = ({ data, className = '', loading = false }) => {
  if (loading) {
    return (
      <Card className={`flex items-center justify-center h-80 ${className}`}>
        <Spinner size="lg" />
      </Card>
    );
  }

  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.secondary,
    CHART_COLORS.info,
  ];

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Types</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#FFFFFF"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} vehicles (${(props.payload.percent * 100).toFixed(1)}%)`,
                name
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

/**
 * Bar chart showing fuel consumption by vehicle
 */
export const FuelConsumptionChart = ({ data, className = '', loading = false }) => {
  if (loading) {
    return (
      <Card className={`flex items-center justify-center h-80 ${className}`}>
        <Spinner size="lg" />
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Fuel Consumption (Last 30 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              dataKey="name" 
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              width={100}
            />
            <Tooltip 
              formatter={(value) => [`${value} L`, 'Fuel']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Bar 
              dataKey="consumption" 
              name="Fuel (Liters)" 
              fill={CHART_COLORS.warning}
              radius={[0, 4, 4, 0]}
            >
              <LabelList 
                dataKey="consumption" 
                position="right" 
                fill="#374151"
                fontSize={12}
                offset={10}
                formatter={(value) => `${value} L`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

/**
 * Combined dashboard with multiple charts
 */
export const FleetDashboard = ({ 
  statusData, 
  activityData, 
  typeData, 
  fuelData, 
  loading = false 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VehicleStatusChart data={statusData} loading={loading} />
        <VehicleTypeChart data={typeData} loading={loading} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityTimelineChart data={activityData} loading={loading} />
        <FuelConsumptionChart data={fuelData} loading={loading} />
      </div>
    </div>
  );
};

// Example usage:
/*
const mockData = {
  statusData: {
    active: 12,
    inactive: 3,
    maintenance: 2,
    out_of_service: 1
  },
  activityData: [
    { date: '2023-01-01', trips: 4, distance: 240 },
    { date: '2023-01-02', trips: 6, distance: 320 },
    // ... more data
  ],
  typeData: [
    { name: 'Truck', value: 8 },
    { name: 'Van', value: 5 },
    { name: 'Car', value: 3 },
    { name: 'Bike', value: 2 }
  ],
  fuelData: [
    { name: 'MH01AB1234', consumption: 120 },
    { name: 'MH02CD4567', consumption: 95 },
    // ... more data
  ]
};

<FleetDashboard 
  statusData={mockData.statusData}
  activityData={mockData.activityData}
  typeData={mockData.typeData}
  fuelData={mockData.fuelData}
  loading={isLoading}
/>
*/

export default FleetCharts;
