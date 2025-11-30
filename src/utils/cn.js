/**
 * Utility function to conditionally join class names together
 * @param {...any} classes - Class names to join
 * @returns {string} Joined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Creates a class name string from an object of class names and conditions
 * @param {Object} classes - Object where keys are class names and values are conditions
 * @returns {string} Joined class names where conditions are true
 */
export function classNames(classes) {
  return Object.entries(classes)
    .filter(([_, condition]) => Boolean(condition))
    .map(([className]) => className)
    .join(' ');
}

/**
 * Creates a variant function that generates class names based on variants
 * @param {Object} config - Configuration object with base, variants, and defaults
 * @returns {Function} Function that generates class names based on props
 */
export function createVariant(config) {
  const { base = '', variants = {}, defaultVariants = {} } = config;
  
  return (props = {}) => {
    const variantKeys = Object.keys(variants);
    const variantClasses = [];
    
    // Add base classes
    if (base) {
      variantClasses.push(base);
    }
    
    // Add variant classes
    variantKeys.forEach((key) => {
      const variantValue = props[key] ?? defaultVariants[key];
      if (variantValue !== undefined && variants[key]?.[variantValue]) {
        variantClasses.push(variants[key][variantValue]);
      }
    });
    
    // Add additional classes from props
    if (props.className) {
      variantClasses.push(props.className);
    }
    
    return variantClasses.join(' ');
  };
}

/**
 * Creates a compound variant function that handles more complex class combinations
 * @param {Object} config - Configuration object with base, variants, and compound variants
 * @returns {Function} Function that generates class names based on props
 */
export function createCompoundVariant(config) {
  const { base = '', variants = {}, compoundVariants = [] } = config;
  
  return (props = {}) => {
    const variantClasses = [];
    
    // Add base classes
    if (base) {
      variantClasses.push(base);
    }
    
    // Add variant classes
    Object.entries(variants).forEach(([key, variant]) => {
      const variantValue = props[key];
      if (variantValue !== undefined && variant[variantValue]) {
        variantClasses.push(variant[variantValue]);
      }
    });
    
    // Add compound variant classes
    compoundVariants.forEach(({ class: className, ...conditions }) => {
      const matches = Object.entries(conditions).every(([key, value]) => {
        if (Array.isArray(value)) {
          return value.includes(props[key]);
        }
        return props[key] === value;
      });
      
      if (matches && className) {
        variantClasses.push(className);
      }
    });
    
    // Add additional classes from props
    if (props.className) {
      variantClasses.push(props.className);
    }
    
    return variantClasses.join(' ');
  };
}

// Export all utilities
export default {
  cn,
  classNames,
  createVariant,
  createCompoundVariant,
};
