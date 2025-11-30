export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className={`inline-block ${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-solid border-blue-500 border-t-transparent ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
