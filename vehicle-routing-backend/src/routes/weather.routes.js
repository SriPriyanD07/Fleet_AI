const express = require('express');
const router = express.Router();
const weatherService = require('../services/weather.service');
const { validateLocation } = require('../middleware/validation');

/**
 * @swagger
 * /api/weather/current:
 *   get:
 *     summary: Get current weather for a location
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the location
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: Current weather data
 */
router.get('/current', validateLocation, async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const weather = await weatherService.getCurrentWeather(lat, lon);
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/weather/forecast:
 *   get:
 *     summary: Get weather forecast for a location
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the location
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: Weather forecast data
 */
router.get('/forecast', validateLocation, async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const forecast = await weatherService.getWeatherForecast(lat, lon);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
