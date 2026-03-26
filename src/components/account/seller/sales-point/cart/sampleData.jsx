// TODO: This is just sample data, replace with actual data from backend when available

const sampleCustomers = [
  {
    _id: '28116303288',
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'johndoe@example.com',
    lastVisited: '2024-05-15T14:48:00.000Z',
    imageUrl: 'https://via.placeholder.com/100',
    claims: [
      {
        type: 'cash',
        offers: [
          {
            _id: 1,
            type: 'discount',
            description: '10% off on next purchase',
            expiryDate: '2024-12-31',
            percentageDiscount: 10,
            amountDiscount: 0,
            status: 'active',
            effectiveDate: '2024-01-01',
          },
          {
            _id: 2,
            type: 'cashback',
            description: ' £5 cashback on next purchase',
            expiryDate: '2026-12-31',
            percentageDiscount: 0,
            amountDiscount: 5,
            status: 'active',
            effectiveDate: '2024-01-01',
          },
        ],
      },
      {
        type: 'product',
        offers: [
          {
            _id: 3,
            description: 'Get a free expresso coffee with your next purchase',
            expiryDate: '2026-12-31',
            status: 'active',
            effectiveDate: '2024-01-01',
            freeProduct: {
              _id: 3,
              quantity: 1,
              allowedComponents: [
                {
                  _id: 1,
                  allowedMaterialChoices: [1, 2],
                },
              ],
            },
          },
          {
            _id: 4,
            description: 'Get a free tote bag with your next purchase',
            expiryDate: '2024-12-31',
            status: 'active',
            effectiveDate: '2024-01-01',
            freeProduct: {
              _id: 2,
              quantity: 2,
              allowedComponents: [
                {
                  _id: 1,
                  allowedMaterialChoices: [4, 5],
                },
                {
                  _id: 6,
                  allowedMaterialChoices: [6, 7],
                },
              ],
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
    lastVisited: '2024-05-10T10:30:00.000Z',
    imageUrl: 'https://via.placeholder.com/100',
    claims: [
      {
        type: 'cash',
        offers: [
          {
            _id: 5,
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
        type: 'product',
        offers: [
          {
            _id: 6,
            description: 'Get a free keychain with your next purchase',
            expiryDate: '2024-12-31',
            status: 'active',
            effectiveDate: '2024-01-01',
            freeProduct: {
              _id: 2,
              quantity: 1,
              allowedComponents: [
                {
                  _id: 1,
                  allowedMaterialChoices: [99, 2, 3],
                },
                {
                  _id: 2,
                  allowedMaterialChoices: [4, 5],
                },
                {
                  _id: 6,
                  allowedMaterialChoices: [6, 7],
                },
              ],
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
