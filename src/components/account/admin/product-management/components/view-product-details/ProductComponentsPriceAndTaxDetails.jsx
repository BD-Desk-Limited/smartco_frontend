import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React from 'react';
import ProductPriceHistory from './ProductPriceHistory';
import Spinner from '@/components/account/common/Spinner';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const ProductComponentsPriceAndTaxDetails = ({ productData, loading }) => {
  const [activeTab, setActiveTab] = React.useState('components-and-price');
  const [currencySymbol, setCurrencySymbol] = React.useState('');
  const [selectedBand, setSelectedBand] = React.useState(null);
  const [taxAndPriceHistory, setTaxAndPriceHistory] = React.useState({
    priceHistory: [],
    components: [],
  });

  const tabs = [
    { label: 'Components and Prices', value: 'components-and-price' },
    { label: 'Tax Details', value: 'tax-details' },
  ];

  // Update currency symbol when productData changes
  React.useEffect(() => {
    const symbol = productData?.company_id?.currency?.symbol || '';
    setCurrencySymbol(symbol);
  }, [productData]);

  const getBaseTax = (rate, basePrice) => {
    // calculate base tax based on tax band rate and base price
    return `${currencySymbol}${((rate / 100) * basePrice).toFixed(2)}`;
  };

  const getAdditionalTax = (tax, basePrice) => {
    // calculate additional tax based on additional tax rate and base price
    const amountFromTax = (tax?.taxPercentage / 100) * basePrice;
    const additionalAmount = tax?.additionalTaxAmount || 0;
    return (
      <span>
        {amountFromTax > 0 && (
          <>
            {currencySymbol}
            {amountFromTax?.toFixed(2)}
            <em className="text-error text-sm">({tax?.taxPercentage}%) </em> +
          </>
        )}{' '}
        {currencySymbol}
        {additionalAmount?.toFixed(2)}
      </span>
    );
  };

  const getTotalTax = (tax, basePrice) => {
    const amountFromTax = (tax.taxDetails?.taxPercentage / 100) * basePrice;
    const additionalAmount = tax?.taxDetails?.additionalTaxAmount || 0;
    const baseTax = (tax?.taxBand?.rates?.rate / 100) * basePrice;
    const totalTax = amountFromTax + additionalAmount + baseTax;
    return totalTax.toFixed(2) || 0;
  };

  const getNetPrice = (basePrice, totalTax) => {
    const netPrice = basePrice - totalTax;
    return `${currencySymbol}${netPrice.toFixed(2)}`;
  };

  return (
    <>
      {!loading ? (
        <div className="text-sm">
          {/* Navigation Tabs */}
          <div className="flex flex-row gap-4 mb-4 border-b overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`py-2 text-sm font-semibold whitespace-nowrap shrink-0 ${activeTab === tab.value ? 'text-brand-green border-b-2 border-brand-green' : 'bg-transparent text-text-gray'} hover:border-b-2 transition`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'components-and-price' && (
              <>
                {!selectedBand ? (
                  <div>
                    <h2 className="text-sm text-brand-green mb-4">
                      Components and Price Details by price bands
                    </h2>
                    <div>
                      {/* Base prices of product by bands */}
                      <div>
                        <p className="font-semibold">
                          Base prices of product by bands:
                        </p>
                        {productData?.pricing?.length > 0 ? (
                          <div className="w-full text-text-gray">
                            <ResponsiveTable
                              className="mb-3 my-1"
                              align="left"
                              dense
                              maxHeightClass=""
                              rows={productData.pricing}
                              getRowKey={(_, i) => i}
                              onRowClick={(band) => setSelectedBand(band)}
                              columns={[
                                {
                                  key: 'band',
                                  header: 'Price Band',
                                  mobile: 'title',
                                  cell: (band) => band?.band || 'Unnamed Band',
                                },
                                {
                                  key: 'price',
                                  header: 'Base Price',
                                  mobile: 'badge',
                                  cell: (band) =>
                                    band?.price
                                      ? `${currencySymbol}${band.price.toFixed(2)}`
                                      : 'N/A',
                                },
                                {
                                  key: 'date',
                                  header: 'Effective Date',
                                  cell: (band) =>
                                    ISOStringToLocalTime(band.effectiveDate),
                                },
                                {
                                  key: 'setBy',
                                  header: 'Set By',
                                  cell: (band) =>
                                    band.setBy?.fullName || 'unknown',
                                },
                              ]}
                            />
                            <p className="text-xs text-text-gray">
                              Tap a band to see its price history.
                            </p>
                          </div>
                        ) : (
                          <p className="text-text-gray">
                            No price bands available for this product.
                          </p>
                        )}
                      </div>

                      {productData?.components?.length > 0 ? (
                        <div className="">
                          <h2 className="flex flex-row justify-between items-center mb-1">
                            <span className="font-semibold">
                              Components and Price Details for options
                            </span>
                            <span className="text-text-gray">
                              {productData.components.length} Components
                            </span>
                          </h2>
                          {productData.components.map((component, index) => (
                            <div key={index} className="mb-3 p-3 rounded-lg">
                              <div className="border w-full p-1">
                                <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full">
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
                                <ul className="mt-2 p-3 flex flex-row flex-wrap gap-1">
                                  {component?.materialChoices &&
                                  component?.materialChoices.length > 0 ? (
                                    component.materialChoices.map(
                                      (material, idx) => (
                                        <li
                                          key={idx}
                                          className="flex flex-row items-center"
                                        >
                                          <span className="border p-2 rounded-lg flex flex-col gap-1">
                                            <span>
                                              {material?.material?.name ||
                                                'Unnamed Material'}
                                            </span>
                                            <span className="text-text-gray">
                                              Qty: {material?.quantity || 0}
                                            </span>
                                            <span>
                                              <span className="text-xs font-semibold text-text-gray">
                                                Additional price for
                                                alternatives
                                              </span>
                                              <span>
                                                {material.additionalPrice
                                                  ?.length > 0 &&
                                                  material.additionalPrice.map(
                                                    (priceBand, pIdx) => (
                                                      <span
                                                        key={pIdx}
                                                        className="flex flex-row gap-1 text-sm text-text-gray justify-between"
                                                      >
                                                        <span>
                                                          {priceBand?.band ||
                                                            'Unnamed Band'}
                                                        </span>
                                                        <span>
                                                          {priceBand?.price
                                                            ? `+${currencySymbol}${priceBand.price.toFixed(2)}`
                                                            : `+${currencySymbol}0.00`}
                                                        </span>
                                                      </span>
                                                    )
                                                  )}
                                              </span>
                                            </span>
                                          </span>
                                          {component.materialChoices.length -
                                            1 !==
                                            idx && (
                                            <span className="mx-1"> or </span>
                                          )}
                                        </li>
                                      )
                                    )
                                  ) : (
                                    <li>No materials available</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-text-gray">
                          No components available for this product.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <ProductPriceHistory
                    band={selectedBand}
                    setSelectedBand={setSelectedBand}
                    taxAndPriceHistory={taxAndPriceHistory}
                    setTaxAndPriceHistory={setTaxAndPriceHistory}
                    currencySymbol={currencySymbol}
                    productData={productData}
                    activeTab={activeTab}
                  />
                )}
              </>
            )}
            {activeTab === 'tax-details' && (
              <div>
                <h2 className="text-sm text-brand-green mb-4">
                  Product Tax Details by price band
                </h2>
                <div className="w-full text-text-gray">
                  {productData?.productTax?.length > 0 ? (
                    <>
                      {productData?.productTax?.map((tax) => (
                        <div
                          key={tax?.taxBand?._id}
                          className="mb-2 p-2 border-b"
                        >
                          <div className="flex flex-row flex-wrap gap-2 items-center justify-between mb-2">
                            <h3 className="font-semibold">
                              {`${tax?.taxBand?.name} branch(es)` ||
                                'Unnamed Tax Band'}
                            </h3>
                            {tax?.isTaxExcluded && (
                              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                                Tax Excluded
                              </span>
                            )}
                          </div>

                          {tax?.isTaxExcluded ? (
                            <p className="text-sm italic text-text-gray p-2 bg-gray-100 rounded">
                              This product is exempt from all taxes in this tax
                              band.
                            </p>
                          ) : productData?.pricing?.length > 0 ? (
                            <ResponsiveTable
                              className="mb-3 my-1"
                              align="left"
                              dense
                              maxHeightClass=""
                              rows={productData?.pricing || []}
                              getRowKey={(_, i) => i}
                              onRowClick={(band) => setSelectedBand(band)}
                              columns={[
                                {
                                  key: 'band',
                                  header: 'Price Band',
                                  mobile: 'title',
                                  cell: (band) => band?.band || 'Unnamed Band',
                                },
                                {
                                  key: 'baseTax',
                                  header: `Base tax (${tax?.taxBand?.rates?.rate}%)`,
                                  cell: (band) =>
                                    `${getBaseTax(tax.taxBand?.rates?.rate || 0, band?.price || 0)} `,
                                },
                                {
                                  key: 'additionalTax',
                                  header: 'Product Additional tax',
                                  mobileLabel: 'Additional tax',
                                  cell: (band) =>
                                    getAdditionalTax(
                                      tax.taxDetails,
                                      band?.price
                                    ) || 0,
                                },
                                {
                                  key: 'totalTax',
                                  header: 'Total tax',
                                  cell: (band) =>
                                    `${currencySymbol}${getTotalTax(tax, band?.price) || 0}`,
                                },
                                {
                                  key: 'net',
                                  header: 'Net Price',
                                  cell: (band) =>
                                    `${getNetPrice(band?.price, getTotalTax(tax, band?.price)) || 0}`,
                                },
                                {
                                  key: 'gross',
                                  header: 'Gross Price',
                                  mobile: 'badge',
                                  cell: (band) =>
                                    `${currencySymbol}${band?.price.toFixed(2)}` ||
                                    'N/A',
                                },
                              ]}
                            />
                          ) : (
                            <p> No pricing bands available in this tax band.</p>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-text-gray">
                      No tax details available for this product.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default ProductComponentsPriceAndTaxDetails;
