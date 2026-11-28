// Tabs of the Sales Performance report. `ready: false` tabs show a "coming soon" note until built.
import TotalSales from './total-sales/TotalSales';
import ScheduledOrders from './scheduled-orders-report/ScheduledOrders';

// The component for each ready tab is mapped in SalesReports.jsx (REPORT_COMPONENTS).
export const SALES_REPORT_NAVS = [
  {
    name: 'total-sales',
    label: 'Total Sales',
    ready: true,
    component: TotalSales,
  },
  {
    name: 'scheduled-orders',
    label: 'Scheduled Orders',
    ready: true,
    component: ScheduledOrders,
  },
  { name: 'sales-by-product', label: 'Sales by Product', ready: false },
  {
    name: 'sales-by-payment-type',
    label: 'Sales by Payment Type',
    ready: false,
  },
  { name: 'sales-by-seller', label: 'Sales by Seller', ready: false },
  { name: 'daily-sales', label: 'Daily Sales', ready: false },
  { name: 'sales-by-month', label: 'Sales by Month', ready: false },
  { name: 'sales-by-shift', label: 'Sales by Shift', ready: false },
  {
    name: 'sales-by-category',
    label: 'Sales by Product Category',
    ready: false,
  },
  { name: 'sales-by-branch', label: 'Sales by Branches', ready: false },
];
