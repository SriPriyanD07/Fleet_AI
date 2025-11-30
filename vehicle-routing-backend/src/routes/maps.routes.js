const express = require('express');
const router = express.Router();
const mapsService = require('../services/maps.service');
const { validateLocation } = require('../middleware/validation');

/**
 * @swagger
 * /api/maps/geocode:
 *   get:
 *     summary: Convert address to coordinates
 *     tags: [Maps]
 *     parameters:
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Address to geocode
 *     responses:
 *       200:
 *         description: Geocoding result
 */
router.get('/geocode', async (req, res, next) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    const result = await mapsService.geocodeAddress(address);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/maps/directions:
 *   get:
 *     summary: Get directions between points
 *     tags: [Maps]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         required: true
 *         description: Starting point (address or lat,lng)
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         required: true
 *         description: Destination point (address or lat,lng)
 *       - in: query
 *         name: waypoints
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of waypoints (address or lat,lng)
 *     responses:
 *       200:
 *         description: Directions result
 */
router.get('/directions', async (req, res, next) => {
  try {
    const { origin, destination, waypoints } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }
    
    const waypointsArray = waypoints ? waypoints.split('|') : [];
    const result = await mapsService.getDirections(origin, destination, waypointsArray);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/maps/distance-matrix:
 *   get:
 *     summary: Get distance and duration between multiple points
 *     tags: [Maps]
 *     parameters:
 *       - in: query
 *         name: origins
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: Array of origin points (address or lat,lng)
 *       - in: query
 *         name: destinations
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: Array of destination points (address or lat,lng)
 *     responses:
 *       200:
 *         description: Distance matrix result
 */
router.get('/distance-matrix', async (req, res, next) => {
  try {
    const { origins, destinations } = req.query;
    if (!origins || !destinations) {
      return res.status(400).json({ 
        error: 'Origins and destinations are required' 
      });
    }
    
    const originsArray = Array.isArray(origins) ? origins : [origins];
    const destinationsArray = Array.isArray(destinations) ? destinations : [destinations];
    
    const result = await mapsService.getDistanceMatrix(originsArray, destinationsArray);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
