import React from 'react';

/**
 * Spinner Component
 * A customizable loading spinner with different sizes and colors
 */
export const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-3 w-3 border-[2px]',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
    xl: 'h-12 w-12 border-4',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-t-indigo-600',
    secondary: 'border-t-gray-600',
    success: 'border-t-green-600',
    danger: 'border-t-red-600',
    warning: 'border-t-yellow-500',
    info: 'border-t-blue-500',
    light: 'border-t-gray-200',
    dark: 'border-t-gray-800',
  };

  return (
    <div 
      className={`
        inline-block 
        ${sizeClasses[size] || sizeClasses['md']} 
        ${colorClasses[color] || colorClasses['primary']} 
        border-solid 
        rounded-full 
        animate-spin 
        ${className}
      `}
      style={{
        borderColor: 'currentColor',
        borderTopColor: 'transparent',
      }}
      role="status"
      aria-label="Loading..."
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Example usage:
/*
<Spinner size="lg" color="primary" className="mx-auto my-4" />
*/

// Spinner with text
Spinner.WithText = ({
  text = 'Loading...',
  textClassName = 'text-gray-600',
  className = '',
  ...props
}) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Spinner {...props} />
    <span className={textClassName}>{text}</span>
  </div>
);

// Full page spinner
Spinner.FullPage = ({ className = '', ...props }) => (
  <div className={`fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50 ${className}`}>
    <Spinner size="xl" {...props} />
  </div>
);

export default Spinner;
