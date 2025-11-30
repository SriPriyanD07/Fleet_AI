import React from 'react';
import { X } from 'lucide-react';
import DriverReport from './DriverReport';

const DriverReportModal = ({ driver, onClose }) => {
  if (!driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 z-10 flex justify-end p-4 bg-white border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <DriverReport driver={driver} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default DriverReportModal;