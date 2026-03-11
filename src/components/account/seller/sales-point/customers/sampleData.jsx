// TODO: This is just sample data, replace with actual data from backend when available

const sampleCustomers = [
  {
    _id: '28116303288',
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'johndoe@example.com',
    claims: [
      {
        type: 'cash-discount',
        offers: [
          {
            id: 1,
            type: 'Discount',
            description: '10% off on next purchase',
            expiryDate: '2024-12-31',
            percentageDiscount: 10,
            amountDiscount: 0,
            status: 'active',
            effectiveDate: '2024-01-01',
          },
          {
            id: 2,
            type: 'Cashback',
            description: ' £5 cashback on next purchase',
            expiryDate: '2024-12-31',
            percentageDiscount: 0,
            amountDiscount: 5,
            status: 'active',
            effectiveDate: '2024-01-01',
          },
        ],
      },
      {
        type: 'free-product',
        offers: [
          {
            id: 3,
            type: 'Free Product',
            description: 'Get a free coffee mug with your next purchase',
            expiryDate: '2024-12-31',
            status: 'active',
            effectiveDate: '2024-01-01',
            freeProduct: {
              id: 101,
              quantity: 1,
            },
          },
          {
            id: 4,
            type: 'Free Product',
            description: 'Get a free tote bag with your next purchase',
            expiryDate: '2024-12-31',
            status: 'active',
            effectiveDate: '2024-01-01',
            freeProduct: {
              id: 102,
              quantity: 1,
            },
          },
        ],
      },
    ],
  },
  {
    _id: 'cus-002',
    name: 'Jane Smith',
    phone: '987-654-3210',
    email: 'janesmith@example.com',
    claims: [
      {
        type: 'cash-discount',
        offers: [
          {
            id: 5,
            type: 'Discount',
            description: '15% off on next purchase',
            expiryDate: '2024-12-31',
            percentageDiscount: 15,
            amountDiscount: 0,
            status: 'active',
            effectiveDate: '2024-01-01',
          },
        ],
      },
      {
        type: 'free-product',
        offers: [
          {
            id: 6,
            type: 'Free Product',
            description: 'Get a free keychain with your next purchase',
            expiryDate: '2024-12-31',
            status: 'active',
            effectiveDate: '2024-01-01',
            freeProduct: {
              id: 103,
              quantity: 1,
            },
          },
        ],
      },
    ],
  },
];

//simulate fetching of customer data by passing id as parameter
const fetchCustomerData = (id) => {
  const userData = sampleCustomers.find(
    (cus) => cus._id === id || cus.email === id || cus.phone === id
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: userData || null,
        error: userData ? null : 'Customer not found',
      });
    }, 2000);
  });
};

export { sampleCustomers, fetchCustomerData };
