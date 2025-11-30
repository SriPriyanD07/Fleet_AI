import React, { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import anime from 'animejs';

/**
 * AnimatedPieChart component that combines recharts with anime.js for enhanced animations
 */
const AnimatedPieChart = ({
  data,
  colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
  innerRadius = 60,
  outerRadius = 80,
  animationDuration = 1500,
  className = '',
  title = '',
  subtitle = '',
}) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (chartRef.current) {
      // Create a staggered animation for the pie slices
      anime({
        targets: chartRef.current.querySelectorAll('.recharts-pie-sector'),
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .6)',
        duration: animationDuration
      });
      
      // Animate the chart container
      anime({
        targets: chartRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 800
      });
    }
  }, [data, animationDuration]);

  return (
    <div className={`animated-pie-chart ${className}`} ref={chartRef}>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [
              `${value} (${(props.payload.percent * 100).toFixed(1)}%)`,
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
  );
};

export default AnimatedPieChart;