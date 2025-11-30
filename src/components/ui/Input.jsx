import React from 'react';
import { cn } from '../../utils/helpers';

const Input = React.forwardRef(({ className, type = 'text', label, error, helperText, startAdornment, endAdornment, fullWidth = false, ...props }, ref) => {
  const inputId = React.useId();
  const hasError = !!error;
  
  return (
    <div className={cn('space-y-1', fullWidth ? 'w-full' : 'w-fit')}>
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-gray-700',
            hasError ? 'text-red-600' : ''
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startAdornment}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            hasError 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
              : 'border-gray-300',
            startAdornment ? 'pl-10' : '',
            endAdornment ? 'pr-10' : '',
            className
          )}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...props}
        />
        
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      
      {hasError ? (
        <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
