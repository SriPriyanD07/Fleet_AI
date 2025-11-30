import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList 
} from 'recharts';
import { format } from 'date-fns';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { Download, Calendar, User, Truck, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import AnimatedPieChart from './AnimatedPieChart';

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
 * Comprehensive Driver Report Component
 */
const DriverReport = ({ driver, className = '', onClose }) => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [isExporting, setIsExporting] = useState(false);
  
  // Ensure driver object has all required properties
  const driverData = {
    name: driver?.name || driver?.driverName || 'Unknown Driver',
    licenseNumber: driver?.licenseNumber || driver?.licenseNo || 'N/A',
    assignedVehicle: driver?.assignedVehicle || driver?.vehicleNumber || 'Not Assigned',
    city: driver?.city || 'Unknown',
    currentLocation: driver?.currentLocation || 'Unknown',
    startLocation: driver?.startLocation || driver?.city || 'Unknown',
    endLocation: driver?.endLocation || driver?.currentLocation || 'Unknown',
    stats: driver?.stats || {}
  };

  // Generate mock performance data based on driver and time range
  const generatePerformanceData = () => {
    // Base values that will be adjusted by time range
    const baseData = {
      deliveries: driverData.stats?.completedTrips || Math.floor(Math.random() * 20) + 5,
      onTimeRate: driverData.stats?.onTimeRate || Math.floor(Math.random() * 20) + 80, // 80-100%
      fuelEfficiency: (Math.random() * 2 + 7).toFixed(1), // 7-9 km/l
      customerRating: (Math.random() * 1 + 4).toFixed(1), // 4-5 stars
      totalDistance: driverData.stats?.totalDistance || Math.floor(Math.random() * 5000) + 1000,
      idleTime: Math.floor(Math.random() * 10) + 5, // 5-15%
      maintenanceIssues: Math.floor(Math.random() * 3), // 0-2 issues
      safetyScore: Math.floor(Math.random() * 10) + 90, // 90-100
    };

    // Adjust values based on time range
    const multiplier = timeRange === 'daily' ? 1 : timeRange === 'weekly' ? 7 : 30;
    
    return {
      ...baseData,
      deliveries: Math.floor(baseData.deliveries * multiplier / 30),
      totalDistance: Math.floor(baseData.totalDistance * multiplier / 30),
    };
  };

  // Generate trip history data
  const generateTripHistory = () => {
    const trips = [];
    const count = timeRange === 'daily' ? 3 : timeRange === 'weekly' ? 7 : 14;
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trips.push({
        id: `TRIP-${1000 + i}`,
        date: format(date, 'yyyy-MM-dd'),
        origin: driverData.startLocation,
        destination: driverData.endLocation,
        distance: Math.floor(Math.random() * 200) + 50,
        duration: Math.floor(Math.random() * 5) + 1,
        status: Math.random() > 0.1 ? 'completed' : 'delayed',
        fuelUsed: Math.floor(Math.random() * 30) + 10,
      });
    }
    
    return trips;
  };

  // Generate fuel efficiency data
  const generateFuelData = () => {
    const data = [];
    const count = timeRange === 'daily' ? 24 : timeRange === 'weekly' ? 7 : 12;
    const labelKey = timeRange === 'daily' ? 'hour' : timeRange === 'weekly' ? 'day' : 'month';
    
    for (let i = 0; i < count; i++) {
      let label;
      if (timeRange === 'daily') {
        label = `${i}:00`;
      } else if (timeRange === 'weekly') {
        const date = new Date();
        date.setDate(date.getDate() - i);
        label = format(date, 'EEE');
      } else {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        label = format(date, 'MMM');
      }
      
      data.push({
        [labelKey]: label,
        efficiency: parseFloat((Math.random() * 2 + 7).toFixed(1)),
      });
    }
    
    return data.reverse();
  };

  // Generate safety incidents data
  const generateSafetyData = () => {
    return [
      { name: 'Harsh Braking', value: Math.floor(Math.random() * 5) },
      { name: 'Speeding', value: Math.floor(Math.random() * 3) },
      { name: 'Rapid Acceleration', value: Math.floor(Math.random() * 4) },
      { name: 'Sharp Turns', value: Math.floor(Math.random() * 2) },
    ];
  };

  const performanceData = generatePerformanceData();
  const tripHistory = generateTripHistory();
  const fuelData = generateFuelData();
  const safetyData = generateSafetyData();

  // Handle export functionality
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create CSV content
      const csvContent = [
        // Header
        `"Driver Report: ${driverData.name}","${format(new Date(), 'yyyy-MM-dd')}","","","","",""`,
        `"Time Range: ${timeRange}","","","","","",""`,
        `"","","","","","",""`,
        // Performance metrics
        `"Performance Metrics","","","","","",""`,
        `"Deliveries","On-Time Rate","Fuel Efficiency","Customer Rating","Total Distance","Idle Time","Safety Score"`,
        `"${performanceData.deliveries}","${performanceData.onTimeRate}%","${performanceData.fuelEfficiency} km/l","${performanceData.customerRating}/5","${performanceData.totalDistance} km","${performanceData.idleTime}%","${performanceData.safetyScore}/100"`,
        `"","","","","","",""`,
        // Trip history
        `"Trip History","","","","","",""`,
        `"Date","Origin","Destination","Distance","Duration","Status","Fuel Used"`,
        ...tripHistory.map(trip => 
          `"${trip.date}","${trip.origin}","${trip.destination}","${trip.distance} km","${trip.duration} hrs","${trip.status}","${trip.fuelUsed} L"`
        ),
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `driver_report_${driverData.name.replace(/\s+/g, '_')}_${timeRange}.csv`);
      document.body.appendChild(link);
      
      // Trigger download and cleanup
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className={`driver-report ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{driverData.name}</h2>
            <p className="text-sm text-gray-500">License: {driverData.licenseNumber}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === 'daily' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === 'weekly' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
          {onClose && (
            <Button 
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Overview Card */}
        <Card className="shadow">
          <Card.Header>
            <Card.Title>Performance Overview</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Deliveries</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{performanceData.deliveries}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500">On-Time Rate</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{performanceData.onTimeRate}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Fuel Efficiency</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{performanceData.fuelEfficiency} km/l</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Customer Rating</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{performanceData.customerRating}/5</div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {performanceData.onTimeRate >= 95 ? 'Excellent' : performanceData.onTimeRate >= 90 ? 'Good' : 'Average'} on-time delivery rate</li>
                <li>• Total distance covered: {performanceData.totalDistance} km</li>
                <li>• Idle time: {performanceData.idleTime}% of total driving time</li>
                <li>• {performanceData.maintenanceIssues === 0 ? 'No maintenance issues reported' : `${performanceData.maintenanceIssues} maintenance issues reported`}</li>
              </ul>
            </div>
          </Card.Body>
        </Card>

        {/* Vehicle Information Card */}
        <Card className="shadow">
          <Card.Header>
            <Card.Title>Vehicle & Route Information</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">
                  Vehicle: {driverData.assignedVehicle}
                </h4>
                <div className="mt-1 text-sm text-gray-500">
                  Status: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Route Details</h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span>From: {driverData.startLocation}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4 mr-2 text-green-500" />
                <span>To: {driverData.endLocation}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Distance:</span> {Math.floor(Math.random() * 300) + 100} km
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Route Efficiency</h4>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Actual vs Planned</span>
                <span>{Math.floor(Math.random() * 20) + 80}%</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Fuel Efficiency Chart */}
        <Card className="shadow">
          <Card.Header>
            <Card.Title>Fuel Efficiency Trend</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={fuelData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey={timeRange === 'daily' ? 'hour' : timeRange === 'weekly' ? 'day' : 'month'} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    domain={[6, 10]}
                    tickCount={5}
                    label={{ value: 'km/l', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 } }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} km/l`, 'Efficiency']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke={CHART_COLORS.primary} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Average fuel efficiency: {performanceData.fuelEfficiency} km/l</li>
                <li>• {fuelData[fuelData.length - 1].efficiency > fuelData[0].efficiency ? 'Improving' : 'Declining'} trend over time</li>
                <li>• {Math.abs(fuelData[fuelData.length - 1].efficiency - fuelData[0].efficiency).toFixed(1)} km/l change since beginning of period</li>
              </ul>
            </div>
          </Card.Body>
        </Card>

        {/* Safety Metrics */}
        <Card className="shadow">
          <Card.Header>
            <Card.Title>Safety Metrics</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{performanceData.safetyScore}</div>
                <div className="text-sm text-gray-500">Safety Score</div>
              </div>
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={safetyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {safetyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? CHART_COLORS.warning : 
                                index === 1 ? CHART_COLORS.inactive : 
                                index === 2 ? CHART_COLORS.info : 
                                CHART_COLORS.secondary} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-2">
              {safetyData.map((item, index) => (
                <div key={item.name ?? `safety-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ 
                        backgroundColor: index === 0 ? CHART_COLORS.warning : 
                                        index === 1 ? CHART_COLORS.inactive : 
                                        index === 2 ? CHART_COLORS.info : 
                                        CHART_COLORS.secondary 
                      }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value} incidents</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {performanceData.safetyScore >= 95 ? 'Excellent' : performanceData.safetyScore >= 90 ? 'Good' : 'Average'} overall safety score</li>
                <li>• Total incidents: {safetyData.reduce((sum, item) => sum + item.value, 0)}</li>
                <li>• Most common incident: {safetyData.reduce((max, item) => max.value > item.value ? max : item, { value: 0 }).name}</li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Trip History Table */}
      <Card className="shadow mt-6">
        <Card.Header>
          <Card.Title>Trip History</Card.Title>
        </Card.Header>
        <Card.Body padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Used</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tripHistory.map((trip, index) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trip.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.origin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.distance} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.duration} hrs</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trip.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {trip.status === 'completed' ? 'Completed' : 'Delayed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.fuelUsed} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DriverReport;