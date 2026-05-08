import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import { getProductPriceAndTaxHistoryByIdService } from '@/services/productsServices';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

const ProductPriceAndTaxHistory = ({
  band,
  setSelectedBand,
  taxAndPriceHistory,
  setTaxAndPriceHistory,
  currencySymbol,
  productData,
  activeTab,
}) => {
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [loadHistoryError, setLoadHistoryError] = React.useState(null);

  // load history data
  React.useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const response = await getProductPriceAndTaxHistoryByIdService(
          productData._id
        );
        if (response.data) {
          setTaxAndPriceHistory(response.data);
        } else if (response.error) {
          setLoadHistoryError(
            response.error ||
              'Error loading product history, please try again later'
          );
        }
      } catch (error) {
        setLoadHistoryError(
          error || 'Error loading product history, please try again later'
        );
        console.error(
          error || 'Error loading product history, please try again later'
        );
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [productData, setTaxAndPriceHistory, setLoadHistoryError]);
  console.log('History data:', taxAndPriceHistory);

  const filterPriceHistoryByBand = (band) => {
    return (taxAndPriceHistory.priceHistory || [])
      .filter((h) => h.band === band)
      .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
  };

  const filterComponentAdditionalPriceHistoryByBand = (additionalPrice) => {
    return (additionalPrice || [])
      .filter((h) => h.band === band?.band)
      .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
  };

  return (
    <div className={`bg-inherit rounded-md z-50 min-h-full`}>
      <span
        onClick={() => setSelectedBand(null)}
        className="flex flex-row hover:underline"
      >
        <FaChevronLeft className="text-brand-green" />
        <FaChevronLeft className="text-brand-green" />
        <span className="text-brand-green ml-1 hover:underline hover:font-bold cursor-pointer">
          back
        </span>
      </span>

      {loadingHistory ? (
        <Spinner />
      ) : (
        <>
          {loadHistoryError ? (
            <div>
              <ErrorInterface error={loadHistoryError} />
            </div>
          ) : (
            <>
              <div className="flex flex-row rounded-md shadow-md w-fit p-3 m-5 gap-5 items-center bg-gray-shadow10">
                {band.band && (
                  <span className="font-mono text-brand-green text-lg">
                    {band.band}:
                  </span>
                )}
                {band.effectiveDate && band.price && (
                  <span className="flex flex-col">
                    <span className="font-mono text-brand-green text-lg">
                      {band?.price
                        ? `${currencySymbol}${band.price.toFixed(2)}`
                        : 'N/A'}
                    </span>
                    <span className="text-xs">current price</span>
                    <span className="text-xs">
                      Effective:{' '}
                      {ISOStringToLocalTime(band.effectiveDate) || '-'}
                    </span>
                  </span>
                )}
              </div>

              {/* History table */}
              {activeTab === 'components-and-price' && (
                <div className="w-full text-text-gray relative max-h-[50%] scroollbar-thin">
                  <h2 className="text-sm text-brand-green mb-2">
                    Price history
                  </h2>
                  <table className="w-full mb-3 my-1">
                    <thead className="sticky top-1">
                      <tr className="bg-gray-shadow10 border-y border-y-gray-border">
                        <th className="p-1 text-left">Base Price</th>
                        <th className="p-1 text-left">Effective Date</th>
                        <th className="p-1 text-left">Set By</th>
                      </tr>
                    </thead>

                    <tbody className="border-b">
                      {filterPriceHistoryByBand(band.band).length > 1 ? (
                        filterPriceHistoryByBand(band.band).map(
                          (bandHistory, idx) => (
                            <tr key={idx} className="">
                              <td className="p-1">
                                {band?.price
                                  ? `${currencySymbol}${band.price.toFixed(2)}`
                                  : 'N/A'}
                              </td>
                              <td className="p-1">
                                {ISOStringToLocalTime(
                                  bandHistory.effectiveDate
                                )}
                              </td>
                              <td className="p-1">
                                {bandHistory.setBy?.fullName || 'unknown'}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-text-gray p-5">
                            No price history available for{' '}
                            {band.band || 'this band'} !!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Components and options price change */}
                  <div className="w-full text-text-gray relative max-h-[50%] scroollbar-thin">
                    <h2 className="text-sm text-brand-green mb-2">
                      Components additional price history
                    </h2>

                    {(taxAndPriceHistory || [])?.components?.length > 0 ? (
                      <div className="">
                        <h2 className="flex flex-row justify-between items-center mb-1">
                          <span className="text-text-gray">
                            {(taxAndPriceHistory || [])?.components?.length}{' '}
                            Components
                          </span>
                        </h2>
                        {(taxAndPriceHistory || [])?.components?.map(
                          (component, index) => (
                            <div key={index} className="p-1 rounded-lg">
                              <div className="border-y w-full p-1 bg-gray-shadow10">
                                <div className="flex flex-row justify-between items-center w-full">
                                  <h3 className="font-semibold">
                                    {component?.categoryName ||
                                      'Unnamed Category'}
                                    {' - '}
                                    {component.isOptional && (
                                      <span className=" text-yellow-400">
                                        (optional)
                                      </span>
                                    )}
                                  </h3>
                                  <span className="text-text-gray">
                                    Alternatives:{' '}
                                    {component?.materialChoices?.length || 0}
                                  </span>
                                </div>
                                <div className="p-2 flex flex-row flex-wrap gap-1">
                                  {component?.materialChoices &&
                                  component?.materialChoices.length > 0 ? (
                                    <>
                                      {component.materialChoices.map(
                                        (materialObj, idx) => (
                                          <table
                                            key={idx}
                                            className="w-full mb-3 my-1"
                                          >
                                            <thead className="sticky top-1 text-sm font-light">
                                              <tr>
                                                <td>
                                                  Item:{' '}
                                                  {materialObj?.material
                                                    ?.name ||
                                                    'Unnamed Material'}
                                                </td>
                                              </tr>
                                              <tr className="text-text-gray text-left">
                                                <td>
                                                  Qty:{' '}
                                                  {materialObj?.quantity || 0}
                                                </td>
                                              </tr>
                                              <tr className="border-y border-y-gray-border font-thin">
                                                <td className="p-1 text-left">
                                                  Additional amount
                                                </td>
                                                <td className="p-1 text-left">
                                                  Effective date
                                                </td>
                                                <td className="p-1 text-left">
                                                  Set By
                                                </td>
                                              </tr>
                                            </thead>

                                            {filterComponentAdditionalPriceHistoryByBand(
                                              materialObj?.additionalPrice
                                            )?.length > 0 ? (
                                              <tbody className="w-full">
                                                {filterComponentAdditionalPriceHistoryByBand(
                                                  materialObj?.additionalPrice
                                                ).map((priceHistory, pIdx) => (
                                                  <tr
                                                    key={pIdx}
                                                    className="text-left text-sm text-text-gray w-full"
                                                  >
                                                    <td className="w-1/3">
                                                      {priceHistory?.price
                                                        ? `+${currencySymbol}${priceHistory.price.toFixed(2)}`
                                                        : `+${currencySymbol}0.00`}
                                                    </td>
                                                    <td className="w-1/3">
                                                      {ISOStringToLocalTime(
                                                        priceHistory?.effectiveDate
                                                      ) || ' - '}
                                                    </td>
                                                    <td className="w-1/3">
                                                      {priceHistory?.setBy
                                                        ?.fullName || ' - '}
                                                    </td>
                                                  </tr>
                                                ))}
                                                {component.materialChoices
                                                  .length -
                                                  1 !==
                                                  idx && (
                                                  <tr className="w-full">
                                                    <td
                                                      colSpan={3}
                                                      className="w-full text-center"
                                                    >
                                                      OR
                                                    </td>
                                                  </tr>
                                                )}
                                              </tbody>
                                            ) : (
                                              <tbody>
                                                <tr>
                                                  <td
                                                    colSpan={3}
                                                    className="text-text-gray p-5"
                                                  >
                                                    No additional price history
                                                    available for{' '}
                                                    {band.band || 'this band'}{' '}
                                                    !!!
                                                  </td>
                                                </tr>
                                              </tbody>
                                            )}
                                          </table>
                                        )
                                      )}
                                    </>
                                  ) : (
                                    <p>No component items available</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-text-gray">
                        No components available for this product.
                      </p>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'tax-details' && <></>}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPriceAndTaxHistory;
