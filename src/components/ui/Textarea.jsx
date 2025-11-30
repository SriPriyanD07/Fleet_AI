import React from 'react';
import { cn } from '../../utils/cn';

const Textarea = React.forwardRef(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = React.useId();
    const hasError = !!error;
    
    return (
      <div className={cn('space-y-1', fullWidth ? 'w-full' : 'w-fit')}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium text-gray-700',
              hasError ? 'text-red-600' : ''
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            className={cn(
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
              hasError 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                : 'border-gray-300',
              className
            )}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
            }
            {...props}
          />
        </div>
        
        {hasError ? (
          <p 
            id={`${textareaId}-error`} 
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </p>
        ) : helperText ? (
          <p 
            id={`${textareaId}-helper`} 
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
