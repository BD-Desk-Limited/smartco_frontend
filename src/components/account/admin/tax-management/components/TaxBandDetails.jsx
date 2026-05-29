import React from 'react';
import { FaExchangeAlt, FaStar, FaTimes, FaTrash } from 'react-icons/fa';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import Button from '@/components/account/Button';

const TaxBandDetails = ({ band, effectiveRate, onClose, otherTaxBands }) => {
  const [openDissociateBranchModal, setOpenDissociateBranchModal] =
    React.useState(false);
  const [branchToDissociate, setBranchToDissociate] = React.useState(null);
  const [newTaxBandId, setNewTaxBandId] = React.useState('');

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

  const onDissociateBranchFromTaxBand = (branch) => {
    setOpenDissociateBranchModal(true);
    setBranchToDissociate(branch);
  };

  const onCloseDissociateBranchModal = () => {
    setOpenDissociateBranchModal(false);
    setBranchToDissociate(null);
    setNewTaxBandId('');
  };

  const handleDissociateBranchFromTaxBand = () => {
    // TODO: implement dissociate branch from tax band functionality
    alert('branch dissociated from tax band successfully');
  };

  const handleSelectNewTaxBand = (newTaxBandId) => {
    const selectedBand = otherTaxBands?.find((tb) => tb._id === newTaxBandId);
    if (selectedBand) {
      setNewTaxBandId(selectedBand._id);
    }
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
                    onClick={() => onDissociateBranchFromTaxBand(branch)}
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

      {/* Dissociate branch and assign new tax band */}
      {openDissociateBranchModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3 min-h-[50vh] w-[600px]">
          <div className="bg-white rounded-lg w-[400px] p-5 relative">
            {/* close button */}
            <button
              onClick={onCloseDissociateBranchModal}
              className="absolute top-2 right-2 bg-gray-shadow5 text-gray-shadow10 rounded-full p-2 transition-colors duration-200 hover:bg-gray-shadow2"
            >
              <FaTimes />
            </button>
            <h3 className="text-brand-blue w-full text-center font-bold mb-4">
              Assign New Tax Band
            </h3>
            {otherTaxBands?.length > 0 && (
              <p className="text-center text-text-gray mb-5">
                You are about to dissociate{' '}
                <span className="font-semibold">
                  {branchToDissociate?.name || 'this branch'}
                </span>{' '}
                from{' '}
                <span className="font-semibold">
                  {band.name || 'its current tax band'}
                </span>
                . Please select a new tax band to assign to this branch.
              </p>
            )}
            {otherTaxBands?.length > 0 ? (
              <div className="w-full flex flex-col gap-3 items-center">
                <label
                  htmlFor="taxBandSelect"
                  className="font-semibold text-sm"
                >
                  Select New Tax Band
                </label>
                <select
                  id="taxBandSelect"
                  className="border border-gray-border rounded-md p-2"
                  defaultValue={band._id}
                  value={newTaxBandId || ''}
                  onChange={(e) => handleSelectNewTaxBand(e.target.value)}
                >
                  <option value="" disabled>
                    Select a tax band
                  </option>
                  {otherTaxBands?.map((tb) => (
                    <option key={tb._id} value={tb._id}>
                      {tb.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleDissociateBranchFromTaxBand}
                  disabled={!newTaxBandId}
                  className={`bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-blue-shadow1 transition-colors duration-200 ${!newTaxBandId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Confirm
                </button>
              </div>
            ) : (
              <p className="text-center text-error flex flex-col gap-5 items-center">
                <span className=" my-10">
                  No other tax bands are available. Please create another tax
                  band before dissociating this branch.
                </span>
                <button
                  onClick={() => {
                    setOpenDissociateBranchModal(false);
                  }}
                  className="bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-blue-shadow1 transition-colors duration-200"
                >
                  ok
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxBandDetails;
