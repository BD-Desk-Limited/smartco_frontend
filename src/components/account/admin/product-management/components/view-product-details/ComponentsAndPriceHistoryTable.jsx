import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React from 'react';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const ComponentsAndPriceHistoryTable = ({
  filterPriceHistoryByBand,
  taxAndPriceHistory,
  filterComponentAdditionalPriceHistoryByBand,
  band,
  currencySymbol,
}) => {
  return (
    <div className="w-full text-text-gray relative max-h-[50%] scroollbar-thin">
      <h2 className="text-sm text-brand-green mb-2">Price history</h2>
      <ResponsiveTable
        className="mb-3 my-1"
        align="left"
        dense
        maxHeightClass=""
        rows={filterPriceHistoryByBand()}
        getRowKey={(_, i) => i}
        emptyMessage={`No price history available for ${band.band || 'this band'} !!!`}
        columns={[
          {
            key: 'price',
            header: 'Base Price',
            mobile: 'title',
            cell: (h) =>
              h?.price ? `${currencySymbol}${h.price.toFixed(2)}` : 'N/A',
          },
          {
            key: 'date',
            header: 'Effective Date',
            mobile: 'subtitle',
            cell: (h) => ISOStringToLocalTime(h.effectiveDate),
          },
          {
            key: 'setBy',
            header: 'Set By',
            cell: (h) => h.setBy?.fullName || 'unknown',
          },
        ]}
      />

      {/* Components and options price change */}
      <div className="w-full text-text-gray relative max-h-[50%] scroollbar-thin">
        <h2 className="text-sm text-brand-green mb-2">
          Components additional price
        </h2>

        {(taxAndPriceHistory || [])?.components?.length > 0 ? (
          <div className="">
            <h2 className="flex flex-row justify-between items-center mb-1">
              <span className="text-text-gray">
                {(taxAndPriceHistory || [])?.components?.length} Components
              </span>
            </h2>
            {(taxAndPriceHistory || [])?.components?.map((component, index) => (
              <div key={index} className="p-1 rounded-lg">
                <div className="border-y w-full p-1 bg-gray-shadow10">
                  <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full">
                    <h3 className="font-semibold">
                      {component?.categoryName || 'Unnamed Category'}
                      {' - '}
                      {component.isOptional && (
                        <span className=" text-yellow-400">(optional)</span>
                      )}
                    </h3>
                    <span className="text-text-gray">
                      Alternatives: {component?.materialChoices?.length || 0}
                    </span>
                  </div>
                  <div className="p-2 flex flex-row flex-wrap gap-1">
                    {component?.materialChoices &&
                    component?.materialChoices.length > 0 ? (
                      <>
                        {component.materialChoices.map((materialObj, idx) => (
                          <div key={idx} className="w-full mb-3 my-1 text-sm">
                            <p>
                              Item:{' '}
                              {materialObj?.material?.name || 'Unnamed Material'}
                            </p>
                            <p className="text-text-gray mb-1">
                              Qty: {materialObj?.quantity || 0}
                            </p>
                            <ResponsiveTable
                              align="left"
                              dense
                              maxHeightClass=""
                              rows={
                                filterComponentAdditionalPriceHistoryByBand(
                                  materialObj?.additionalPrice
                                ) || []
                              }
                              getRowKey={(_, i) => i}
                              emptyMessage={`No additional price history available for ${band.band || 'this band'} !!!`}
                              columns={[
                                {
                                  key: 'amount',
                                  header: 'Additional amount',
                                  mobile: 'title',
                                  cell: (h) =>
                                    h?.price
                                      ? `+${currencySymbol}${h.price.toFixed(2)}`
                                      : `+${currencySymbol}0.00`,
                                },
                                {
                                  key: 'date',
                                  header: 'Effective date',
                                  mobile: 'subtitle',
                                  cell: (h) =>
                                    ISOStringToLocalTime(h?.effectiveDate) || ' - ',
                                },
                                {
                                  key: 'setBy',
                                  header: 'Set By',
                                  cell: (h) => h?.setBy?.fullName || ' - ',
                                },
                              ]}
                            />
                            {component.materialChoices.length - 1 !== idx && (
                              <p className="w-full text-center py-1">OR</p>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <p>No component items available</p>
                    )}
                  </div>
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
  );
};

export default ComponentsAndPriceHistoryTable;
