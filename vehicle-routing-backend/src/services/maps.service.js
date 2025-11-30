const axios = require('axios');
const logger = require('../utils/logger');

class MapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  async geocodeAddress(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address: address,
          key: this.apiKey,
        },
      });

      if (response.data.results.length === 0) {
        throw new Error('No results found for the provided address');
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      return {
        formatted_address: response.data.results[0].formatted_address,
        location: {
          lat,
          lng,
        },
      };
    } catch (error) {
      logger.error('Error geocoding address:', error);
      throw new Error('Failed to geocode address');
    }
  }

  async getDirections(origin, destination, waypoints = []) {
    try {
      const params = {
        origin: this.formatLocation(origin),
        destination: this.formatLocation(destination),
        key: this.apiKey,
        mode: 'driving',
        alternatives: true,
        optimize: true,
      };

      if (waypoints.length > 0) {
        params.waypoints = `optimize:true|${waypoints
          .map(wp => this.formatLocation(wp))
          .join('|')}`;
      }

      const response = await axios.get(`${this.baseUrl}/directions/json`, { params });

      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Failed to get directions');
      }

      return this.formatDirectionsResponse(response.data);
    } catch (error) {
      logger.error('Error getting directions:', error);
      throw new Error('Failed to get directions');
    }
  }

  async getDistanceMatrix(origins, destinations) {
    try {
      const response = await axios.get(`${this.baseUrl}/distancematrix/json`, {
        params: {
          origins: Array.isArray(origins) 
            ? origins.map(origin => this.formatLocation(origin)).join('|')
            : this.formatLocation(origins),
          destinations: Array.isArray(destinations)
            ? destinations.map(dest => this.formatLocation(dest)).join('|')
            : this.formatLocation(destinations),
          key: this.apiKey,
          mode: 'driving',
          units: 'metric',
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Failed to get distance matrix');
      }

      return response.data.rows;
    } catch (error) {
      logger.error('Error getting distance matrix:', error);
      throw new Error('Failed to get distance matrix');
    }
  }

  formatLocation(location) {
    if (typeof location === 'string') return location;
    if (location.lat && location.lng) return `${location.lat},${location.lng}`;
    if (location.latitude && location.longitude) 
      return `${location.latitude},${location.longitude}`;
    throw new Error('Invalid location format');
  }

  formatDirectionsResponse(data) {
    return {
      routes: data.routes.map(route => ({
        summary: route.summary,
        distance: route.legs.reduce((sum, leg) => sum + leg.distance.value, 0),
        duration: route.legs.reduce((sum, leg) => sum + leg.duration.value, 0),
        legs: route.legs.map(leg => ({
          start_address: leg.start_address,
          end_address: leg.end_address,
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps.map(step => ({
            instructions: step.html_instructions,
            distance: step.distance,
            duration: step.duration,
            polyline: step.polyline.points,
            travel_mode: step.travel_mode,
          })),
        })),
        overview_polyline: route.overview_polyline.points,
        waypoint_order: route.waypoint_order || [],
      })),
      status: data.status,
    };
  }
}

module.exports = new MapsService();
