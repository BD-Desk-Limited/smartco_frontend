const TOP_MENU_URL = '/pages/account/admin/my-customers';

const MY_CUSTOMER_SUBMENUS = [
  {
    name: 'my-customers',
    label: 'My Customers',
    link: `${TOP_MENU_URL}`,
  },
  {
    name: 'customer-rewards',
    label: 'Customer Rewards',
    link: `${TOP_MENU_URL}/customer-rewards`,
  },

  {
    name: 'message-customer',
    label: 'Message Customer',
    link: `${TOP_MENU_URL}/message-customer`,
  },
];

export default MY_CUSTOMER_SUBMENUS;
