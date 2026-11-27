const BASE_URL = '/pages/account/admin/reports';

// Left (green) menu of the Reports page. Add the other report groups here as they are built
// (Inventory, Production, Revenue and Profit, Customer Behaviour, Sales Forecasting).
export const REPORTS_SUBMENUS = [
  {
    name: 'sales-reports',
    label: 'Sales Reports',
    link: BASE_URL,
  },
  {
    name: 'profit-reports',
    label: 'Profit Reports',
    link: BASE_URL,
  },
  {
    name: 'inventory-reports',
    label: 'Inventory Reports',
    link: BASE_URL,
  },
  {
    name: 'customer-reports',
    label: 'Customer Reports',
    link: BASE_URL,
    /* ---speed of service under here, pending order effect, void, scheduled order fulfilment rate */
  },
  {
    name: 'staff-reports',
    label: 'Staff Reports',
    link: BASE_URL,
  },
];
