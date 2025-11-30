import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing modal state and behavior
 * @param {Object} options - Modal options
 * @param {boolean} [options.initialOpen=false] - Whether the modal is initially open
 * @param {Function} [options.onOpenChange] - Callback when modal open state changes
 * @param {boolean} [options.closeOnOverlayClick=true] - Whether clicking the overlay closes the modal
 * @param {boolean} [options.closeOnEscape=true] - Whether pressing Escape closes the modal
 * @param {boolean} [options.lockScroll=true] - Whether to prevent body scroll when modal is open
 * @param {string} [options.modalId] - Unique ID for the modal (for analytics or debugging)
 * @returns {Object} Modal state and control functions
 */
export const useModal = (options = {}) => {
  const {
    initialOpen = false,
    onOpenChange,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    lockScroll = true,
    modalId,
  } = options;

  const [isOpen, setIsOpen] = useState(initialOpen);
  const modalRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Handle open/close state changes
  const setOpen = useCallback((open) => {
    setIsOpen(open);
    onOpenChange?.(open);
    
    if (open) {
      // Save the currently focused element
      lastFocusedElement.current = document.activeElement;
      
      // Lock body scroll if enabled
      if (lockScroll) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      }
      
      // Focus the modal when it opens
      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      });
    } else {
      // Restore body scroll if enabled
      if (lockScroll) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
      
      // Return focus to the element that had focus before the modal opened
      requestAnimationFrame(() => {
        if (lastFocusedElement.current) {
          lastFocusedElement.current.focus();
          lastFocusedElement.current = null;
        }
      });
    }
  }, [lockScroll, onOpenChange]);

  // Open the modal
  const open = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  // Close the modal
  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Toggle the modal open/close
  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  // Handle Escape key press
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close, closeOnEscape, isOpen]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      close();
    }
  }, [close, closeOnOverlayClick]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isOpen && lockScroll) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [isOpen, lockScroll]);

  return {
    // State
    isOpen,
    modalRef,
    modalId,
    
    // Actions
    open,
    close,
    toggle,
    setOpen,
    
    // Event handlers
    handleOverlayClick,
    
    // Props getters
    getModalProps: (props = {}) => ({
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': modalId ? `${modalId}-title` : undefined,
      'aria-describedby': modalId ? `${modalId}-description` : undefined,
      tabIndex: -1,
      ref: modalRef,
      ...props,
    }),
    
    getTitleProps: (props = {}) => ({
      id: modalId ? `${modalId}-title` : undefined,
      ...props,
    }),
    
    getDescriptionProps: (props = {}) => ({
      id: modalId ? `${modalId}-description` : undefined,
      ...props,
    }),
    
    getCloseButtonProps: (props = {}) => ({
      'aria-label': 'Close',
      onClick: close,
      ...props,
    }),
  };
};
