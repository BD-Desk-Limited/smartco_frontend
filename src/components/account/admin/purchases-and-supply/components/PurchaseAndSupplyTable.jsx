import React from 'react';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { capitalizeFirst } from '@/utilities/stringUtils';

const PurchaseAndSupplyTable = ({
  allPurchases,
  STATUS_OPTIONS,
  formatDate,
  setSelectedOrder,
}) => {
  return (
    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
      <table className="w-full">
        {/** table header */}
        <thead className="sticky top-0 bg-white">
          <tr className="text-left bg-gray-shadow10 text-sm text-text-gray">
            <th className="px-4 py-4 border border-gray-shadow8">Order I D</th>
            <th className="px-4 py-4 text-center border border-gray-shadow8">
              Branch
            </th>
            <th className="px-4 py-4 text-center border border-gray-shadow8">
              Supplier
            </th>
            <th className="px-4 py-4 text-center border border-gray-shadow8">
              Date
            </th>
            <th className="px-4 py-4 text-center border border-gray-shadow8">
              Expected Delivery
            </th>
            <th className="px-4 py-4 text-center border border-gray-shadow8">
              Total Amount
            </th>
            <th className="px-4 py-4 text-center border border-gray-shadow8">
              Status
            </th>
          </tr>
        </thead>

        {/** table body */}
        <tbody className="text-text-gray">
          {allPurchases.length > 0 ? (
            <>
              {allPurchases?.map((purchase) => (
                <tr
                  key={purchase._id}
                  onClick={() => setSelectedOrder(purchase)}
                  className="border-b border-gray-border text-sm py-5 cursor-pointer hover:bg-gray-shadow10"
                >
                  <td className="px-4 py-3">{purchase.purchaseID || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    {purchase.receivingBranch?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {purchase.supplierName || 'N/A'}{' '}
                    {purchase.isOpenMarket && '(Open Market)'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {purchase.supplyDate
                      ? formatDate(new Date(purchase.supplyDate))
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {purchase.expectedDelivery
                      ? formatDate(new Date(purchase.expectedDelivery))
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {purchase.totalCost != null
                      ? commaNumberFormat(purchase.totalCost, 2)
                      : '-'}
                  </td>
                  <td className="p-1 flex items-center justify-center">
                    <button
                      className={`px-4 py-2 border border-gray-shadow8 ${STATUS_OPTIONS.find((opt) => opt.value === purchase.status)?.color || 'bg-gray-500 text-text-white'} rounded-lg`}
                    >
                      {STATUS_OPTIONS.find(
                        (opt) => opt.value === purchase.status
                      )?.label ||
                        (purchase.status
                          ? capitalizeFirst(purchase.status)
                          : '-')}
                    </button>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr className="text-center text-text-gray h-[40vh]">
              <td className="font-semibold" colSpan={6}>
                No purchase record found for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseAndSupplyTable;
