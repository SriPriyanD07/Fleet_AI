import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import DriverReport from '@/components/reports/DriverReport';
import { mockAPI } from '@/services/mockApi';

const DriverReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setIsLoading(true);
        const response = await mockAPI.drivers.getById(id);
        setDriver(response.data);
      } catch (err) {
        console.error('Error fetching driver:', err);
        setError(err.message || 'Failed to load driver data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDriver();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/drivers');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>{error}</p>
        <Button onClick={handleBack} className="mt-4">
          Back to Drivers
        </Button>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-4 text-amber-600 bg-amber-100 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Driver Not Found</h2>
        <p>The requested driver could not be found.</p>
        <Button onClick={handleBack} className="mt-4">
          Back to Drivers
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Drivers
        </Button>
      </div>
      
      <DriverReport driver={driver} />
    </div>
  );
};

export default DriverReportPage;