import React from 'react';
import {
  FaEdit,
  FaExchangeAlt,
  FaStar,
  FaTimes,
  FaTrash,
} from 'react-icons/fa';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import WarningWithFeedbackModal from '@/components/account/common/WarningWithFeedbackModal';
import { deleteTaxRateEntryService } from '@/services/taxBandServices';
import DissociateBranchModal from './DissociateBranchModal';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const TaxBandDetails = ({
  band,
  setBand,
  onClose,
  otherTaxBands,
  handleEditTaxBandClick,
  handleDeleteTaxBandClick,
}) => {
  const [openDissociateBranchModal, setOpenDissociateBranchModal] =
    React.useState(false);
  const [branchToDissociate, setBranchToDissociate] = React.useState(null);
  const [newTaxBandId, setNewTaxBandId] = React.useState('');
  const [openWarningModal, setOpenWarningModal] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [responseMessages, setResponseMessages] = React.useState([]);
  const [deleteErrors, setDeleteErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [taxRateEntryToDelete, setTaxRateEntryToDelete] = React.useState(null);

  const onDeleteTaxRateEntryClick = (rateId) => {
    if (band && band?.historicalRates?.length < 2) {
      setDeleteErrors([
        'You cannot delete this tax rate entry. A tax band must have at least one tax rate entry. Please add a new tax rate entry before deleting this one.',
      ]);
      setOpenWarningModal(true);
      return;
    }

    setOpenWarningModal(true);
    setTaxRateEntryToDelete(rateId);
  };

  const handleDeleteTaxRateEntry = async () => {
    try {
      setLoading(true);
      const response = await deleteTaxRateEntryService(
        band._id,
        taxRateEntryToDelete
      );

      if (response && response.data) {
        console.log('response-data:', response.data);
        setResponseMessages(['Rate entry deleted successfully!!']);
        setSuccess(true);
        setTaxRateEntryToDelete(null);
      }

      if (response && response?.error) {
        setDeleteErrors([
          response.error || 'Error deleting rate entry, please try again later',
        ]);
      }
    } catch (err) {
      setDeleteErrors(
        err.message || 'Error deleting rate entry, please try again later'
      );
      console.error('Error deleting rate entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDissociateBranchFromTaxBandClick = (branch) => {
    setOpenDissociateBranchModal(true);
    setBranchToDissociate(branch);
  };

  const onCloseDissociateBranchModal = () => {
    setOpenDissociateBranchModal(false);
    setBranchToDissociate(null);
    setNewTaxBandId('');
  };

  const handleSelectNewTaxBand = (bandId) => {
    const selectedBand = otherTaxBands?.find((tb) => tb._id === bandId);
    if (selectedBand) {
      setNewTaxBandId(selectedBand._id);
    }
  };

  return (
    <div className="bg-text-white w-full h-full md:w-[90vw] md:h-[90%] p-3 md:p-5 md:rounded-lg relative overflow-y-auto">
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-gray-shadow5 text-gray-shadow10 rounded-full p-2 transition-colors duration-200 hover:bg-gray-shadow2"
      >
        <FaTimes />
      </button>
      <div className="flex flex-row flex-wrap gap-3 md:gap-5 justify-center w-fit pr-10 mb-4">
        <h2 className="text-lg text-brand-blue font-bold">{band.name}</h2>
        {/* action buttons */}
        <p
          className={`px-2 py-1 text-left w-1/8 flex flex-row items-center justify-center gap-5`}
        >
          <span className="flex flex-row items-center gap-2 justify-around">
            <button
              onClick={(e) => {
                handleEditTaxBandClick(e, band);
              }}
              className=""
            >
              <FaEdit className="cursor-pointer hover:text-brand-blue" />
            </button>
          </span>
          <span className="flex flex-row items-center gap-2 justify-around">
            <button
              onClick={(e) => {
                handleDeleteTaxBandClick(e, band);
              }}
              className=""
            >
              <FaTrash className="cursor-pointer hover:text-error-hover" />
            </button>
          </span>
        </p>
      </div>
      <p className="text-text-gray text-sm">{band.description}</p>
      <hr className="my-2" />

      <div className="flex flex-col lg:flex-row gap-5 lg:max-h-[80%] lg:overflow-y-auto w-full">
        {/* tax rates history */}
        <div className="p-2 w-full lg:w-[50%] lg:h-full lg:overflow-y-auto">
          <h3 className="font-semibold mb-2">Tax Rates history</h3>
          <ResponsiveTable
            align="left"
            dense
            maxHeightClass=""
            rows={
              band?.historicalRates
                ? [...band.historicalRates].sort(
                    (a, b) =>
                      new Date(b.effectiveDate) - new Date(a.effectiveDate)
                  )
                : []
            }
            getRowKey={(r, i) => r?._id ?? i}
            emptyMessage="No tax rates yet."
            columns={[
              {
                key: 'rate',
                header: 'Rate',
                mobile: 'title',
                cell: (rate) => (
                  <span className="flex items-center gap-2">
                    {`${rate.rate?.toFixed(2)}%` || 'rate not set'}
                    {rate?._id === band?.effectiveRate?._id && (
                      <FaStar
                        className="text-yellow-500 text-base"
                        title="Current rate"
                        aria-label="Current rate"
                      />
                    )}
                  </span>
                ),
              },
              {
                key: 'date',
                header: 'Effective Date',
                cell: (rate) =>
                  ISOStringToLocalTime(rate.effectiveDate) || 'date not set',
              },
              {
                key: 'setBy',
                header: 'Set By',
                cell: (rate) => rate.updatedBy?.fullName || 'unknown user',
              },
            ]}
            actionsHeader=""
            actions={(rate) => (
              <button
                type="button"
                onClick={() => onDeleteTaxRateEntryClick(rate._id)}
                title="delete tax rate entry"
                aria-label="Delete tax rate entry"
              >
                <FaTrash className="text-red-500 text-base" />
              </button>
            )}
          />
        </div>

        {/* taxband associated branches */}
        <div className="p-2 lg:h-full lg:overflow-y-auto w-full lg:w-[50%]">
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
                    onClick={() => onDissociateBranchFromTaxBandClick(branch)}
                    title="Remove branch from this tax band"
                    className="ml-auto p-1"
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
        <>
          <DissociateBranchModal
            band={band}
            setBand={setBand}
            otherTaxBands={otherTaxBands}
            newTaxBandId={newTaxBandId}
            setNewTaxBandId={setNewTaxBandId}
            branchToDissociate={branchToDissociate}
            setBranchToDissociate={setBranchToDissociate}
            handleSelectNewTaxBand={handleSelectNewTaxBand}
            setOpenDissociateBranchModal={setOpenDissociateBranchModal}
            onCloseDissociateBranchModal={onCloseDissociateBranchModal}
          />
        </>
      )}

      {/* Warning Modal for deleting tax rate entry */}
      {openWarningModal && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <WarningWithFeedbackModal
            warningMessage={
              success
                ? ''
                : 'Are you sure you want to delete this tax rate entry?'
            }
            subText={
              'This tax rate entry will be permanently deleted. This action cannot be undone.'
            }
            title={'Delete Tax Rate Entry'}
            buttonStyle={'bg-red-500 hover:bg-red-400'}
            onClose={() => {
              setOpenWarningModal(false);
              setTaxRateEntryToDelete(null);
              setDeleteErrors([]);
              setResponseMessages([]);
            }}
            onConfirm={handleDeleteTaxRateEntry}
            button2Style={`bg-gray-500 hover:bg-gray-400`}
            responseMessages={success ? responseMessages : null}
            responseErrors={deleteErrors}
            loading={loading}
            confirmationText={'Yes, delete'}
            cancelText={'Cancel'}
          />
        </div>
      )}
    </div>
  );
};

export default TaxBandDetails;
