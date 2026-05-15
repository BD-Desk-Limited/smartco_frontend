import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React from 'react';

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
      <table className="w-full mb-3 my-1">
        <thead className="sticky top-1">
          <tr className="bg-gray-shadow10 border-y border-y-gray-border">
            <th className="p-1 text-left">Base Price</th>
            <th className="p-1 text-left">Effective Date</th>
            <th className="p-1 text-left">Set By</th>
          </tr>
        </thead>

        <tbody className="border-b">
          {filterPriceHistoryByBand().length > 0 ? (
            filterPriceHistoryByBand().map((bandHistory, idx) => (
              <tr key={idx} className="">
                <td className="p-1">
                  {bandHistory?.price
                    ? `${currencySymbol}${bandHistory.price.toFixed(2)}`
                    : 'N/A'}
                </td>
                <td className="p-1">
                  {ISOStringToLocalTime(bandHistory.effectiveDate)}
                </td>
                <td className="p-1">
                  {bandHistory.setBy?.fullName || 'unknown'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-text-gray p-5">
                No price history available for {band.band || 'this band'} !!!
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
                  <div className="flex flex-row justify-between items-center w-full">
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
                          <table key={idx} className="w-full mb-3 my-1">
                            <thead className="sticky top-1 text-sm font-light">
                              <tr>
                                <td>
                                  Item:{' '}
                                  {materialObj?.material?.name ||
                                    'Unnamed Material'}
                                </td>
                              </tr>
                              <tr className="text-text-gray text-left">
                                <td>Qty: {materialObj?.quantity || 0}</td>
                              </tr>
                              <tr className="border-y border-y-gray-border font-thin">
                                <td className="p-1 text-left">
                                  Additional amount
                                </td>
                                <td className="p-1 text-left">
                                  Effective date
                                </td>
                                <td className="p-1 text-left">Set By</td>
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
                                      {priceHistory?.setBy?.fullName || ' - '}
                                    </td>
                                  </tr>
                                ))}
                                {component.materialChoices.length - 1 !==
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
                                    No additional price history available for{' '}
                                    {band.band || 'this band'} !!!
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </table>
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
