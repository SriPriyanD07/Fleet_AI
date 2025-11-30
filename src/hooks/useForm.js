import { useState, useCallback } from 'react';

/**
 * Custom hook for handling form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form utilities
 */
const useForm = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Validate form
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    // If no validation errors, submit the form
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);

  // Set multiple field values at once
  const setValuesTo = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues,
    }));
  }, []);

  // Get field props for form inputs
  const getFieldProps = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    error: errors[name],
  });

  // Get checkbox props
  const getCheckboxProps = (name) => ({
    name,
    checked: !!values[name],
    onChange: handleChange,
  });

  return {
    // Form state
    values,
    errors,
    isSubmitting,
    
    // Form actions
    handleChange,
    handleSubmit,
    resetForm,
    
    // Field utilities
    setFieldValue,
    setFieldError,
    setValues: setValuesTo,
    
    // Helper functions
    getFieldProps,
    getCheckboxProps,
  };
};

export default useForm;
