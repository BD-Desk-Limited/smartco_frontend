import Header from '@/components/account/Header';
import React from 'react';
import AdminSideBar from '../../AdminSideBar';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import PageDescription from '@/components/account/PageDescription';
import { TAX_MANAGEMENT_SUB_MENUS } from './TaxManagementSideBarItems';
import EditTaxBandForm from './EditTaxBandForm';
import SuccessModal from '@/components/account/SuccessModal';
import { verifyInputText } from '@/utilities/verifyInput';
import WarningWithFeedbackModal from '@/components/account/WarningWithFeedbackModal';
import { updateTaxBand } from '@/services/taxBandServices';

const EditTaxBand = ({
  taxbandData,
  setTaxbandData,
  selectedMenu,
  setSelectedMenu,
  pageDescription,
}) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [newTaxBand, setNewTaxBand] = React.useState(taxbandData);

  const [updateRate, setUpdateRate] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [openWarningModal, setOpenWarningModal] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [inputValidationErrors, setInputValidationErrors] = React.useState([]);
  const dateNowToDateTime =
    new Date().toISOString().slice(0, 16).toLocaleString('sv-SE', {
      timeZone: 'UTC',
    }) || new Date();

  const runValidationAndOpenWarningModal = () => {
    setInputValidationErrors([]);

    let errorsCollected = [];
    //validate input
    const handleValidation = (input, message) => {
      if (!input) {
        return;
      } else {
        const verifyInput = verifyInputText(input);
        if (!verifyInput.passed) {
          console.log(
            'Input validation failed for:',
            input,
            'Message:',
            message
          );
          errorsCollected.push(verifyInput.message + ' ' + message);
        }
      }
    };

    // Validate all inputs and collect error messages
    if (!newTaxBand.name) {
      errorsCollected.push('Please enter a valid name for the tax band');
    }
    if (updateRate && !newTaxBand?.effectiveRate?.rate) {
      errorsCollected.push('Please enter a valid rate for the tax band');
    }
    if (!newTaxBand.description) {
      errorsCollected.push('Please enter a valid description for the tax band');
    }

    if (
      updateRate &&
      newTaxBand?.effectiveRate?.effectiveDate < dateNowToDateTime
    ) {
      errorsCollected.push('Effective date cannot be in the past.');
    }

    handleValidation(
      newTaxBand.name,
      'For tax band name, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.'
    );
    handleValidation(
      newTaxBand?.effectiveRate?.rate,
      'For tax band rate, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.'
    );
    handleValidation(
      newTaxBand.description,
      'For tax band description, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.'
    );

    if (errorsCollected.length > 0) {
      console.log('Validation errors:', errorsCollected);
      setInputValidationErrors(errorsCollected);
      return;
    } else {
      setOpenWarningModal(true);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setInputValidationErrors([]);
    setSuccess(false);

    const dataToSubmit = {
      updateRate: updateRate,
      _id: taxbandData._id,
      ...newTaxBand,
    };
    setLoading(true);
    try {
      const response = await updateTaxBand(dataToSubmit);

      if (response.error) {
        setError(
          response.error ||
            'An error occurred while updating the tax band, please try again later..'
        );
        return;
      }

      if (response.data) {
        setNewTaxBand(response.data);
        setUpdateRate(false);
        setTaxbandData(response.data);
        setError(null);
        closeAllModals();
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError(
        'An error occurred while updating the tax band. Please try again later.'
      );
    } finally {
      setLoading(false);
      setInputValidationErrors([]);
    }
  };

  const closeAllModals = () => {
    setOpenWarningModal(false);
    setError(null);
    setInputValidationErrors([]);
  };

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full w-full overflow-hidden">
      <div>
        <AdminSideBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>

      <div className="flex flex-col h-screen overflow-y-auto no-scrollbar w-full relative">
        <div className="w-full sticky top-0 z-50">
          <Header />
        </div>
        <div className="w-full">
          <SubHeader title={'Update Tax band'} />
        </div>
        <div className="flex flex-row gap-0 w-full h-full relative">
          <div className="min-w-fit">
            <SideBar
              selectedSubMenu="create-tax-band"
              sideBarSubmenus={TAX_MANAGEMENT_SUB_MENUS}
              isOpen={openSidebar}
              setIsOpen={setOpenSidebar}
            />
          </div>
          <div className="flex flex-col h-full w-full">
            <div className="bg-white p-5 h-full w-full">
              <EditTaxBandForm
                taxbandData={taxbandData}
                loading={loading}
                error={
                  inputValidationErrors.length > 0
                    ? inputValidationErrors[0]
                    : null
                }
                newTaxBand={newTaxBand}
                updateRate={updateRate}
                setUpdateRate={setUpdateRate}
                setNewTaxBand={setNewTaxBand}
                dateNowToDateTime={dateNowToDateTime}
                onSubmit={(e) => {
                  e.preventDefault();
                  runValidationAndOpenWarningModal();
                }}
              />
            </div>
            <div className="sticky bottom-0 w-full">
              <PageDescription pageDescription={pageDescription} />
            </div>
          </div>
        </div>
      </div>
      {/* Success modal for tax band update */}
      {success && (
        <div className="inset-0 bg-black bg-opacity-80 w-full h-full flex items-center justify-center z-50 absolute">
          <SuccessModal
            title={'Success!'}
            message={'Success!'}
            subText={'The tax band has been updated successfully.'}
            onClose={() => setSuccess(false)}
            buttonText={'Close'}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
          />
        </div>
      )}

      {/* Warning modal for updating tax band */}
      {openWarningModal && (
        <div className="inset-0 bg-black bg-opacity-80 w-full h-full flex items-center justify-center z-50 absolute">
          <WarningWithFeedbackModal
            title={`Warning!`}
            warningMessage={'Are you sure you want to update this tax band?'}
            subText={
              'Updating the tax band will affect the products in the branches associated with this tax band.'
            }
            responseMessages={
              success ? ['Tax band updated successfully.'] : null
            }
            responseErrors={error ? [error] : null}
            onConfirm={handleSubmit}
            onClose={closeAllModals}
            confirmationText={'Update'}
            cancelText={'Cancel'}
            loading={loading}
            button2Style={`bg-yellow-500 text-text-white p-2 rounded-lg hover:bg-yellow-300 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
          />
        </div>
      )}
    </div>
  );
};

export default EditTaxBand;
