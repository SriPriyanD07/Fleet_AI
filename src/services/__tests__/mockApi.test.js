import { mockAPI } from '../mockApi';

describe('mockAPI', () => {
  describe('auth', () => {
    it('should login with valid credentials', async () => {
      const response = await mockAPI.auth.login({
        email: 'admin@fleet.com',
        password: 'password'
      });
      
      expect(response.data).toHaveProperty('token');
      expect(response.data.user.email).toBe('admin@fleet.com');
    });

    it('should reject invalid credentials', async () => {
      await expect(
        mockAPI.auth.login({
          email: 'wrong@example.com',
          password: 'wrongpass'
        })
      ).rejects.toThrow();
    });

    it('should get user profile', async () => {
      const response = await mockAPI.auth.getProfile();
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('email');
    });
  });

  describe('vehicles', () => {
    it('should get all vehicles', async () => {
      const response = await mockAPI.vehicles.getAll();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.pagination).toBeDefined();
    });

    it('should filter vehicles by status', async () => {
      const response = await mockAPI.vehicles.getAll({ status: 'active' });
      expect(response.data.every(v => v.status === 'active')).toBe(true);
    });

    it('should get vehicle by id', async () => {
      const vehicles = await mockAPI.vehicles.getAll();
      const vehicleId = vehicles.data[0].id;
      const response = await mockAPI.vehicles.getById(vehicleId);
      expect(response.data.id).toBe(vehicleId);
    });

    it('should create a new vehicle', async () => {
      const newVehicle = {
        make: 'Test Make',
        model: 'Test Model',
        type: 'Test Type',
        status: 'active'
      };
      const response = await mockAPI.vehicles.create(newVehicle);
      expect(response.data.make).toBe('Test Make');
      expect(response.data).toHaveProperty('id');
    });

    it('should update a vehicle', async () => {
      const vehicles = await mockAPI.vehicles.getAll();
      const vehicleId = vehicles.data[0].id;
      const updates = { status: 'maintenance' };
      const response = await mockAPI.vehicles.update(vehicleId, updates);
      expect(response.data.status).toBe('maintenance');
    });

    it('should get vehicle locations', async () => {
      const response = await mockAPI.vehicles.getLocations();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[0]).toHaveProperty('lat');
      expect(response.data[0]).toHaveProperty('lng');
    });
  });

  describe('orders', () => {
    it('should get all orders', async () => {
      const response = await mockAPI.orders.getAll();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.pagination).toBeDefined();
    });

    it('should filter orders by status', async () => {
      const response = await mockAPI.orders.getAll({ status: 'delivered' });
      expect(response.data.every(o => o.status === 'delivered')).toBe(true);
    });
  });

  describe('analytics', () => {
    it('should get fleet metrics', async () => {
      const response = await mockAPI.analytics.getFleetMetrics();
      expect(response.data).toHaveProperty('totalVehicles');
      expect(response.data).toHaveProperty('activeVehicles');
      expect(response.data).toHaveProperty('inMaintenance');
      expect(response.data).toHaveProperty('totalOrders');
    });
  });
});
