import React, { useState, useEffect } from 'react';
import { Activity, BarChart2, TrendingUp, Calendar, Download, Filter, Truck, Users, Droplet, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import VehicleStatusChart from '../components/dashboard/VehicleStatusChart';
import { VehicleStatusReport } from '../components/reports/VehicleStatusReport';
import AnimatedPieChart from '../components/reports/AnimatedPieChart';

// Sample data for reports
const reportData = {
  fleetUtilization: {
    daily: [
      { date: '2023-07-01', utilization: 78 },
      { date: '2023-07-02', utilization: 82 },
      { date: '2023-07-03', utilization: 76 },
      { date: '2023-07-04', utilization: 84 },
      { date: '2023-07-05', utilization: 90 },
      { date: '2023-07-06', utilization: 88 },
      { date: '2023-07-07', utilization: 85 },
    ],
    weekly: [
      { week: 'Week 1', utilization: 80 },
      { week: 'Week 2', utilization: 82 },
      { week: 'Week 3', utilization: 85 },
      { week: 'Week 4', utilization: 79 },
    ],
    monthly: [
      { month: 'Jan', utilization: 75 },
      { month: 'Feb', utilization: 78 },
      { month: 'Mar', utilization: 80 },
      { month: 'Apr', utilization: 82 },
      { month: 'May', utilization: 85 },
      { month: 'Jun', utilization: 83 },
      { month: 'Jul', utilization: 87 },
    ]
  },
  fuelConsumption: {
    daily: [
      { date: '2023-07-01', consumption: 450 },
      { date: '2023-07-02', consumption: 420 },
      { date: '2023-07-03', consumption: 480 },
      { date: '2023-07-04', consumption: 460 },
      { date: '2023-07-05', consumption: 500 },
      { date: '2023-07-06', consumption: 470 },
      { date: '2023-07-07', consumption: 490 },
    ],
    weekly: [
      { week: 'Week 1', consumption: 3200 },
      { week: 'Week 2', consumption: 3100 },
      { week: 'Week 3', consumption: 3300 },
      { week: 'Week 4', consumption: 3150 },
    ],
    monthly: [
      { month: 'Jan', consumption: 13500 },
      { month: 'Feb', consumption: 12800 },
      { month: 'Mar', consumption: 13200 },
      { month: 'Apr', consumption: 13800 },
      { month: 'May', consumption: 14200 },
      { month: 'Jun', consumption: 13900 },
      { month: 'Jul', consumption: 14500 },
    ]
  },
  driverPerformance: [
    { id: 1, name: 'Rajesh Yadav', tripsCompleted: 45, onTimeDelivery: 95, fuelEfficiency: 8.5, customerRating: 4.8 },
    { id: 2, name: 'Sunil Shinde', tripsCompleted: 42, onTimeDelivery: 92, fuelEfficiency: 8.2, customerRating: 4.7 },
    { id: 3, name: 'Ajay Kumar', tripsCompleted: 38, onTimeDelivery: 97, fuelEfficiency: 8.7, customerRating: 4.9 },
    { id: 4, name: 'Ramesh Kumar', tripsCompleted: 40, onTimeDelivery: 90, fuelEfficiency: 7.9, customerRating: 4.5 },
    { id: 5, name: 'Pratik Sarkar', tripsCompleted: 36, onTimeDelivery: 94, fuelEfficiency: 8.4, customerRating: 4.6 },
  ],
  vehicleStatus: {
    active: 12,
    inactive: 3,
    maintenance: 2,
    out_of_service: 1
  },
  maintenanceCosts: [
    { month: 'Jan', scheduled: 25000, unscheduled: 8000 },
    { month: 'Feb', scheduled: 22000, unscheduled: 12000 },
    { month: 'Mar', scheduled: 28000, unscheduled: 5000 },
    { month: 'Apr', scheduled: 24000, unscheduled: 7000 },
    { month: 'May', scheduled: 26000, unscheduled: 9000 },
    { month: 'Jun', scheduled: 23000, unscheduled: 11000 },
    { month: 'Jul', scheduled: 27000, unscheduled: 6000 },
  ],
  deliveryPerformance: {
    onTime: 92,
    delayed: 6,
    failed: 2
  },
  routeEfficiency: [
    { route: 'Mumbai-Pune', plannedDistance: 150, actualDistance: 162, efficiency: 93 },
    { route: 'Bangalore-Chennai', plannedDistance: 350, actualDistance: 365, efficiency: 96 },
    { route: 'Delhi-Jaipur', plannedDistance: 280, actualDistance: 285, efficiency: 98 },
    { route: 'Kolkata-Siliguri', plannedDistance: 570, actualDistance: 600, efficiency: 95 },
    { route: 'Hyderabad-Vijayawada', plannedDistance: 300, actualDistance: 310, efficiency: 97 },
  ]
};

// Sample report types
const reportTypes = [
  { id: 'fleet-utilization', name: 'Fleet Utilization', icon: Truck },
  { id: 'fuel-consumption', name: 'Fuel Consumption', icon: Droplet },
  { id: 'driver-performance', name: 'Driver Performance', icon: Users },
  { id: 'vehicle-status', name: 'Vehicle Status', icon: Activity },
  { id: 'maintenance-costs', name: 'Maintenance Costs', icon: BarChart2 },
  { id: 'delivery-performance', name: 'Delivery Performance', icon: TrendingUp },
  { id: 'route-efficiency', name: 'Route Efficiency', icon: MapPin },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [selectedReport, setSelectedReport] = useState('fleet-utilization');
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Function to handle export of reports
  const handleExport = () => {
    // Get the current report data based on selectedReport
    let exportData;
    let fileName;
    
    switch (selectedReport) {
      case 'fleet-utilization':
        exportData = reportData.fleetUtilization[timeRange];
        fileName = `fleet_utilization_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'fuel-consumption':
        exportData = reportData.fuelConsumption[timeRange];
        fileName = `fuel_consumption_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'driver-performance':
        exportData = reportData.driverPerformance;
        fileName = `driver_performance_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'vehicle-status':
        exportData = reportData.vehicleStatus;
        fileName = `vehicle_status_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'maintenance-costs':
        exportData = reportData.maintenanceCosts;
        fileName = `maintenance_costs_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'delivery-performance':
        exportData = reportData.deliveryPerformance;
        fileName = `delivery_performance_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'route-efficiency':
        exportData = reportData.routeEfficiency;
        fileName = `route_efficiency_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      default:
        alert('No report selected for export');
        return;
    }
    
    // Convert data to CSV format
    let csvContent;
    
    if (Array.isArray(exportData)) {
      // Handle array data
      const headers = Object.keys(exportData[0]).join(',');
      const rows = exportData.map(item => Object.values(item).join(','));
      csvContent = [headers, ...rows].join('\n');
    } else {
      // Handle object data
      const headers = Object.keys(exportData).join(',');
      const values = Object.values(exportData).join(',');
      csvContent = [headers, values].join('\n');
    }
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Report exported as ${fileName}`);
  };

  // Function to render the selected report
  const renderReport = () => {
    switch (selectedReport) {
      case 'fleet-utilization':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Fleet Utilization</h3>
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
              </div>
            </div>
            <div className="h-80">
              <AnimatedPieChart 
                data={[
                  { name: 'Utilized', value: timeRange === 'daily' ? 83 : timeRange === 'weekly' ? 82 : 81, color: '#3B82F6' },
                  { name: 'Unutilized', value: timeRange === 'daily' ? 17 : timeRange === 'weekly' ? 18 : 19, color: '#E5E7EB' }
                ]}
                title={`Fleet Utilization (${timeRange})`}
                subtitle={`Average Utilization: ${timeRange === 'daily' ? '83%' : timeRange === 'weekly' ? '82%' : '81%'}`}
                innerRadius={60}
                outerRadius={100}
              />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fleet utilization has increased by 5% compared to last {timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month'}</li>
                <li>• Highest utilization was on {timeRange === 'daily' ? 'July 5th (90%)' : timeRange === 'weekly' ? 'Week 3 (85%)' : 'July (87%)'}</li>
                <li>• 3 vehicles have been consistently underutilized</li>
                <li>• Recommended action: Reassign routes for underutilized vehicles</li>
              </ul>
            </div>
          </div>
        );
      case 'vehicle-status':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Vehicle Status Distribution</h3>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedReport(true)}
              >
                View Detailed Report
              </Button>
            </div>
            <div className="h-80">
              <VehicleStatusChart data={reportData.vehicleStatus} />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 67% of the fleet is currently active</li>
                <li>• 2 vehicles require immediate maintenance attention</li>
                <li>• 1 vehicle has been out of service for more than 7 days</li>
                <li>• Recommended action: Schedule maintenance for vehicles with warning indicators</li>
              </ul>
            </div>
          </div>
        );
      case 'fuel-consumption':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Fuel Consumption</h3>
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
              </div>
            </div>
            <div className="h-80">
              <AnimatedPieChart 
                data={[
                  { name: 'City Driving', value: timeRange === 'daily' ? 1800 : timeRange === 'weekly' ? 7000 : 52000, color: '#3B82F6' },
                  { name: 'Highway', value: timeRange === 'daily' ? 1200 : timeRange === 'weekly' ? 4500 : 35000, color: '#10B981' },
                  { name: 'Idling', value: timeRange === 'daily' ? 270 : timeRange === 'weekly' ? 1250 : 8900, color: '#F59E0B' }
                ]}
                title={`Fuel Consumption (${timeRange})`}
                subtitle={`Total: ${timeRange === 'daily' ? '3,270' : timeRange === 'weekly' ? '12,750' : '95,900'} liters`}
              />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Average fuel efficiency: 8.3 km/liter</li>
                <li>• 3 vehicles are showing below-average fuel efficiency</li>
                <li>• Fuel consumption has decreased by 2% compared to last {timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month'}</li>
                <li>• Recommended action: Schedule maintenance for vehicles with poor fuel efficiency</li>
              </ul>
            </div>
          </div>
        );
      case 'driver-performance':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Driver Performance</h3>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleExport()}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time Delivery (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Efficiency (km/l)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Rating</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.driverPerformance.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.tripsCompleted}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${driver.onTimeDelivery >= 95 ? 'bg-green-100 text-green-800' : driver.onTimeDelivery >= 90 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {driver.onTimeDelivery}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.fuelEfficiency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className={`mr-2 ${driver.customerRating >= 4.5 ? 'text-green-600' : driver.customerRating >= 4.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {driver.customerRating}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-4 w-4 ${i < Math.floor(driver.customerRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Average on-time delivery rate: 93.6%</li>
                <li>• Top performer: Ajay Kumar (97% on-time delivery)</li>
                <li>• Areas for improvement: Fuel efficiency training for drivers below 8.0 km/l</li>
                <li>• Recommended action: Recognize top performers and provide additional training for others</li>
              </ul>
            </div>
          </div>
        );
      case 'maintenance-costs':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Maintenance Costs</h3>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleExport()}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="h-80">
              <AnimatedPieChart 
                data={[
                  { name: 'Scheduled', value: reportData.maintenanceCosts.reduce((sum, item) => sum + item.scheduled, 0), color: '#3B82F6' },
                  { name: 'Unscheduled', value: reportData.maintenanceCosts.reduce((sum, item) => sum + item.unscheduled, 0), color: '#F59E0B' }
                ]}
                title="Maintenance Cost Distribution"
                subtitle={`Total: ₹${reportData.maintenanceCosts.reduce((sum, item) => sum + item.scheduled + item.unscheduled, 0).toLocaleString()}`}
              />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Scheduled maintenance costs: ₹{reportData.maintenanceCosts.reduce((sum, item) => sum + item.scheduled, 0).toLocaleString()}</li>
                <li>• Unscheduled maintenance costs: ₹{reportData.maintenanceCosts.reduce((sum, item) => sum + item.unscheduled, 0).toLocaleString()}</li>
                <li>• Highest maintenance month: {reportData.maintenanceCosts.reduce((max, item) => (item.scheduled + item.unscheduled > max.total ? { month: item.month, total: item.scheduled + item.unscheduled } : max), { month: '', total: 0 }).month}</li>
                <li>• Recommended action: Increase preventive maintenance to reduce unscheduled repairs</li>
              </ul>
            </div>
          </div>
        );
      case 'delivery-performance':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Delivery Performance</h3>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleExport()}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="h-80">
              <AnimatedPieChart 
                data={[
                  { name: 'On Time', value: reportData.deliveryPerformance.onTime, color: '#10B981' },
                  { name: 'Delayed', value: reportData.deliveryPerformance.delayed, color: '#F59E0B' },
                  { name: 'Failed', value: reportData.deliveryPerformance.failed, color: '#EF4444' }
                ]}
                title="Delivery Status Distribution"
                subtitle="Percentage of deliveries by status"
              />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• On-time deliveries: {reportData.deliveryPerformance.onTime}%</li>
                <li>• Delayed deliveries: {reportData.deliveryPerformance.delayed}%</li>
                <li>• Failed deliveries: {reportData.deliveryPerformance.failed}%</li>
                <li>• Recommended action: Optimize routes for frequently delayed deliveries</li>
              </ul>
            </div>
          </div>
        );
      case 'route-efficiency':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Route Efficiency</h3>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleExport()}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <AnimatedPieChart 
                  data={reportData.routeEfficiency.map(route => ({
                    name: route.route,
                    value: route.efficiency,
                    color: route.efficiency >= 95 ? '#10B981' : route.efficiency >= 90 ? '#F59E0B' : '#EF4444'
                  }))}
                  title="Route Efficiency Comparison"
                  subtitle="Efficiency percentage by route"
                  innerRadius={50}
                  outerRadius={90}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned (km)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual (km)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.routeEfficiency.map((route, index) => (
                      <tr key={route.id ?? route.route ?? `route-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.route}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.plannedDistance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.actualDistance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${route.efficiency >= 95 ? 'bg-green-100 text-green-800' : route.efficiency >= 90 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {route.efficiency}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Average route efficiency: {Math.round(reportData.routeEfficiency.reduce((sum, route) => sum + route.efficiency, 0) / reportData.routeEfficiency.length)}%</li>
                <li>• Most efficient route: {reportData.routeEfficiency.reduce((max, route) => route.efficiency > max.efficiency ? route : max, { route: '', efficiency: 0 }).route}</li>
                <li>• Least efficient route: {reportData.routeEfficiency.reduce((min, route) => route.efficiency < min.efficiency ? route : min, { route: '', efficiency: 100 }).route}</li>
                <li>• Recommended action: Optimize routes with efficiency below 95%</li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Select a report type from the sidebar</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View detailed reports and insights about your fleet</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => setShowDatePicker(prev => !prev)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium">Select Date Range</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDatePicker(false)}
                  >
                    ✕
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full border rounded p-2 text-sm"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                    <input 
                      type="date" 
                      className="w-full border rounded p-2 text-sm"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Apply date filter logic here
                    setShowDatePicker(false);
                    alert(`Date range applied: ${dateRange.startDate} to ${dateRange.endDate}`);
                  }}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => handleExport()}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Report Types Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Types</h3>
            <div className="space-y-2">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${selectedReport === report.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <report.icon className="h-5 w-5 mr-3" />
                  <span>{report.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:w-3/4">
          {renderReport()}
        </div>
      </div>

      {/* Detailed Vehicle Status Report Modal */}
      {showDetailedReport && (
        <VehicleStatusReport onClose={() => setShowDetailedReport(false)} />
      )}
    </div>
  );
};

export default Reports;