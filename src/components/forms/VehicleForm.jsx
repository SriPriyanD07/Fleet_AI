import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Spinner } from '../ui/Spinner';
import { formatDateForInput } from '../../utils/dateUtils';

// Validation schema
const vehicleSchema = yup.object().shape({
  licensePlate: yup.string()
    .required('License plate is required')
    .matches(
      /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/i,
      'Enter a valid license plate (e.g., MH01AB1234)'
    ),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  year: yup.number()
    .typeError('Year must be a number')
    .required('Year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  color: yup.string(),
  vin: yup.string()
    .matches(
      /^[A-HJ-NPR-Z0-9]{17}$/i,
      'Enter a valid 17-character VIN'
    ),
  status: yup.string().required('Status is required'),
  fuelType: yup.string().required('Fuel type is required'),
  mileage: yup.number()
    .typeError('Mileage must be a number')
    .required('Mileage is required')
    .min(0, 'Mileage cannot be negative'),
  lastServiceDate: yup.date()
    .typeError('Invalid date')
    .max(new Date(), 'Date cannot be in the future'),
  nextServiceDue: yup.date()
    .typeError('Invalid date')
    .min(yup.ref('lastServiceDate'), 'Must be after last service date'),
  insuranceProvider: yup.string(),
  insurancePolicyNumber: yup.string(),
  insuranceExpiry: yup.date()
    .typeError('Invalid date')
    .min(new Date(), 'Insurance must be a future date'),
  driverId: yup.string(),
  notes: yup.string(),
  location: yup.object().shape({
    lat: yup.number(),
    lng: yup.number(),
    address: yup.string()
  })
});

// Default form values
const defaultValues = {
  status: 'active',
  fuelType: 'petrol',
  year: new Date().getFullYear(),
  mileage: 0,
  lastServiceDate: new Date(),
  nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  location: {}
};

// Status options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'out_of_service', label: 'Out of Service' }
];

// Fuel type options
const fuelTypeOptions = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' }
];

/**
 * VehicleForm Component
 * A form for adding/editing vehicle information
 */
