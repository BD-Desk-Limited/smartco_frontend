import { commaNumberFormat } from '@/utilities/numbersUtils';
import React from 'react';

const PurchaseSummary = ({ data }) => {
  const purchaseItems = data?.items;

  const calculateTotalCost = () => {
    const items = purchaseItems || [];
    let total = 0;

    for (const item of items) {
      const cost = Number(item.totalCost);
      if (
        item.totalCost === undefined ||
        item.totalCost === null ||
        Number.isNaN(cost)
      ) {
        return null;
      }
      total += cost;
    }

    return commaNumberFormat(total, 2) || 0.0;
  };

  return (
    <tr className="w-full h-full flex flex-row justify-center items-center gap-5 font-semibold">
      <td>{purchaseItems?.length} Items</td> <td>{`|`}</td>
      <td>Total cost: {calculateTotalCost()}</td>
    </tr>
  );
};

export default PurchaseSummary;
