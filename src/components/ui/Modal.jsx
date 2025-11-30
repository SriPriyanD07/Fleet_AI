import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useClickOutside } from '../../utils/react-utils';
import { cn } from '../../utils/helpers';

/**
 * A reusable, accessible modal component
 * @param {Object} props - Component props
 * @param {boolean} [props.isOpen=false] - Whether the modal is open
 * @param {Function} [props.onClose] - Function to call when the modal is closed
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} [props.children] - Modal content
 * @param {React.ReactNode} [props.footer] - Modal footer content
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md'] - Size of the modal
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
 * @param {boolean} [props.overlayClose=true] - Whether clicking overlay should close modal
 * @param {boolean} [props.lockScroll=true] - Whether to prevent body scroll when modal is open
 * @param {string} [props.overlayClassName] - Additional classes for the overlay
 * @param {string} [props.contentClassName] - Additional classes for the content
 * @param {string} [props.className] - Additional classes for the modal
 * @param {Object} [props.rest] - Additional props
 * @returns {JSX.Element} Modal component
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  overlayClose = true,
  lockScroll = true,
  overlayClassName = '',
  contentClassName = '',
  className = '',
  ...rest
}) => {
  const modalRef = useRef();
  const lastFocusedElement = useRef(null);

  // Close modal when clicking outside
  useClickOutside(modalRef, overlayClose ? onClose : null, isOpen);

  // Handle body scroll locking
  useEffect(() => {
    if (!lockScroll) return;

    if (isOpen) {
      // Save the currently focused element
      lastFocusedElement.current = document.activeElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      
      // Focus the modal when it opens
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      return () => {
        // Restore body scroll and focus
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Return focus to the element that had focus before the modal opened
        if (lastFocusedElement.current) {
          lastFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, lockScroll]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
      
      // Trap focus inside the modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 overflow-y-auto',
        'flex items-center justify-center',
        'p-4 sm:p-6',
        overlayClassName
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        aria-hidden="true"
        onClick={overlayClose ? onClose : undefined}
      />
      
      {/* Modal container */}
      <div 
        ref={modalRef}
        className={cn(
          'relative w-full',
          'bg-white rounded-lg shadow-xl',
          'transform transition-all',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          sizeClasses[size] || sizeClasses.md,
          'max-h-[90vh] overflow-y-auto',
          className
        )}
        tabIndex="-1"
        {...rest}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 
              id="modal-title"
              className="text-lg font-medium text-gray-900"
            >
              {title}
            </h3>
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div 
          id="modal-description"
          className={cn('p-4 sm:p-6', contentClassName)}
        >
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 sm:px-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export { Modal };

/**
 * Example usage:
 * 
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
 * 
 * <Modal 
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Example Modal"
 *   size="md"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *         Cancel
 *       </Button>
 *       <Button onClick={() => {
 *         // Handle action
 *         setIsOpen(false);
 *       }}>
 *         Save Changes
 *       </Button>
 *     </>
 *   }
 * >
 *   <p className="text-gray-600">
 *     This is the modal content. You can put any React node here.
 *   </p>
 * </Modal>
 */
