import {
  calculateDistance,
  calculateETA,
  formatDuration,
  calculateFuelConsumption,
  groupVehiclesByStatus,
  sortVehicles,
  filterVehicles,
  calculateFleetStats,
  validateVehicle,
  formatVehicleData,
  simulateMovement
} from '../fleetUtils';

describe('Fleet Utilities', () => {
  describe('calculateDistance', () => {
    test('calculates distance between two points correctly', () => {
      // Distance between New York and Los Angeles (approximate)
      const nyc = { lat: 40.7128, lng: -74.0060 };
      const la = { lat: 34.0522, lng: -118.2437 };
      
      // Actual distance is about 3935 km
      const distance = calculateDistance(nyc.lat, nyc.lng, la.lat, la.lng);
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });
    
    test('returns 0 for same point', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
      expect(distance).toBe(0);
    });
  });

  describe('calculateETA', () => {
    test('calculates ETA correctly', () => {
      // 100 km at 100 km/h = 60 minutes
      expect(calculateETA(100, 100)).toBe(60);
      // 200 km at 50 km/h = 240 minutes
      expect(calculateETA(200, 50)).toBe(240);
    });
    
    test('returns 0 for zero or negative speed', () => {
      expect(calculateETA(100, 0)).toBe(0);
      expect(calculateETA(100, -10)).toBe(0);
    });
  });

  describe('formatDuration', () => {
    test('formats duration correctly', () => {
      expect(formatDuration(0)).toBe('0m');
      expect(formatDuration(30)).toBe('30m');
      expect(formatDuration(60)).toBe('1h 0m');
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(125)).toBe('2h 5m');
    });
    
    test('handles null/undefined', () => {
      expect(formatDuration(null)).toBe('N/A');
      expect(formatDuration(undefined)).toBe('N/A');
    });
  });

  describe('calculateFuelConsumption', () => {
    test('calculates fuel consumption correctly', () => {
      // 500 km at 5L/100km = 25L
      expect(calculateFuelConsumption(500, 5)).toBe(25);
      // 0 km should return 0
      expect(calculateFuelConsumption(0, 5)).toBe(0);
    });
  });

  describe('groupVehiclesByStatus', () => {
    const vehicles = [
      { id: 1, status: 'active' },
      { id: 2, status: 'inactive' },
      { id: 3, status: 'active' },
      { id: 4, status: 'maintenance' },
    ];
    
    test('groups vehicles by status', () => {
      const grouped = groupVehiclesByStatus(vehicles);
      expect(grouped.active).toHaveLength(2);
      expect(grouped.inactive).toHaveLength(1);
      expect(grouped.maintenance).toHaveLength(1);
      expect(grouped.unknown).toBeUndefined();
    });
    
    test('handles empty array', () => {
      expect(groupVehiclesByStatus([])).toEqual({});
    });
  });

  describe('sortVehicles', () => {
    const vehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2020 },
      { id: 2, make: 'Honda', model: 'Civic', year: 2019 },
      { id: 3, make: 'Ford', model: 'F-150', year: 2021 },
    ];
    
    test('sorts by string property', () => {
      const sorted = sortVehicles(vehicles, 'make');
      expect(sorted[0].make).toBe('Ford');
      expect(sorted[1].make).toBe('Honda');
      expect(sorted[2].make).toBe('Toyota');
    });
    
    test('sorts by number property', () => {
      const sorted = sortVehicles(vehicles, 'year', false); // descending
      expect(sorted[0].year).toBe(2021);
      expect(sorted[1].year).toBe(2020);
      expect(sorted[2].year).toBe(2019);
    });
  });

  describe('filterVehicles', () => {
    const vehicles = [
      { id: 1, make: 'Toyota', status: 'active', location: { city: 'Tokyo' } },
      { id: 2, make: 'Honda', status: 'inactive', location: { city: 'Osaka' } },
      { id: 3, make: 'Ford', status: 'active', location: { city: 'Detroit' } },
    ];
    
    test('filters by simple property', () => {
      const filtered = filterVehicles(vehicles, { make: 'Toyota' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(1);
    });
    
    test('filters by nested property', () => {
      const filtered = filterVehicles(vehicles, { 'location.city': 'Osaka' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(2);
    });
    
    test('handles empty filters', () => {
      expect(filterVehicles(vehicles, {})).toEqual(vehicles);
    });
  });

  describe('calculateFleetStats', () => {
    const vehicles = [
      { status: 'active', mileage: 10000 },
      { status: 'active', mileage: 20000 },
      { status: 'inactive', mileage: 30000 },
      { status: 'maintenance', mileage: 40000 },
    ];
    
    test('calculates fleet statistics', () => {
      const stats = calculateFleetStats(vehicles);
      expect(stats.total).toBe(4);
      expect(stats.active).toBe(2);
      expect(stats.inactive).toBe(1);
      expect(stats.maintenance).toBe(1);
      expect(stats.utilization).toBe(50); // 2/4 = 50%
      expect(stats.averageMileage).toBe(25000); // (10000+20000+30000+40000)/4
    });
    
    test('handles empty array', () => {
      const stats = calculateFleetStats([]);
      expect(stats.total).toBe(0);
      expect(stats.averageMileage).toBe(0);
    });
  });

  describe('validateVehicle', () => {
    test('validates vehicle data correctly', () => {
      const validVehicle = {
        licensePlate: 'ABC123',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 10000,
      };
      
      const invalidVehicle = {
        licensePlate: '',
        make: '',
        model: '',
        year: 1800,
        mileage: -100,
      };
      
      const validResult = validateVehicle(validVehicle);
      const invalidResult = validateVehicle(invalidVehicle);
      
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toHaveProperty('licensePlate');
      expect(invalidResult.errors).toHaveProperty('make');
      expect(invalidResult.errors).toHaveProperty('model');
      expect(invalidResult.errors).toHaveProperty('year');
      expect(invalidResult.errors).toHaveProperty('mileage');
    });
  });

  describe('formatVehicleData', () => {
    test('formats vehicle data for display', () => {
      const vehicle = {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 12345,
        status: 'active',
        lastServiceDate: '2023-01-15',
      };
      
      const formatted = formatVehicleData(vehicle);
      
      expect(formatted.formattedMileage).toBe('12,345 km');
      expect(formatted.status).toBe('Active');
      expect(formatted.formattedLastService).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
    
    test('handles missing data', () => {
      const formatted = formatVehicleData({});
      expect(formatted.formattedMileage).toBe('N/A');
      expect(formatted.formattedLastService).toBe('N/A');
      expect(formatted.status).toBe('Unknown');
    });
  });

  describe('simulateMovement', () => {
    test('returns position with small random movement', () => {
      const position = { lat: 40.7128, lng: -74.0060 };
      const newPosition = simulateMovement(position);
      
      // Should be close to original position
      expect(newPosition.lat).toBeCloseTo(position.lat, 2);
      expect(newPosition.lng).toBeCloseTo(position.lng, 2);
      
      // Should be different from original position
      expect(newPosition.lat).not.toBe(position.lat);
      expect(newPosition.lng).not.toBe(position.lng);
    });
  });
});
