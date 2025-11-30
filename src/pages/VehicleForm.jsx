import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { mockAPI } from '@/services/mockApi';

// Form validation schema
const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  type: z.string().min(1, 'Type is required'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required'),
  vin: z.string().min(1, 'VIN is required'),
  status: z.string().min(1, 'Status is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  mileage: z.coerce.number().min(0, 'Mileage must be positive'),
  lastServiceDate: z.string().min(1, 'Last service date is required'),
  nextServiceDue: z.string().min(1, 'Next service due is required'),
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
  insurancePolicyNumber: z.string().min(1, 'Policy number is required'),
  insuranceExpiry: z.string().min(1, 'Insurance expiry is required'),
  driverId: z.string().optional(),
  driverName: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const vehicleTypes = [
  { value: 'Truck', label: 'Truck' },
  { value: 'Van', label: 'Van' },
  { value: 'Car', label: 'Car' },
  { value: 'Bike', label: 'Bike' },
  { value: 'Scooter', label: 'Scooter' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'out_of_service', label: 'Out of Service' },
];

const fuelTypes = [
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Petrol', label: 'Petrol' },
  { value: 'CNG', label: 'CNG' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const cities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
];

export function VehicleForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Fetch vehicle data if in edit mode
  const { data: vehicle, isLoading } = useQuery(
    ['vehicle', id],
    () => mockAPI.vehicles.getById(id).then(res => res.data),
    { enabled: isEditing }
  );

  // Initialize form with react-hook-form and zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      status: 'active',
      fuelType: 'Diesel',
      type: 'Truck',
      mileage: 0,
    },
  });

  // Set form values when vehicle data is loaded
  useEffect(() => {
    if (isEditing && vehicle) {
      reset({
        ...vehicle,
        // Ensure dates are in the correct format for date inputs
        lastServiceDate: vehicle.lastServiceDate?.split('T')[0],
        nextServiceDue: vehicle.nextServiceDue?.split('T')[0],
        insuranceExpiry: vehicle.insuranceExpiry?.split('T')[0],
      });
    }
  }, [vehicle, isEditing, reset]);

  // Handle form submission
  const mutation = useMutation(
    (data) => 
      isEditing 
        ? mockAPI.vehicles.update(id, data) 
        : mockAPI.vehicles.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
        navigate('/vehicles');
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find the nearest city
        let nearestCity = cities[0];
        let minDistance = Infinity;
        
        cities.forEach(city => {
          const distance = Math.sqrt(
            Math.pow(city.lat - latitude, 2) + 
            Math.pow(city.lng - longitude, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
          }
        });
        
        setValue('location', nearestCity.name);
        setValue('lat', latitude);
        setValue('lng', longitude);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to retrieve your location');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Watch for location changes to update coordinates
  const location = watch('location');
  useEffect(() => {
    if (location) {
      const city = cities.find(c => c.name === location);
      if (city) {
        setValue('lat', city.lat);
        setValue('lng', city.lng);
      }
    }
  }, [location, setValue]);

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          as={Link}
          to="/vehicles"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vehicles
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing 
            ? 'Update the vehicle details below.' 
            : 'Fill in the form below to add a new vehicle to your fleet.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                Make <span className="text-red-500">*</span>
              </label>
              <Input
                id="make"
                className="mt-1"
                placeholder="e.g. Tata"
                error={errors.make?.message}
                {...register('make')}
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model <span className="text-red-500">*</span>
              </label>
              <Input
                id="model"
                className="mt-1"
                placeholder="e.g. Prima"
                error={errors.model?.message}
                {...register('model')}
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year <span className="text-red-500">*</span>
              </label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="mt-1"
                error={errors.year?.message}
                {...register('year')}
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <Select
                id="type"
                className="mt-1"
                options={vehicleTypes}
                error={errors.type?.message}
                {...register('type')}
              />
            </div>

            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                License Plate <span className="text-red-500">*</span>
              </label>
              <Input
                id="licensePlate"
                className="mt-1 font-mono"
                placeholder="e.g. MH01AB1234"
                error={errors.licensePlate?.message}
                {...register('licensePlate')}
              />
            </div>

            <div>
              <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                VIN <span className="text-red-500">*</span>
              </label>
              <Input
                id="vin"
                className="mt-1 font-mono"
                placeholder="Vehicle Identification Number"
                error={errors.vin?.message}
                {...register('vin')}
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color <span className="text-red-500">*</span>
              </label>
              <Input
                id="color"
                className="mt-1"
                placeholder="e.g. Red"
                error={errors.color?.message}
                {...register('color')}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                id="status"
                className="mt-1"
                options={statusOptions}
                error={errors.status?.message}
                {...register('status')}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Technical Details</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <Select
                id="fuelType"
                className="mt-1"
                options={fuelTypes}
                error={errors.fuelType?.message}
                {...register('fuelType')}
              />
            </div>

            <div>
              <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                Mileage (km) <span className="text-red-500">*</span>
              </label>
              <Input
                id="mileage"
                type="number"
                min="0"
                step="1"
                className="mt-1"
                error={errors.mileage?.message}
                {...register('mileage')}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Service Information</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="lastServiceDate" className="block text-sm font-medium text-gray-700">
                Last Service Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="lastServiceDate"
                type="date"
                className="mt-1"
                error={errors.lastServiceDate?.message}
                {...register('lastServiceDate')}
              />
            </div>

            <div>
              <label htmlFor="nextServiceDue" className="block text-sm font-medium text-gray-700">
                Next Service Due <span className="text-red-500">*</span>
              </label>
              <Input
                id="nextServiceDue"
                type="date"
                className="mt-1"
                error={errors.nextServiceDue?.message}
                {...register('nextServiceDue')}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Insurance Information</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">
                Insurance Provider <span className="text-red-500">*</span>
              </label>
              <Input
                id="insuranceProvider"
                className="mt-1"
                placeholder="e.g. ICICI Lombard"
                error={errors.insuranceProvider?.message}
                {...register('insuranceProvider')}
              />
            </div>

            <div>
              <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-gray-700">
                Policy Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="insurancePolicyNumber"
                className="mt-1"
                placeholder="e.g. POL-123456"
                error={errors.insurancePolicyNumber?.message}
                {...register('insurancePolicyNumber')}
              />
            </div>

            <div>
              <label htmlFor="insuranceExpiry" className="block text-sm font-medium text-gray-700">
                Insurance Expiry <span className="text-red-500">*</span>
              </label>
              <Input
                id="insuranceExpiry"
                type="date"
                className="mt-1"
                error={errors.insuranceExpiry?.message}
                {...register('insuranceExpiry')}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Location</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Current Location <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="inline-flex items-center px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Locating...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 mr-1" />
                      Use My Location
                    </>
                  )}
                </button>
              </div>
              
              <Select
                id="location"
                className="mt-1"
                options={cities.map(city => ({ value: city.name, label: city.name }))}
                error={errors.location?.message || locationError}
                {...register('location')}
              />
              
              {locationError && (
                <p className="mt-1 text-sm text-red-600">{locationError}</p>
              )}
              
              <div className="mt-2 text-xs text-gray-500">
                Coordinates: {watch('lat') && watch('lng') 
                  ? `${watch('lat').toFixed(4)}, ${watch('lng').toFixed(4)}` 
                  : 'Not set'}
              </div>
            </div>

            <div>
              <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">
                Driver Name
              </label>
              <Input
                id="driverName"
                className="mt-1"
                placeholder="e.g. Rajesh Kumar"
                error={errors.driverName?.message}
                {...register('driverName')}
              />
              
              <div className="mt-4">
                <label htmlFor="driverId" className="block text-sm font-medium text-gray-700">
                  Driver ID
                </label>
                <Input
                  id="driverId"
                  className="mt-1"
                  placeholder="e.g. DRV-001"
                  error={errors.driverId?.message}
                  {...register('driverId')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Additional Notes</h2>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <Textarea
              id="notes"
              className="mt-1"
              rows={4}
              placeholder="Any additional notes about this vehicle..."
              error={errors.notes?.message}
              {...register('notes')}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/vehicles')}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isLoading}
            className="flex items-center"
          >
            {mutation.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Vehicle' : 'Create Vehicle'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default VehicleForm;
