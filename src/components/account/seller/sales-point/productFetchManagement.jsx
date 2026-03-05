// TODO: Replace with actual API call to fetch products
const sampleProducts = [
  {
    _id: 1,
    name: 'Product 1',
    description: 'Description of Product 1',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 2,
    name: 'Product 2',
    description:
      'Description of Product 2 ugeoigwelug weuikehdfolukdhwol weuhldfuhldkwhedweh woehdlkeuhwloeihwpefi w;hfeiohwlkhfwlefhwleh',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 3,
    name: 'Product 3 ugeoigwelug weuikehdfolukdhwol weuhldfuhldkwhedweh woehdlkeuhwloeihwpefi w;hfeiohwlkhfwlefhwleh lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    description: 'Description of Product 3',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 4,
    name: 'Product 4',
    description: 'Description of Product 4',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 5,
    name: 'Product 5',
    description: 'Description of Product 5',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 6,
    name: 'Product 6',
    description: 'Description of Product 6',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 7,
    name: 'Product 7',
    description: 'Description of Product 7',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 8,
    name: 'Product 8',
    description: 'Description of Product 8',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 9,
    name: 'Product 9',
    description: 'Description of Product 9',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 10,
    name: 'Product 10',
    description: 'Description of Product 10',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 11,
    name: 'Product 11',
    description: 'Description of Product 11',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 12,
    name: 'Product 12',
    description: 'Description of Product 12',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 13,
    name: 'Product 13',
    description: 'Description of Product 13',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 14,
    name: 'Product 14',
    description: 'Description of Product 14',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 15,
    name: 'Product 15',
    description: 'Description of Product 15',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 16,
    name: 'Product 16',
    description: 'Description of Product 16',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 17,
    name: 'Product 17',
    description: 'Description of Product 17',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 18,
    name: 'Product 18',
    description: 'Description of Product 18',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 19,
    name: 'Product 19',
    description: 'Description of Product 19',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 20,
    name: 'Product 20',
    description: 'Description of Product 20',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 21,
    name: 'Product 21',
    description: 'Description of Product 21',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 22,
    name: 'Product 22',
    description: 'Description of Product 22',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
  {
    _id: 23,
    name: 'Product 23',
    description: 'Description of Product 23',
    category: 'Beverages',
    imageURL:
      'https://celebratingsweets.com/wp-content/uploads/2023/02/Small-Batch-Chocolate-Cupcakes-9.jpg',
    barcode: '1234567890',
    components: ['Component A', 'Component B'],
    productTax: [5, 10],
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 24,
    name: 'Product 24',
    description: 'Description of Product 24',
    category: 'Electronics',
    imageURL:
      'https://www.flavourtownbakery.co.uk/cdn/shop/files/Bakers-Mixed-Dozen-Cupcakes-Flavourtown-Bakery.jpg?v=1699965589',
    barcode: '0987654321',
    components: ['Component C', 'Component D'],
    productTax: [8, 12],
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of Stock',
  },
];

const fetchProductsFromAPI = async () => {
  // Simulate API call to fetch products from server, and update indexedDB
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleProducts);
    }, 2000);
  });
};

const fetchProductsFromIndexedDB = async () => {
  // Simulate fetching products from IndexedDB
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleProducts);
    }, 1000);
  });
};

const loadProducts = async () => {
  try {
    // Load products from indexedDB or API based on last refresh time
    const lastRefresh = localStorage.getItem('lastProductRefresh'); // Timestamp of last refresh
    const now = new Date().getTime(); // Current timestamp
    // If last refresh was more than 24 hours ago, fetch from API, otherwise load from indexedDB
    if (!lastRefresh || now - lastRefresh > 24 * 60 * 60 * 1000) {
      const fetchedProducts = await fetchProductsFromAPI();
      localStorage.setItem('lastProductRefresh', now);
      return fetchedProducts;
    } else {
      const indexedDBProducts = await fetchProductsFromIndexedDB();
      return indexedDBProducts;
    }
  } catch (err) {
    console.error('Error loading products:', err);
    throw err;
  }
};

export { fetchProductsFromAPI, fetchProductsFromIndexedDB, loadProducts };
