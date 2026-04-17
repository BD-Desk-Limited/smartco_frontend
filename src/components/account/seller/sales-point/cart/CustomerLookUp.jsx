import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  FaArrowDown,
  FaArrowLeft,
  FaCreditCard,
  FaExclamationCircle,
  FaGift,
  FaUserCircle,
} from 'react-icons/fa';
import SelectOfferComponent from './SelectOfferComponent';

const CustomerLookUp = ({
  products,
  setCart,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  appliedOffers,
  setAppliedOffers,
  customerData,
  customerFetchError,
  setCustomerFetchError,
  setCustomerData,
  linkedCustomerData,
  setIsOpenCustomerOverlay,
  awaitingScanForCustomer,
  setAwaitingScanForCustomer,
  loading,
}) => {
  const [tabs, setTabs] = useState({});
  const [openSelectOfferComponent, setOpenSelectOfferComponent] =
    useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleClose = () => {
    setCustomerFetchError('');
    setAwaitingScanForCustomer(false);
    setIsOpenCustomerOverlay(false);
    setCustomerData({});
    setOpenSelectOfferComponent(false);
    setSelectedOffer(null);
    setAppliedOffers([]);
  };

  const handleCloseIfNotScanning = (e) => {
    e.stopPropagation();
    if (!customerData._id || loading) {
      handleClose();
    }
  };

  const getProductDetails = (productId) => {
    return products?.find((product) => product._id === productId);
  };

  const handleLinkCustomerAndClaim = () => {
    //Function to link customer to current sale and apply any relevant claims
    const dataToLink = { ...customerData, appliedOffers: appliedOffers };
    setCart((prevCart) => ({ ...prevCart, linkedCustomer: dataToLink }));
    setIsOpenCustomerOverlay(false);
  };

  const offerIsExpired = (offer) => {
    const currentDate = new Date();
    const expiryDate = new Date(offer.expiryDate);
    return currentDate > expiryDate;
  };

  const handleApplyOffer = (offer, type, productDetails = {}) => {
    if (type === 'cash') {
      if (appliedOffers.some((o) => o._id === offer._id)) {
        return;
      } else {
        setAppliedOffers((prev) => [...prev, { ...offer, type }]);
      }
    } else if (type === 'product') {
      if (appliedOffers.some((o) => o._id === offer._id)) {
        return;
      } else {
        setAppliedOffers((prev) => [
          ...prev,
          { ...offer, type, productDetails },
        ]);
      }
    }
  };

  const handleRemoveAppliedOffer = (offerId) => {
    setAppliedOffers((prev) => prev.filter((offer) => offer._id !== offerId));
  };

  const handleOpenSelectProductOfferComponent = (offer, type) => {
    setOpenSelectOfferComponent(true);
    setSelectedOffer({ ...offer, type });
  };

  // update applied offers in linked customer data when appliedOffers state changes
  React.useEffect(() => {
    if (
      linkedCustomerData?._id === customerData._id &&
      linkedCustomerData?.appliedOffers !== appliedOffers
    ) {
      setCart((prev) => ({
        ...prev,
        linkedCustomer: { ...prev.linkedCustomer, appliedOffers },
      }));
    }
  }, [appliedOffers, customerData, linkedCustomerData, setCart]);

  return (
    <div
      className={`w-[640px] h-[90%] flex justify-center items-center opacity-95 rounded-xl p-5 relative ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
      onClick={handleCloseIfNotScanning}
    >
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center rounded-lg">
          <Spinner />
          <span className="mt-4">Loading customer data...</span>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center rounded-lg">
          {customerData && customerData._id && (
            <div className="w-full">
              {/* customer details and link button */}
              <div className="flex flex-row justify-between h-24 w-full border-b pb-4 rounded-lg">
                <span className="flex flex-row justify-center items-center gap-4 ">
                  {customerData?.imageUrl ? (
                    <Image
                      src={customerData?.imageUrl}
                      alt={customerData.name}
                      width={100}
                      height={100}
                      className="border border-brand-green rounded-lg"
                    />
                  ) : (
                    <FaUserCircle className="text-8xl bg-green-shadow5 rounded-xl p-1" />
                  )}
                  <span>
                    <p className="font-semibold text-lg">{customerData.name}</p>
                    <p className="text-sm p-1 bg-gray-shadow7 rounded-lg font-mono w-fit bg-opacity-50">
                      {customerData?.customerNumber}
                    </p>
                    <p className="">
                      {customerData.lastVisited ? (
                        <span className="flex flex-row justify-center items-baseline gap-1">
                          <span className="text-sm text-text-gray">
                            Last visited:{' '}
                          </span>
                          <span>
                            {new Date(
                              customerData.lastVisited
                            ).toLocaleDateString()}
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-shadow6">
                          No visit history
                        </span>
                      )}
                    </p>
                  </span>
                </span>
                <Button
                  text={
                    linkedCustomerData?._id === customerData._id &&
                    linkedCustomerData?.appliedOffers !== appliedOffers
                      ? 'Update'
                      : 'Link order'
                  }
                  onClick={handleLinkCustomerAndClaim}
                  buttonStyle={`bg-brand-green h-full font-semibold hover:bg-green-shadow3 transition-colors duration-200 `}
                />
              </div>
              <span className="text-brand-green my-2 flex flex-row items-baseline gap-2">
                <FaGift
                  className={`${mode === 'light' ? 'text-black' : 'text-white'} text-lg`}
                />
                <span className="">Available offers & claims</span>
              </span>
              {/* customer available claims */}
              <div className="w-full h-[calc(95%-6rem)] flex flex-col items-center justify-center gap-4 pb-5">
                {customerData.claims && customerData.claims.length > 0 ? (
                  <div className="w-full h-full overflow-y-auto scrollbar-thin">
                    {customerData.claims.map((claim, index) => (
                      <div
                        key={index}
                        className="w-full py-2 px-2 border-y flex flex-col gap-2"
                      >
                        {/* claim type header with toggle */}
                        <span className="font-semibold capitalize text-brand-green flex flex-row justify-between items-center w-full relative">
                          <span className="font-light">
                            {claim.type?.replace('-', ' ')}
                          </span>
                          <span className="flex flex-row items-center gap-2">
                            {/* show number of offers if more than 0 and tab is not open */}
                            {claim?.offers?.length > 0 && !tabs[index] && (
                              <span className="absolute -top-2 -right-2 bg-error rounded-full py-1 px-1.5 text-white text-sm z-10">
                                {claim?.offers?.length}
                              </span>
                            )}
                            {/* toggle arrow */}
                            {tabs[index] ? (
                              <FaArrowDown
                                onClick={() =>
                                  setTabs((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }))
                                }
                                className="mr-4 cursor-pointer"
                              />
                            ) : (
                              <FaArrowLeft
                                onClick={() =>
                                  setTabs((prev) => ({
                                    ...prev,
                                    [index]: true,
                                  }))
                                }
                                className="mr-4 cursor-pointer"
                              />
                            )}
                          </span>
                        </span>
                        {tabs[index] && (
                          <div className="px-3">
                            {claim.offers?.map((offer) => (
                              <div
                                key={offer._id}
                                className="w-full h-auto py-3 flex gap-1 border-b flex-row hover:shadow-brand-green shadow-sm cursor-pointer px-2 justify-between items-center"
                              >
                                {offer.freeProduct && (
                                  <div className="flex flex-row items-center gap-4 mb-2 h-16 w-16 justify-center">
                                    {getProductDetails(offer._id)?.imageURL ? (
                                      <Image
                                        src={
                                          getProductDetails(offer._id)?.imageURL
                                        }
                                        alt={getProductDetails(offer._id)?.name}
                                        width={100}
                                        height={100}
                                        className="rounded-lg"
                                      />
                                    ) : (
                                      <FaGift className="text-3xl mr-2" />
                                    )}
                                  </div>
                                )}
                                <div className="flex flex-col gap-1">
                                  <span className="font-semibold">
                                    {claim?.type}
                                  </span>
                                  <p>{offer.description}</p>
                                  <p className="text-sm text-text-gray">
                                    Expires on:{' '}
                                    {new Date(
                                      offer.expiryDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>

                                <span className="flex flex-col items-end gap-2">
                                  {/* Apply Offer Button */}
                                  {offerIsExpired(offer) ? (
                                    <span className="text-red-500 flex items-center">
                                      <FaExclamationCircle
                                        className={`${mode !== 'light' ? 'text-text-white' : 'text-error'} mr-1`}
                                      />
                                      Expired
                                    </span>
                                  ) : (
                                    <>
                                      <span
                                        className={`bg-green-shadow7 font-thin hover:bg-green-shadow3 text-brand-green transition-colors duration-200 p-1 rounded-md  ${
                                          appliedOffers.some(
                                            (o) => o._id === offer._id
                                          )
                                            ? 'cursor-not-allowed opacity-50'
                                            : 'cursor-pointer'
                                        }`}
                                        onClick={
                                          appliedOffers.some(
                                            (o) => o._id === offer._id
                                          )
                                            ? null
                                            : claim?.type === 'product'
                                              ? () =>
                                                  handleOpenSelectProductOfferComponent(
                                                    offer,
                                                    claim?.type
                                                  )
                                              : () =>
                                                  handleApplyOffer(
                                                    offer,
                                                    claim?.type
                                                  )
                                        }
                                        disabled={appliedOffers.some(
                                          (o) => o._id === offer._id
                                        )}
                                      >
                                        {appliedOffers.some(
                                          (o) => o._id === offer._id
                                        )
                                          ? 'Applied..'
                                          : 'Apply'}
                                      </span>
                                    </>
                                  )}

                                  {/* Remove applied offer button */}
                                  {appliedOffers.some(
                                    (o) => o._id === offer._id
                                  ) && (
                                    <button
                                      className="text-sm text-error hover:font-semibold transition-colors duration-200 p-1 rounded-md"
                                      onClick={() =>
                                        handleRemoveAppliedOffer(offer._id)
                                      }
                                    >
                                      Remove
                                    </button>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-shadow6">
                    No available offers or claims
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {awaitingScanForCustomer && (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <span className="flex flex-col justify-center items-center text-lg font-semibold text-center">
            <FaCreditCard className="mr-2 text-9xl" />
            <span className="animate-pulse">Waiting for card scan...</span>
          </span>
        </div>
      )}
      {/* if offer is a product offer, allow user select allowed product components. Overlay */}
      {openSelectOfferComponent && selectedOffer && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50 rounded-lg">
          <SelectOfferComponent
            onClose={() => setOpenSelectOfferComponent(false)}
            products={products}
            selectedOffer={selectedOffer}
            offerType={'product'}
            handleApplyOffer={handleApplyOffer}
            appliedOffers={appliedOffers}
            setAppliedOffers={setAppliedOffers}
            mode={mode}
            lightThemeStyle={lightThemeStyle}
            darkThemeStyle={darkThemeStyle}
          />
        </div>
      )}
      {/* error overlay */}
      {customerFetchError && (
        <NoCustomerFoundModal
          customerFetchError={customerFetchError}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default CustomerLookUp;

// No customer found modal component
const NoCustomerFoundModal = ({ customerFetchError, handleClose }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-opacity-90 font-semibold text-sm rounded-lg p-6">
      <ErrorInterface error={customerFetchError} />
      <button
        className="px-4 py-2 bg-error hover:bg-error-hover text-white rounded"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );
};
