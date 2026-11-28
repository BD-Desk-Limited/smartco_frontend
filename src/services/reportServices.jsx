'use client';

// Reports page (admin, Reports access). One function per report tab.
const API = process.env.NEXT_PUBLIC_API_URL;

const post = async (path, body) => {
  try {
    const response = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload.data };
    return {
      error: payload?.message || 'Could not load the report, please try again',
    };
  } catch (error) {
    console.error('Report request failed:', error);
    return {
      error: 'Network error, please check your connection and try again',
    };
  }
};

// filters: { from, to, branchIds: [] (empty = all), compare: null | { from, to } }, dates 'YYYY-MM-DD'
const toBody = ({ from, to, branchIds = [], compare }) => ({
  from,
  to,
  ...(branchIds.length ? { branchIds } : {}),
  ...(compare ? { compare: { from: compare.from, to: compare.to } } : {}),
});

// -> { totals: { totalSales, transactionCount, averagePerTransaction, branchesWithSales, branchCount },
//      compareTotals (null without compare), change (% per figure, null without compare),
//      cash: { totalSales, depositsReceived, depositsApplied, refundsPaid, expectedCollections,
//              actualCollections, difference, heldForScheduledOrders: { count, paid, ... } },
//      currency, filters: { branches } }
export const fetchTotalSalesReportService = (filters) =>
  post('/reports/sales/total', toBody(filters));

// Scheduled orders for the period (no comparison):
// -> { reconciliation, collectionsByMethod, openAtEnd, cancelledInPeriod, currency, filters }
export const fetchScheduledOrdersReportService = (filters) =>
  post(
    '/reports/sales/scheduled-orders',
    toBody({ ...filters, compare: null })
  );

// The scheduled orders list: open and needing a refund whatever their date, plus orders cancelled or
// refunded in the period. List options (all optional):
//   listBranchIds: [] narrows the list to some of the report's branches ([] = all of them)
//   status: 'all' | 'scheduled' | 're-scheduled' | 'cancelled' | 'refunded' | 'needs-refund'
//   page (from 1), pageSize (max 100), all: true for every row (export)
// -> { orders (one page), pagination: { page, pageSize, total, totalPages }, statusCounts,
//      summary: { open, overdue, held } (the report's branches), canManage, currency, truncated, filters }
export const fetchOpenScheduledOrdersService = ({
  listBranchIds = [],
  status = 'all',
  page = 1,
  pageSize,
  all = false,
  ...filters
}) =>
  post('/reports/sales/scheduled-orders/open', {
    ...toBody(filters),
    ...(listBranchIds.length ? { listBranchIds } : {}),
    status,
    page,
    ...(pageSize ? { pageSize } : {}),
    ...(all ? { all: true } : {}),
  });
