import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Truck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const COLORS = {
  active: '#10B981',    // Green
  inactive: '#9CA3AF',  // Gray
  maintenance: '#F59E0B', // Yellow
  warning: '#F97316',   // Orange
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{payload[0].value} vehicles</p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props) => {
  const { payload } = props;
  
  const getIcon = (entry) => {
    switch(entry.value.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'maintenance':
        return <Truck className="h-4 w-4 text-yellow-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center text-xs">
          <span className="mr-1">{getIcon(entry)}</span>
          <span className="text-gray-600">{entry.value}</span>
          <span className="ml-1 font-medium text-gray-900">{entry.payload.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function VehicleStatusChart({ vehicles = [], data: externalData }) {
  // Process vehicle data for the chart
  const getStatusCounts = () => {
    // If external data is provided, use it
    if (externalData) {
      return Object.entries(externalData).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[name.toLowerCase()] || COLORS.inactive,
      }));
    }
    
    // Otherwise process from vehicles array
    const counts = {
      active: 0,
      inactive: 0,
      maintenance: 0,
      warning: 0,
    };

    vehicles.forEach(vehicle => {
      const status = vehicle.status?.toLowerCase() || 'inactive';
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      } else {
        counts.inactive++;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name] || COLORS.inactive,
    }));
  };

  const data = getStatusCounts();
  const totalVehicles = vehicles.length || 1; // Prevent division by zero

  return (
    <div className="h-64">
      {(vehicles.length > 0 || externalData) ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* 3D Effect Shadow Pie - Rendered first as background */}
            <Pie
              data={data}
              cx="50%"
              cy="53%" // Slightly lower to create shadow effect
              labelLine={false}
              outerRadius={70}
              innerRadius={0}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1000}
              animationBegin={0}
              animationEasing="ease-out"
              blendStroke
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`shadow-cell-${index}`} 
                  fill={`${entry.color}33`} // Semi-transparent version for shadow
                  stroke="none" 
                />
              ))}
            </Pie>
            
            {/* Main 3D Pie */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={70}
              innerRadius={0}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1000}
              animationBegin={0}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="#fff" 
                  strokeWidth={1.5} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Truck className="h-10 w-10 mb-2 text-gray-300" />
          <p className="text-sm">No vehicle data available</p>
        </div>
      )}
    </div>
  );
}
