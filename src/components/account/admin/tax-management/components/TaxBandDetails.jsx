import React from 'react';
import { FaExchangeAlt, FaStar, FaTimes, FaTrash } from 'react-icons/fa';
import { ISOStringToLocalTime } from '@/utilities/formatTime';

const TaxBandDetails = ({ band, effectiveRate, onClose }) => {
  const handleDeleteTaxRateEntry = () => {
    // TODO: implement delete tax rate entry functionality
    if (band?.historicalRates?.length < 2) {
      alert(
        'You cannot delete this tax rate entry. A tax band must have at least one tax rate entry.'
      );
      return;
    }
    alert('tax entry deleted successfully');
  };

  const handleDissociateBranchFromTaxBand = () => {
    // TODO: implement dissociate branch from tax band functionality
    alert('branch dissociated from tax band successfully');
  };

  return (
    <div className="bg-text-white w-[90vw] h-[90%] p-5 rounded-lg relative">
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-gray-shadow5 text-gray-shadow10 rounded-full p-2 transition-colors duration-200 hover:bg-gray-shadow2"
      >
        <FaTimes />
      </button>
      <h2 className="text-lg text-brand-blue font-bold mb-4">{band.name}</h2>
      <p className="text-text-gray text-sm">{band.description}</p>
      <hr className="my-2" />

      <div className="flex flex-row gap-5 max-h-[80%] overflow-y-auto scrollbar-thin w-full">
        <div className="p-2 w-[50%] h-full overflow-y-auto">
          <h3 className="font-semibold mb-2">Tax Rates history</h3>
          <div className="w-full border-collapse">
            <ul className="w-full flex flex-row gap-0 bg-gray-shadow2 text-text-white text-sm font-semibold">
              <li className="w-1/4 px-2 py-1 text-left border border-gray-border">
                Rate
              </li>
              <li className="w-1/4 px-2 py-1 text-left border border-gray-border">
                Effective Date
              </li>
              <li className="w-1/4 px-2 py-1 text-left border border-gray-border">
                Set By
              </li>
              <li className="w-1/4 px-2 py-1 text-left border border-gray-border"></li>
            </ul>

            {band?.historicalRates?.map((rate, index) => (
              <ul
                key={index}
                className={`w-full flex flex-row gap-0 text-sm ${index % 2 !== 0 ? 'bg-gray-shadow9' : 'bg-white'} relative`}
              >
                <li className="w-1/4 px-2 py-1 border border-gray-border">
                  {`${rate.rate?.toFixed(2)}%` || 'rate not set'}
                </li>
                <li className="w-1/4 px-2 py-1 border border-gray-border">
                  {ISOStringToLocalTime(rate.effectiveDate) || 'date not set'}
                </li>
                <li className="w-1/4 px-2 py-1 border border-gray-border flex justify-between items-center">
                  <span>{rate.updatedBy?.fullName || 'unknown user'}</span>
                </li>
                <li className="w-1/4 px-2 py-1 border border-gray-border flex justify-center gap-5 items-center">
                  <span
                    onClick={handleDeleteTaxRateEntry}
                    title="delete tax rate entry"
                  >
                    <FaTrash className="text-red-500 hover:border shadow-md text-base cursor-pointer" />
                  </span>
                </li>
                <span className="absolute right-1">
                  {rate?._id === band?.effectiveRate?._id ? (
                    <FaStar className="text-yellow-500 border shadow-md text-base" />
                  ) : (
                    ' '
                  )}
                </span>
              </ul>
            ))}
          </div>
        </div>

        <div className="p-2 h-full overflow-y-auto w-[50%]">
          <h3 className="font-semibold mb-2">
            Associated Branches{' '}
            {band?.associatedBranches?.length > 0 &&
              `(${band.associatedBranches.length})`}
          </h3>
          {band?.associatedBranches?.length > 0 ? (
            <ul className="w-full p-2 bg-gray-shadow10">
              {band.associatedBranches.map((branch) => (
                <li
                  key={branch._id}
                  className="w-full text-sm font-semibold bg-blend-luminosity mb-1 py-1 hover:bg-gray-200 text-text-gray border-b flex flex-row gap-5"
                >
                  <span>{branch.name}</span>
                  {`-`}
                  <span>{branch.branchId}</span>
                  <span
                    onClick={handleDissociateBranchFromTaxBand}
                    title="disassociate branch from this tax band"
                  >
                    <FaExchangeAlt className="text-red-500 hover:border shadow-md text-sm cursor-pointer" />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className=" text-text-gray my-20 text-center">
              No branches are currently associated with this tax band.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxBandDetails;
