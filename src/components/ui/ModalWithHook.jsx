import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import { useModal } from '../../hooks/useModal';

/**
 * Modal component that uses the useModal hook
 * @param {Object} props - Component props
 * @param {boolean} [props.isOpen] - Whether the modal is open (controlled)
 * @param {Function} [props.onOpenChange] - Callback when open state changes
 * @param {React.ReactNode} [props.trigger] - Element that triggers the modal
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} [props.children] - Modal content
 * @param {React.ReactNode} [props.footer] - Modal footer content
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md'] - Size of the modal
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
 * @param {boolean} [props.closeOnOverlayClick=true] - Whether clicking overlay closes modal
 * @param {boolean} [props.closeOnEscape=true] - Whether pressing Escape closes modal
 * @param {boolean} [props.lockScroll=true] - Whether to prevent body scroll
 * @param {string} [props.overlayClassName] - Additional classes for overlay
 * @param {string} [props.contentClassName] - Additional classes for content
 * @param {string} [props.className] - Additional classes for modal
 * @param {Object} [props.rest] - Additional props
 * @returns {JSX.Element} Modal component
 */
const ModalWithHook = forwardRef(({
  isOpen: isOpenProp,
  onOpenChange,
  trigger,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockScroll = true,
  overlayClassName = '',
  contentClassName = '',
  className = '',
  ...rest
}, ref) => {
  // Use the modal hook
  const {
    isOpen,
    open,
    close,
    modalRef,
    handleOverlayClick,
    getModalProps,
    getTitleProps,
    getDescriptionProps,
    getCloseButtonProps,
  } = useModal({
    initialOpen: isOpenProp,
    onOpenChange,
    closeOnOverlayClick,
    closeOnEscape,
    lockScroll,
  });

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  // Don't render anything if the modal is closed and not controlled
  if (!isOpen && !isOpenProp) {
    return trigger ? (
      <div onClick={open} style={{ display: 'inline-block' }}>
        {trigger}
      </div>
    ) : null;
  }

  return (
    <>
      {/* Trigger */}
      {trigger && (
        <div onClick={open} style={{ display: 'inline-block' }}>
          {trigger}
        </div>
      )}
      
      {/* Modal */}
      <div 
        className={cn(
          'fixed inset-0 z-50 overflow-y-auto',
          'flex items-center justify-center',
          'p-4 sm:p-6',
          overlayClassName
        )}
        onClick={handleOverlayClick}
        role="presentation"
      >
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          aria-hidden="true"
        />
        
        {/* Modal container */}
        <div 
          ref={(node) => {
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
            modalRef.current = node;
          }}
          className={cn(
            'relative w-full',
            'bg-white rounded-lg shadow-xl',
            'transform transition-all',
            'max-h-[90vh] overflow-y-auto',
            sizeClasses[size] || sizeClasses.md,
            className
          )}
          {...getModalProps(rest)}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {title && (
                <h2 
                  {...getTitleProps({
                    className: 'text-lg font-medium text-gray-900',
                  })}
                >
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  {...getCloseButtonProps({
                    className: 'text-gray-400 hover:text-gray-500',
                  })}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div 
            {...getDescriptionProps({
              className: cn('p-4 sm:p-6', contentClassName),
            })}
          >
            {typeof children === 'function' 
              ? children({ close, isOpen })
              : children
            }
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="px-4 py-3 sm:px-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              {typeof footer === 'function' 
                ? footer({ close, isOpen })
                : footer
              }
            </div>
          )}
        </div>
      </div>
    </>
  );
});

ModalWithHook.displayName = 'ModalWithHook';

export { ModalWithHook };

/**
 * Example usage:
 * 
 * // Basic usage
 * <ModalWithHook 
 *   trigger={<Button>Open Modal</Button>}
 *   title="Example Modal"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={() => console.log('Cancel')}>
 *         Cancel
 *       </Button>
 *       <Button onClick={() => console.log('Save')}>
 *         Save Changes
 *       </Button>
 *     </>
 *   }
 * >
 *   <p>Modal content goes here</p>
 * </ModalWithHook>
 * 
 * // Controlled usage
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Button onClick={() => setIsOpen(true)}>Open Controlled Modal</Button>
 * <ModalWithHook 
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Controlled Modal"
 * >
 *   {({ close }) => (
 *     <>
 *       <p>This is a controlled modal</p>
 *       <Button onClick={close}>Close</Button>
 *     </>
 *   )}
 * </ModalWithHook>
 */
