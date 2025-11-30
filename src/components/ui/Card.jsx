import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Card Component
 * A flexible card container with various styling options
 */
export const Card = ({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  padding = 'default',
  rounded = 'default',
  shadow = 'default',
  border = true,
  ...props
}) => {
  // Variant styles
  const variants = {
    default: 'bg-white',
    primary: 'bg-indigo-50 border-indigo-200',
    secondary: 'bg-gray-50 border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  // Padding sizes
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    default: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Border radius
  const radius = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  // Shadow sizes
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    default: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    inner: 'shadow-inner',
  };

  // Hover effects
  const hoverEffects = hoverable
    ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
    : '';

  // Border style
  const borderStyle = border ? 'border' : 'border-0';

  return (
    <div
      className={cn(
        'overflow-hidden',
        variants[variant] || variants.default,
        paddings[padding] || paddings.default,
        radius[rounded] || radius.default,
        shadows[shadow] !== undefined ? shadows[shadow] : shadows.default,
        hoverEffects,
        borderStyle,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={cn(
      'px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg',
      'flex items-center justify-between',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

/**
 * Card Title Component
 */
export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 
    className={cn(
      'text-lg font-medium text-gray-900',
      className
    )} 
    {...props}
  >
    {children}
  </h3>
);

// Assign to Card object for dot notation usage
Card.Header = CardHeader;
Card.Title = CardTitle;

/**
 * Card Subtitle Component
 */
export const CardSubtitle = ({ children, className = '', ...props }) => (
  <p 
    className={cn(
      'text-sm text-gray-500',
      className
    )} 
    {...props}
  >
    {children}
  </p>
);

/**
 * Card Body Component
 */
export const CardBody = ({ children, className = '', padding = 'default', ...props }) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    default: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={cn(
        paddings[padding] || paddings.default,
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Content Component (alias for CardBody)
 */
export const CardContent = CardBody;

/**
 * Card Footer Component
 */
export const CardFooter = ({ 
  children, 
  className = '', 
  align = 'right',
  padding = 'default',
  ...props 
}) => {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-2',
    default: 'p-4 pt-2',
    md: 'p-6 pt-4',
    lg: 'p-8 pt-6',
  };

  return (
    <div 
      className={cn(
        'border-t border-gray-200 bg-gray-50 rounded-b-lg',
        'flex flex-wrap items-center gap-2',
        alignments[align] || alignments.right,
        paddings[padding] || paddings.default,
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// Assign to Card object for dot notation usage
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Content = CardContent;
Card.Footer = CardFooter;

// Example usage:
/*
<Card>
  <Card.Header>
    <div>
      <Card.Title>Card Title</Card.Title>
      <Card.Subtitle>Card Subtitle</Card.Subtitle>
    </div>
    <Button size="sm">Action</Button>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here...</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button>Submit</Button>
  </Card.Footer>
</Card>
*/

export default Card;