export const VehicleForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel',
  className = '',
  ...props
}) => {
  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(vehicleSchema),
    defaultValues: { ...defaultValues, ...initialData }
  });

  // Handle form submission
  const handleFormSubmit = (data) => {
    // Convert string dates to Date objects
    const formattedData = {
      ...data,
      lastServiceDate: data.lastServiceDate ? new Date(data.lastServiceDate) : null,
      nextServiceDue: data.nextServiceDue ? new Date(data.nextServiceDue) : null,
      insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : null
    };
    
    onSubmit(formattedData);
  };

  // Reset form to initial values
  const handleReset = () => {
    reset({ ...defaultValues, ...initialData });
  };

  // Watch for changes to calculate next service date if not set
  const lastServiceDate = watch('lastServiceDate');
  const nextServiceDue = watch('nextServiceDue');

  // Set next service date to 6 months after last service if not set
  React.useEffect(() => {
    if (lastServiceDate && !nextServiceDue) {
      const lastService = new Date(lastServiceDate);
      const nextService = new Date(lastService.setMonth(lastService.getMonth() + 6));
      setValue('nextServiceDue', formatDateForInput(nextService));
    }
  }, [lastServiceDate, nextServiceDue, setValue]);

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className={`space-y-6 ${className}`}
      {...props}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Basic Information */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="License Plate *"
              {...register('licensePlate')}
              error={errors.licensePlate?.message}
              placeholder="e.g. MH01AB1234"
              className="lg:col-span-1"
            />
            
            <Input
              label="Make *"
              {...register('make')}
              error={errors.make?.message}
              placeholder="e.g. Tata"
              className="lg:col-span-1"
            />
            
            <Input
              label="Model *"
              {...register('model')}
              error={errors.model?.message}
              placeholder="e.g. Ace"
              className="lg:col-span-1"
            />
            
            <Input
              label="Year *"
              type="number"
              {...register('year')}
              error={errors.year?.message}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="lg:col-span-1"
            />
            
            <Input
              label="Color"
              {...register('color')}
              error={errors.color?.message}
              placeholder="e.g. White"
              className="lg:col-span-1"
            />
            
            <Input
              label="VIN (Vehicle Identification Number)"
              {...register('vin')}
              error={errors.vin?.message}
              placeholder="17-character VIN"
              className="lg:col-span-1"
            />
            
            <Select
              label="Status *"
              options={statusOptions}
              {...register('status')}
              error={errors.status?.message}
              className="lg:col-span-1"
            />
            
            <Select
              label="Fuel Type *"
              options={fuelTypeOptions}
              {...register('fuelType')}
              error={errors.fuelType?.message}
              className="lg:col-span-1"
            />
          </div>
        </div>
        
        {/* Service Information */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Service Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Current Mileage *"
              type="number"
              {...register('mileage')}
              error={errors.mileage?.message}
              min="0"
              step="1"
              className="lg:col-span-1"
            />
            
            <Input
              label="Last Service Date"
              type="date"
              {...register('lastServiceDate')}
              error={errors.lastServiceDate?.message}
              max={formatDateForInput(new Date())}
              className="lg:col-span-1"
            />
            
            <Input
              label="Next Service Due"
              type="date"
              {...register('nextServiceDue')}
              error={errors.nextServiceDue?.message}
              min={lastServiceDate || formatDateForInput(new Date())}
              className="lg:col-span-1"
            />
            
            <Input
              label="Service Notes"
              {...register('notes')}
              error={errors.notes?.message}
              as="textarea"
              rows={3}
              className="sm:col-span-2 lg:col-span-3"
            />
          </div>
        </div>
        
        {/* Insurance Information */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Insurance Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Insurance Provider"
              {...register('insuranceProvider')}
              error={errors.insuranceProvider?.message}
              placeholder="e.g. ICICI Lombard"
              className="lg:col-span-1"
            />
            
            <Input
              label="Policy Number"
              {...register('insurancePolicyNumber')}
              error={errors.insurancePolicyNumber?.message}
              placeholder="Policy number"
              className="lg:col-span-1"
            />
            
            <Input
              label="Insurance Expiry Date"
              type="date"
              {...register('insuranceExpiry')}
              error={errors.insuranceExpiry?.message}
              min={formatDateForInput(new Date())}
              className="lg:col-span-1"
            />
          </div>
        </div>
        
        {/* Location Information */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Location</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Current Location"
              {...register('location.address')}
              error={errors.location?.address?.message}
              placeholder="Address or landmark"
              className="sm:col-span-2 lg:col-span-3"
            />
            
            <Input
              label="Latitude"
              type="number"
              step="any"
              {...register('location.lat')}
              error={errors.location?.lat?.message}
              placeholder="e.g. 19.0760"
              className="lg:col-span-1"
            />
            
            <Input
              label="Longitude"
              type="number"
              step="any"
              {...register('location.lng')}
              error={errors.location?.lng?.message}
              placeholder="e.g. 72.8777"
              className="lg:col-span-1"
            />
            
            <div className="flex items-end lg:col-span-1">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // Get current location
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setValue('location.lat', position.coords.latitude);
                        setValue('location.lng', position.coords.longitude);
                        // You could also reverse geocode here to get the address
                      },
                      (error) => {
                        console.error('Error getting location:', error);
                        alert('Could not get your location. Please enter it manually.');
                      }
                    );
                  } else {
                    alert('Geolocation is not supported by your browser');
                  }
                }}
              >
                Use My Location
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel || handleReset}
          disabled={loading}
        >
          {cancelButtonText}
        </Button>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="min-w-[100px]"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner size="sm" className="mr-2" />
              Saving...
            </div>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
};

// Example usage:
/*
<VehicleForm
  initialData={vehicleData} // Optional, for editing
  onSubmit={(data) => {
    console.log('Form submitted:', data);
    // Handle form submission (e.g., API call)
  }}
  onCancel={() => {
    console.log('Form cancelled');
    // Handle cancel (e.g., close modal)
  }}
  loading={isSubmitting}
  submitButtonText={isEditing ? 'Update Vehicle' : 'Add Vehicle'}
  cancelButtonText="Cancel"
  className="p-6 bg-white rounded-lg shadow"
/>
*/
