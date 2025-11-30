import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className = '',
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Size variants
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8 text-lg',
  };
  
  // Color variants
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus-visible:ring-blue-500',
    link: 'text-blue-600 hover:underline hover:text-blue-700 focus-visible:ring-blue-500',
  };
  
  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size] || sizeClasses['md'],
    variantClasses[variant] || variantClasses['primary'],
    fullWidthClass,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {!isLoading && StartIcon && (
        <StartIcon className="mr-2 h-4 w-4" />
      )}
      {children}
      {EndIcon && !isLoading && (
        <EndIcon className="ml-2 h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };

export const ButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`inline-flex rounded-md shadow-sm ${className}`} 
      role="group"
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          className: `
            ${child.props.className || ''}
            ${!isFirst ? 'rounded-l-none border-l-0' : ''}
            ${!isLast ? 'rounded-r-none' : ''}
            focus:z-10
          `,
        });
      })}
    </div>
  );
};
