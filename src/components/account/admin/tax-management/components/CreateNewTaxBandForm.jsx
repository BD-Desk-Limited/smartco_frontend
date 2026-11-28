import Button from '@/components/account/common/Button';
import ErrorInterface from '@/components/account/common/errorInterface';
import SuccessModal from '@/components/account/common/SuccessModal';
import {
  createTaxBand,
  getAllTaxBandsByCompanyId,
} from '@/services/taxBandServices';
import { verifyInputText } from '@/utilities/verifyInput';
import React from 'react';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const CreateNewTaxBandForm = ({
  onClose,
  taxBands,
  setTaxBands,
  formData,
  setFormData,
  standAloneTaxManagement,
}) => {
  const [localTaxBand, setLocalTaxBand] = React.useState([]);
  const [newTaxBand, setNewTaxBand] = React.useState({
    name: '',
    rate: 0,
    effectiveDate: new Date(),
    description: '',
  });
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTaxBands = async () => {
      try {
        const response = await getAllTaxBandsByCompanyId();
        if (response.data) {
          setLocalTaxBand(response.data);
          !standAloneTaxManagement &&
            typeof setTaxBands === 'function' &&
            setTaxBands(response.data);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchTaxBands();
  }, [setTaxBands, setLocalTaxBand, standAloneTaxManagement]);

  //validate input
  let inputValidationErrors = [];
  const handleValidation = (input, message) => {
    if (!input) {
      inputValidationErrors.push(message);
    } else {
      const verifyInput = verifyInputText(input);
      if (!verifyInput.passed) {
        inputValidationErrors.push(verifyInput.message + ' ' + message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate before setting loading state
    if (!newTaxBand.name) {
      setError('Please enter a valid name for the tax band');
      return;
    }
    if (!newTaxBand.rate) {
      setError('Please enter a valid rate for the tax band');
      return;
    }
    if (!newTaxBand.description) {
      setError('Please enter a valid description for the tax band');
      return;
    }

    handleValidation(
      newTaxBand.name,
      'For tax band name, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.'
    );
    handleValidation(
      newTaxBand.rate,
      'For tax band rate, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.'
    );
    handleValidation(
      newTaxBand.description,
      'For tax band description, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.'
    );

    if (new Date(newTaxBand.effectiveDate) < new Date(Date.now())) {
      inputValidationErrors.push('Effective date cannot be in the past.');
    }

    if (inputValidationErrors.length > 0) {
      setError(inputValidationErrors[0]);
      return;
    }

    setLoading(true);
    try {
      const response = await createTaxBand(newTaxBand);

      if (response.error) {
        setError(
          response.error || 'An error occurred while creating the tax band.'
        );
        return;
      }

      if (response.data) {
        if (!standAloneTaxManagement) {
          setTaxBands([...taxBands, response.data]);
          setFormData({ ...formData, taxBand: response.data.name });
        }

        setNewTaxBand({ name: '', rate: 0, description: '' });
        setLocalTaxBand([...localTaxBand, response.data]);
        setError(null);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError(
        'An error occurred while creating the tax band. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full md:w-[80vw] md:h-[80vh] relative bg-white md:rounded-lg shadow-lg flex flex-col p-3 md:p-5 items-center overflow-y-auto">
      {!standAloneTaxManagement && (
        <button
          className="absolute top-0.5 right-0.5 bg-brand-gray rounded-[100%] px-4 py-2 text-text-white hover:bg-gray-shadow2 font-bold transition-all duration-300 ease-in-out"
          onClick={onClose}
          title="Close"
        >
          X
        </button>
      )}

      <h1 className="text-brand-blue font-bold my-5">Tax Bands</h1>
      <div className="w-full md:h-full flex flex-col md:flex-row gap-5 md:gap-0 shadow-lg rounded-lg p-2 md:p-1 border-2 border-gray-border">
        <form className="w-full md:w-[50%] text-sm" onSubmit={handleSubmit}>
          <h2 className="text-brand-blue font-light w-full text-center">
            Create New Tax Band
          </h2>
          <div className="flex flex-col w-full gap-5 h-full items-center justify-center">
            <div className="flex flex-col gap-1 w-full md:w-[80%]">
              <label className="text-text-gray w-fit" htmlFor="name">
                Tax Band Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter Band Name"
                value={newTaxBand.name}
                className="border border-gray-border rounded-md p-2 w-full focus:ring-2 focus:ring-brand-blue focus:outline-none"
                onChange={(e) =>
                  setNewTaxBand({ ...newTaxBand, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-[80%]">
              <label
                className="text-text-gray text-sm w-fit"
                htmlFor="rate"
              >{`Tax Rate (%)`}</label>
              <input
                id="rate"
                type="number"
                value={newTaxBand.rate}
                min={0}
                max={100}
                step={0.01}
                placeholder="Tax Rate(%)"
                className="w-full p-2 border border-gray-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
                onChange={(e) =>
                  setNewTaxBand({ ...newTaxBand, rate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-[80%]">
              <label
                className="text-text-gray text-sm w-fit"
                htmlFor="date"
              >{`Effective Date`}</label>
              <input
                id="date"
                type="datetime-local"
                value={newTaxBand.effectiveDate || new Date()}
                placeholder="yyyy-mm-dd"
                className="w-full p-2 border border-gray-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
                onChange={(e) =>
                  setNewTaxBand({
                    ...newTaxBand,
                    effectiveDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-[80%]">
              <label
                className="text-text-gray text-sm w-fit"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                type="text"
                placeholder="Description"
                value={newTaxBand.description}
                className="w-full h-24 p-2 border border-gray-border rounded-lg mb-2 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                onChange={(e) =>
                  setNewTaxBand({ ...newTaxBand, description: e.target.value })
                }
              />
            </div>
            {error && <ErrorInterface error={error} />}
            <Button
              text={'Create Tax Band'}
              type={'submit'}
              loading={loading}
              loadingText={'Creating Tax Band...'}
              buttonStyle={`bg-brand-blue text-text-white px-4 py-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
            />
          </div>
        </form>

        <span className="h-full w-0.5 bg-gray-border mx-1"></span>

        {/* Existing tax bands */}
        <div className="flex flex-col w-full md:w-[50%]">
          <h2 className="text-brand-blue font-light w-full text-center">
            Existing Tax Bands
          </h2>
          <div className="text-text-white text-sm">
            <ResponsiveTable
              align="left"
              dense
              maxHeightClass="md:max-h-[60vh]"
              className="text-text-black"
              rows={(!standAloneTaxManagement ? taxBands : localTaxBand) || []}
              getRowKey={(_, i) => i}
              emptyMessage="You have no existing tax band please create a tax band!!!"
              columns={[
                {
                  key: 'name',
                  header: 'Band Name',
                  mobile: 'title',
                  cell: (b) => b.name,
                },
                {
                  key: 'rate',
                  header: 'Tax Rate',
                  mobile: 'badge',
                  cell: (b) => `${b.rate}%`,
                },
                {
                  key: 'description',
                  header: 'Description',
                  mobile: 'wide',
                  cell: (b) => b.description,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {success && (
        <div className="inset-0 bg-black bg-opacity-80 w-full h-full rounded-lg flex items-center justify-center z-[70] fixed">
          <SuccessModal
            message={'Tax band created successfully!'}
            subText={'You can now assign this tax band to your branches.'}
            onClose={() => {
              {
                standAloneTaxManagement &&
                  typeof onClose === 'function' &&
                  onClose();
              }
              setSuccess(false);
            }}
            buttonText={'Close'}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
          />
        </div>
      )}
    </div>
  );
};

export default CreateNewTaxBandForm;
