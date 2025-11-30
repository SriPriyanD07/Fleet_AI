const axios = require('axios');
const logger = require('../utils/logger');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
        },
      });
      
      return {
        temperature: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        wind_speed: response.data.wind.speed,
        weather: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherForecast(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          cnt: 5, // Get forecast for next 5 time periods (3-hour intervals)
        },
      });

      return response.data.list.map(item => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        weather: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        wind_speed: item.wind.speed,
        pop: item.pop, // Probability of precipitation
      }));
    } catch (error) {
      logger.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }
}

module.exports = new WeatherService();
