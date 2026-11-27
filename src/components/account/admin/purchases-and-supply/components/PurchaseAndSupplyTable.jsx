import React from 'react';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { capitalizeFirst } from '@/utilities/stringUtils';
import ResponsiveTable from '../../ui/ResponsiveTable';

const PurchaseAndSupplyTable = ({
  allPurchases,
  STATUS_OPTIONS,
  formatDate,
  setSelectedOrder,
}) => {
  const statusBadge = (purchase) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === purchase.status);
    return (
      <span
        className={`inline-block px-3 py-1 md:px-4 md:py-2 border border-gray-shadow8 rounded-lg text-xs md:text-sm whitespace-nowrap ${option?.color || 'bg-gray-500 text-text-white'}`}
      >
        {option?.label ||
          (purchase.status ? capitalizeFirst(purchase.status) : '-')}
      </span>
    );
  };

  const columns = [
    {
      key: 'id',
      header: 'Order I D',
      align: 'left',
      mobile: 'title',
      cell: (p) => p.purchaseID || '-',
    },
    {
      key: 'supplier',
      header: 'Supplier',
      mobile: 'subtitle',
      cell: (p) => (
        <>
          {p.supplierName || 'N/A'} {p.isOpenMarket && '(Open Market)'}
        </>
      ),
    },
    {
      key: 'branch',
      header: 'Branch',
      cell: (p) => p.receivingBranch?.name || 'N/A',
    },
    {
      key: 'date',
      header: 'Date',
      cell: (p) => (p.supplyDate ? formatDate(new Date(p.supplyDate)) : '-'),
    },
    {
      key: 'expected',
      header: 'Expected Delivery',
      mobileLabel: 'Expected',
      cell: (p) =>
        p.expectedDelivery ? formatDate(new Date(p.expectedDelivery)) : '-',
    },
    {
      key: 'total',
      header: 'Total Amount',
      mobileLabel: 'Total',
      cell: (p) => (p.totalCost != null ? commaNumberFormat(p.totalCost, 2) : '-'),
    },
    {
      key: 'status',
      header: 'Status',
      mobile: 'badge',
      cell: statusBadge,
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      rows={allPurchases || []}
      getRowKey={(p) => p._id}
      onRowClick={setSelectedOrder}
      emptyMessage="No purchase record found for this period."
    />
  );
};

export default PurchaseAndSupplyTable;
