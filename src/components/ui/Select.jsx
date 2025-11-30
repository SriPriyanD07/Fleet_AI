import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Select = forwardRef(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      options = [],
      placeholder = 'Select an option',
      ...props
    },
    ref
  ) => {
    const selectId = React.useId();
    const hasError = !!error;

    return (
      <div className={cn('space-y-1', fullWidth ? 'w-full' : 'w-fit')}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'block text-sm font-medium text-gray-700',
              hasError ? 'text-red-600' : ''
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm',
              hasError
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
              'appearance-none bg-white',
              className
            )}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${selectId}-error` : undefined}
            {...props}
          >
            <option value="" disabled={props.required}>
              {placeholder}
            </option>
            {options.map((option) => {
              if (typeof option === 'string') {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              }
              return (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {hasError ? (
          <p className="mt-1 text-sm text-red-600" id={`${selectId}-error`}>
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Example usage:
/*
<Select
  label="Select an option"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ]}
  placeholder="Choose an option"
  className="w-64"
  error={errors.option ? 'This field is required' : undefined}
  {...register('option', { required: true })}
/>
*/
