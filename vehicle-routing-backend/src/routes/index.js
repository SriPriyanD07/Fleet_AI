const express = require('express');
const router = express.Router();
const weatherRoutes = require('./weather.routes');
const mapsRoutes = require('./maps.routes');
const { errorHandler } = require('../middleware/validation');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      weather: 'online',
      maps: 'online',
      database: 'online'
    }
  });
});

// API Routes
router.use('/weather', weatherRoutes);
router.use('/maps', mapsRoutes);

// Error handling middleware (should be last)
router.use(errorHandler);

module.exports = router;
