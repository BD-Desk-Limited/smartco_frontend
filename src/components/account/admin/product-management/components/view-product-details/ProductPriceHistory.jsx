import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import { getProductPriceHistoryByIdService } from '@/services/productsServices';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import ComponentsAndPriceHistoryTable from './ComponentsAndPriceHistoryTable';

const ProductPriceHistory = ({
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
        const response = await getProductPriceHistoryByIdService(
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

  const filterPriceHistoryByBand = () => {
    return (taxAndPriceHistory.priceHistory || [])
      .filter((h) => h.band === band.band)
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
                <ComponentsAndPriceHistoryTable
                  filterComponentAdditionalPriceHistoryByBand={
                    filterComponentAdditionalPriceHistoryByBand
                  }
                  filterPriceHistoryByBand={filterPriceHistoryByBand}
                  taxAndPriceHistory={taxAndPriceHistory}
                  band={band}
                  currencySymbol={currencySymbol}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPriceHistory;
