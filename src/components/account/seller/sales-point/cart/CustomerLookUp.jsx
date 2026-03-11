import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import { FaCreditCard } from 'react-icons/fa';

const CustomerLookUp = ({
  mode,
  lightThemeStyle,
  darkThemeStyle,
  customerData,
  customerFetchError,
  setCustomerFetchError,
  setCustomerData,
  setIsOpenCustomerOverlay,
  awaitingScanForCustomer,
  setAwaitingScanForCustomer,
  handleClose,
  loading,
}) => {
  const handleCloseIfNotScanning = (e) => {
    e.stopPropagation();
    if (!customerData._id || loading) {
      setAwaitingScanForCustomer(false);
      setIsOpenCustomerOverlay(false);
      setCustomerFetchError('');
      setCustomerData({});
    }
  };

  return (
    <div
      className={`w-[640px] h-[70vh] flex justify-center items-center opacity-95 rounded-xl p-5 relative ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
      onClick={handleCloseIfNotScanning}
    >
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center rounded-lg">
          <Spinner />
          <span className="mt-4">Loading customer data...</span>
        </div>
      ) : (
        <div>{customerData.email}</div>
      )}

      {awaitingScanForCustomer && (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <span className="flex flex-col justify-center items-center text-lg font-semibold text-center">
            <FaCreditCard className="mr-2 text-9xl" />
            <span className="animate-pulse">Waiting for card scan...</span>
          </span>
        </div>
      )}

      {/* error overlay */}
      {customerFetchError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-opacity-90 font-semibold text-sm rounded-lg p-6">
          <ErrorInterface error={customerFetchError} />
          <button
            className="px-4 py-2 bg-error hover:bg-error-hover text-white rounded"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerLookUp;
