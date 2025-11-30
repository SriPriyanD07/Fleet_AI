import React, { useState } from 'react';
import { ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { DetailedStatReport } from '../reports/DetailedStatReport';

const StatCard = ({ stat }) => {
  const [showReport, setShowReport] = useState(false);
  
  const { 
    name, 
    value, 
    icon: Icon, 
    change, 
    changeType, 
    bgColor, 
    description,
    trend 
  } = stat;

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    } else if (trend === 'down') {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <>
      <div className={`bg-gradient-to-br ${bgColor} rounded-xl shadow-lg overflow-hidden text-white`}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">{name}</p>
              <p className="mt-1 text-3xl font-bold">{value}</p>
              {description && (
                <p className="mt-1 text-sm text-white/70">{description}</p>
              )}
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {(change || trend) && (
            <div className="mt-4 flex items-center">
              <div className="flex items-center px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium">
                {getTrendIcon()}
                <span className="ml-1">{change}</span>
              </div>
              <span className="ml-2 text-xs text-white/70">vs last period</span>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => setShowReport(true)}
            className="w-full text-center py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            View detailed report
          </button>
        </div>
      </div>

      {showReport && (
        <DetailedStatReport 
          stat={stat}
          onClose={() => setShowReport(false)} 
        />
      )}
    </>
  );
};

export default StatCard;
