const TOP_MENU_URL = '/pages/account/admin/my-customers';

const MY_CUSTOMER_SUBMENUS = [
  {
    name: 'my-customers',
    label: 'My Customers',
    link: `${TOP_MENU_URL}`,
  },
  {
    name: 'customer-groups',
    label: 'Customer Groups',
    link: `${TOP_MENU_URL}/customer-groups`,
  },
  {
    name: 'message-customer',
    label: 'Message Customer',
    link: `${TOP_MENU_URL}/message-customer`,
  },
  {
    name: 'customer-rewards',
    label: 'Customer Rewards',
    link: `${TOP_MENU_URL}/customer-rewards`,
  },
];

export default MY_CUSTOMER_SUBMENUS;
