import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TaxBandDetails = ({ band, onClose }) => {
  return (
    <div className="bg-text-white w-[90vw] h-[90%] p-5 rounded-lg relative">
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-gray-shadow5 text-gray-shadow10 rounded-full p-2 transition-colors duration-200 hover:bg-gray-shadow2"
      >
        <FaTimes />
      </button>
      TaxBandDetails
    </div>
  );
};

export default TaxBandDetails;
