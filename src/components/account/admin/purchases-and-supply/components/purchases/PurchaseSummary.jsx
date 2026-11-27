import { commaNumberFormat } from '@/utilities/numbersUtils';
import React from 'react';

// asRow: a <tr> for the table footer (default); false gives a plain block (phone list).
const PurchaseSummary = ({ data, asRow = true }) => {
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

  if (!asRow) {
    return (
      <div className="w-full flex flex-row justify-between items-center gap-3 font-semibold text-text-black">
        <span>{purchaseItems?.length} Items</span>
        <span>Total cost: {calculateTotalCost()}</span>
      </div>
    );
  }

  return (
    <tr className="w-full h-full flex flex-row justify-center items-center gap-5 font-semibold">
      <td>{purchaseItems?.length} Items</td>
      <td>{`|`}</td>
      <td>Total cost: {calculateTotalCost()}</td>
    </tr>
  );
};

export default PurchaseSummary;
