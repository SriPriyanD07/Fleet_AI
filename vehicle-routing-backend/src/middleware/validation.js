const { validationResult } = require('express-validator');

/**
 * Middleware to validate location parameters
 */
const validateLocation = (req, res, next) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ 
      error: 'Latitude and longitude are required' 
    });
  }
  
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  
  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).json({ 
      error: 'Latitude and longitude must be valid numbers' 
    });
  }
  
  if (latNum < -90 || latNum > 90) {
    return res.status(400).json({ 
      error: 'Latitude must be between -90 and 90 degrees' 
    });
  }
  
  if (lonNum < -180 || lonNum > 180) {
    return res.status(400).json({ 
      error: 'Longitude must be between -180 and 180 degrees' 
    });
  }
  
  req.location = { lat: latNum, lng: lonNum };
  next();
};

/**
 * Validates the request using express-validator
 */
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ 
      errors: errors.array() 
    });
  };
};

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or missing token'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = {
  validateLocation,
  validate,
  errorHandler
};
