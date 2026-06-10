import ErrorModal from '@/components/account/ErrorModal';
import Spinner from '@/components/account/Spinner';
import SuccessModal from '@/components/account/SuccessModal';
import { changeBranchTaxBandService } from '@/services/branchServices';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const DissociateBranchModal = ({
  otherTaxBands,
  newTaxBandId,
  setNewTaxBandId,
  branchToDissociate,
  setBranchToDissociate,
  handleSelectNewTaxBand,
  setOpenDissociateBranchModal,
  onCloseDissociateBranchModal,
  band,
  setBand,
}) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('ikkitogikfififujhfgujgf');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setSuccess(false);
    setError(false);
    setErrorMessage('');
    setSuccessMessage('');
    setOpenDissociateBranchModal(false);
  };

  const handleDissociateBranchFromTaxBand = async () => {
    try {
      setLoading(true);

      const response = await changeBranchTaxBandService(
        branchToDissociate._id,
        newTaxBandId
      );

      if (response && response.data) {
        setSuccess(true);
        setSuccessMessage('Branch taxband changed successfully');
        setBand((prev) => ({
          ...prev,
          associatedBranches: prev?.associatedBranches?.filter(
            (br) => br._id !== branchToDissociate._id
          ),
        }));

        setBranchToDissociate(null);
        setNewTaxBandId(null);
      }

      if (response && response.error) {
        setError(true);
        setErrorMessage(
          response.error ||
            'error changing branch taxband. Please try again later'
        );
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'error changing branch taxband. Please try again later'
      );
      console.error('Error changing branch tax band:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3 min-h-[50vh] w-full">
      {loading ? (
        <Spinner />
      ) : success ? (
        <SuccessModal
          message={successMessage}
          title={'Success'}
          buttonStyle={'bg-success'}
          onClose={() => {
            window.location.reload();
          }}
          subText={''}
          buttonText={'OK!'}
        />
      ) : error ? (
        <ErrorModal
          message={errorMessage}
          title={'Error!!!'}
          buttonStyle={'bg-error'}
          onClose={handleClose}
          buttonText={'Back'}
          subText={''}
        />
      ) : (
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
              You are about to remove{' '}
              <span className="font-semibold">
                {branchToDissociate?.name || 'this branch'}
              </span>{' '}
              from{' '}
              <span className="font-semibold">
                {band.name || 'its current tax band'}
              </span>
              . Please assign a new tax band to this branch.
            </p>
          )}
          {otherTaxBands?.length > 0 ? (
            <div className="w-full flex flex-col gap-3 items-center">
              <label htmlFor="taxBandSelect" className="font-semibold text-sm">
                Select New Tax Band
              </label>
              <select
                id="taxBandSelect"
                className="border border-gray-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
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
                No other tax bands are available. Please create another tax band
                before dissociating this branch.
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
      )}
    </div>
  );
};

export default DissociateBranchModal;
