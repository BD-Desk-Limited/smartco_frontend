// TODO: Replace with actual API call to fetch products
const sampleProducts = [
  {
    _id: '4088600262109',
    name: 'Apple juice',
    description:
      'A smooth blend of creamy tea with your choice of tea variety and milk',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1597318972412-6db3dd2acf10?w=400&h=400&fit=crop',
    barcode: '1234567890',
    components: [
      {
        categoryName: 'Tea',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 99,
              name: 'Green Tea',
              imageURL:
                'https://images.unsplash.com/photo-1596318895147-cd3b66dd330d?w=200&h=200&fit=crop',
            },
            quantity: 2,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Black Tea',
              imageURL:
                'https://images.unsplash.com/photo-1599654389725-5f5dfe1e3ee5?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.45,
          },
          {
            material: {
              _id: 3,
              name: 'Herbal Tea',
              imageURL:
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
            },
            quantity: 3,
            additionalPrice: 0.75,
          },
        ],
      },
      {
        categoryName: 'Milk',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 4,
              name: 'Whole Milk',
              imageURL:
                'https://images.unsplash.com/photo-1600788148184-7a36dc4df4ee?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 5,
              name: 'Skim Milk',
              imageURL:
                'https://images.unsplash.com/photo-1600788148184-7a36dc4df4ee?w=200&h=200&fit=crop',
            },
            quantity: 2,
            additionalPrice: 0.15,
          },
        ],
      },
      {
        categoryName: 'Sweetener',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 6,
              name: 'Sugar',
              imageURL:
                'https://images.unsplash.com/photo-1599599810831-d2300f5de0a3?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 7,
              name: 'Honey',
              imageURL:
                'https://images.unsplash.com/photo-1587049352693-ee9edbf0e3c6?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: {
      isTaxExcluded: false,
      baseTax: 7.5,
      additionalTaxAmount: 10,
    },
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 2,
    name: 'Assorted Cupcakes',
    description: 'Delicious assorted cupcakes in various flavours',
    category: 'Desserts',
    imageURL:
      'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=400&h=400&fit=crop',
    barcode: '0987654321',
    components: [
      {
        categoryName: 'Cake Flavour',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 4,
              name: 'Chocolate',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 5,
              name: 'Vanilla',
              imageURL:
                'https://images.unsplash.com/photo-1578516846235-a150ef688ab0?w=200&h=200&fit=crop',
            },
            quantity: 2,
            additionalPrice: 0.15,
          },
        ],
      },
    ],
    productTax: {
      isTaxExcluded: false,
      baseTax: 7.5,
      additionalTaxAmount: 0,
    },
    price: 10.2,
    currency: '£',
    availabilityStatus: 'out of stock',
  },
  {
    _id: 3,
    name: 'Espresso Coffee',
    description: 'Strong and bold espresso shot',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b8d5?w=400&h=400&fit=crop',
    barcode: '1112131415',
    components: [
      {
        categoryName: 'Roast Level',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Light Roast',
              imageURL:
                'https://images.unsplash.com/photo-1559056199-641a0ac8b8d5?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Medium Roast',
              imageURL:
                'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.3,
          },
          {
            material: {
              _id: 3,
              name: 'Dark Roast',
              imageURL:
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.3,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 0 },
    price: 5.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: '07065767989',
    name: 'Egusi Dudu',
    description: 'Classic cappuccino with perfect foam ratio',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
    barcode: '1516171819',
    components: [
      {
        categoryName: 'Milk Foam Level',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Light Foam',
              imageURL:
                'https://images.unsplash.com/photo-1550583724-b2692b63c311?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 0 },
    price: 6.75,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 5,
    name: 'Iced Coffee',
    description: 'Refreshing cold brew iced coffee',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    barcode: '2021222324',
    components: [
      {
        categoryName: 'Coffee Type',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Cold Brew',
              imageURL:
                'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Iced Latte',
              imageURL:
                'https://images.unsplash.com/photo-1597318972412-6db3dd2acf10?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 0 },
    price: 5.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 6,
    name: 'Croissant',
    description: 'Buttery and flaky French croissant',
    category: 'Pastries',
    imageURL:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
    barcode: '2526272829',
    components: [
      {
        categoryName: 'Filling',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Plain',
              imageURL:
                'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Chocolate',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.75,
          },
          {
            material: {
              _id: 3,
              name: 'Almond',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.85,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 4.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 7,
    name: 'Sandwich Combo',
    description: 'Fresh sandwich with your choice of fillings',
    category: 'Sandwiches',
    imageURL:
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=400&fit=crop',
    barcode: '3031323334',
    components: [
      {
        categoryName: 'Protein',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Turkey',
              imageURL:
                'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Ham',
              imageURL:
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.4,
          },
          {
            material: {
              _id: 3,
              name: 'Chicken',
              imageURL:
                'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.35,
          },
        ],
      },
      {
        categoryName: 'Cheese',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Cheddar',
              imageURL:
                'https://images.unsplash.com/photo-1589985643048-6f3ee62b8364?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.5,
          },
          {
            material: {
              _id: 2,
              name: 'Swiss',
              imageURL:
                'https://images.unsplash.com/photo-1626082927389-6cd097cfd330?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.6,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 8 },
    price: 8.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 8,
    name: 'Caesar Salad',
    description: 'Fresh crisp Caesar salad with your choice of dressing',
    category: 'Salads',
    imageURL:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    barcode: '3536373839',
    components: [
      {
        categoryName: 'Protein Add-on',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Grilled Chicken',
              imageURL:
                'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 2.0,
          },
          {
            material: {
              _id: 2,
              name: 'Shrimp',
              imageURL:
                'https://images.unsplash.com/photo-1553909764-5929e7afd587?w=200&h=200&fit=crop',
            },
            quantity: 80,
            additionalPrice: 3.0,
          },
        ],
      },
      {
        categoryName: 'Dressing',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Classic Caesar',
              imageURL:
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Garlic Parmesan',
              imageURL:
                'https://images.unsplash.com/photo-1585797199295-e4f9d9a5e3c0?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.3,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 6 },
    price: 9.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 9,
    name: 'Hamburger',
    description: 'Juicy burger with customizable toppings',
    category: 'Main Course',
    imageURL:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    barcode: '4041424344',
    components: [
      {
        categoryName: 'Meat Patty',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Beef',
              imageURL:
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
            },
            quantity: 150,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Chicken',
              imageURL:
                'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
            },
            quantity: 150,
            additionalPrice: 0.5,
          },
        ],
      },
      {
        categoryName: 'Toppings',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Bacon',
              imageURL:
                'https://images.unsplash.com/photo-1590080876-2ba2b0b5d40b?w=200&h=200&fit=crop',
            },
            quantity: 20,
            additionalPrice: 0.75,
          },
          {
            material: {
              _id: 2,
              name: 'Fried Egg',
              imageURL:
                'https://images.unsplash.com/photo-1585693574154-b7d3f0d9a3b3?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.6,
          },
          {
            material: {
              _id: 3,
              name: 'Mushrooms',
              imageURL:
                'https://images.unsplash.com/photo-1590080876-2ba2b0b5d40b?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.4,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 10 },
    price: 11.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 10,
    name: 'Margherita Pizza',
    description: 'Classic margherita pizza with fresh mozzarella and basil',
    category: 'Pizza',
    imageURL:
      'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop',
    barcode: '4546474849',
    components: [
      {
        categoryName: 'Crust Type',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Thin Crust',
              imageURL:
                'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Thick Crust',
              imageURL:
                'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.5,
          },
          {
            material: {
              _id: 3,
              name: 'Stuffed Crust',
              imageURL:
                'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 1.0,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 15 },
    price: 14.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 11,
    name: 'Brownie Delight',
    description: 'Rich and fudgy chocolate brownie',
    category: 'Desserts',
    imageURL:
      'https://images.unsplash.com/photo-1607623801529-036fca1b5dbc?w=400&h=400&fit=crop',
    barcode: '5051525354',
    components: [
      {
        categoryName: 'Topping',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Plain',
              imageURL:
                'https://images.unsplash.com/photo-1607623801529-036fca1b5dbc?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Vanilla Ice Cream',
              imageURL:
                'https://images.unsplash.com/photo-1563805042-7684c019e157?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 1.5,
          },
          {
            material: {
              _id: 3,
              name: 'Whipped Cream',
              imageURL:
                'https://images.unsplash.com/photo-1435255917645-5f69c2a373d5?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 6.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 12,
    name: 'Smoothie Bowl',
    description: 'Thick smoothie topped with granola and fresh fruits',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1590080876-2ba2b0b5d40b?w=400&h=400&fit=crop',
    barcode: '5556575859',
    components: [
      {
        categoryName: 'Base Flavour',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Strawberry Banana',
              imageURL:
                'https://images.unsplash.com/photo-1590080876-2ba2b0b5d40b?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Mango Pineapple',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.3,
          },
          {
            material: {
              _id: 3,
              name: 'Blueberry Acai',
              imageURL:
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 8 },
    price: 8.75,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 13,
    name: 'Pancakes',
    description: 'Fluffy pancakes with your choice of syrup',
    category: 'Breakfast',
    imageURL:
      'https://images.unsplash.com/photo-1488207353020-2db45a9a6c6d?w=400&h=400&fit=crop',
    barcode: '6061626364',
    components: [
      {
        categoryName: 'Syrup Type',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Maple Syrup',
              imageURL:
                'https://images.unsplash.com/photo-1488207353020-2db45a9a6c6d?w=200&h=200&fit=crop',
            },
            quantity: 30,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Blueberry Syrup',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 30,
            additionalPrice: 0.4,
          },
          {
            material: {
              _id: 3,
              name: 'Chocolate Sauce',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 30,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 8 },
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 14,
    name: 'Waffle',
    description: 'Belgian waffle with crispy exterior and soft interior',
    category: 'Breakfast',
    imageURL:
      'https://images.unsplash.com/photo-1612690670853-0d5e8ee21f9f?w=400&h=400&fit=crop',
    barcode: '6566676869',
    components: [
      {
        categoryName: 'Topping',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Whipped Cream & Berries',
              imageURL:
                'https://images.unsplash.com/photo-1612690670853-0d5e8ee21f9f?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Nutella & Banana',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.75,
          },
          {
            material: {
              _id: 3,
              name: 'Caramel & Pecans',
              imageURL:
                'https://images.unsplash.com/photo-1587049352693-ee9edbf0e3c6?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.85,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 8 },
    price: 9.25,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 15,
    name: 'Omelette',
    description: 'Fresh made omelette with your choice of fillings',
    category: 'Breakfast',
    imageURL:
      'https://images.unsplash.com/photo-1585515320310-39c02521e580?w=400&h=400&fit=crop',
    barcode: '7071727374',
    components: [
      {
        categoryName: 'Main Filling',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Cheese',
              imageURL:
                'https://images.unsplash.com/photo-1589985643048-6f3ee62b8364?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Ham & Cheese',
              imageURL:
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.6,
          },
          {
            material: {
              _id: 3,
              name: 'Mushroom & Spinach',
              imageURL:
                'https://images.unsplash.com/photo-1585797199295-e4f9d9a5e3c0?w=200&h=200&fit=crop',
            },
            quantity: 120,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 7 },
    price: 8.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 16,
    name: 'Lemonade',
    description: 'Fresh squeezed lemonade',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1585518419759-1b6995ac9e8f?w=400&h=400&fit=crop',
    barcode: '7576777879',
    components: [
      {
        categoryName: 'Sweetness Level',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Unsweetened',
              imageURL:
                'https://images.unsplash.com/photo-1585518419759-1b6995ac9e8f?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Light Sweet',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 3,
              name: 'Extra Sweet',
              imageURL:
                'https://images.unsplash.com/photo-1587049352693-ee9edbf0e3c6?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 4 },
    price: 4.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 17,
    name: 'Donuts Box',
    description: 'Assorted box of fresh glazed donuts',
    category: 'Desserts',
    imageURL:
      'https://images.unsplash.com/photo-1612882104407-8c5366bcccc0?w=400&h=400&fit=crop',
    barcode: '8081828384',
    components: [
      {
        categoryName: 'Glazing Flavour',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Sugar Glaze',
              imageURL:
                'https://images.unsplash.com/photo-1612882104407-8c5366bcccc0?w=200&h=200&fit=crop',
            },
            quantity: 6,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Chocolate Glaze',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 6,
            additionalPrice: 0.3,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 6 },
    price: 7.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 18,
    name: 'Iced Tea',
    description: 'Refreshing iced tea with fresh lime',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1556742212-5b321f3c261d?w=400&h=400&fit=crop',
    barcode: '8586878889',
    components: [
      {
        categoryName: 'Tea Flavour',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Classic Black',
              imageURL:
                'https://images.unsplash.com/photo-1556742212-5b321f3c261d?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Peach',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.25,
          },
          {
            material: {
              _id: 3,
              name: 'Mango',
              imageURL:
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.25,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 4 },
    price: 4.75,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 19,
    name: 'Cookies Assortment',
    description: 'Box of assorted freshly baked cookies',
    category: 'Desserts',
    imageURL:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    barcode: '9091929394',
    components: [
      {
        categoryName: 'Cookie Type',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Chocolate Chip',
              imageURL:
                'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Oatmeal Raisin',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.15,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 6.75,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 20,
    name: 'Hot Chocolate',
    description: 'Creamy hot chocolate with marshmallows',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
    barcode: '9596979899',
    components: [
      {
        categoryName: 'Marshmallow Option',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'No Marshmallow',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 0,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Regular Marshmallow',
              imageURL:
                'https://images.unsplash.com/photo-1435255917645-5f69c2a373d5?w=200&h=200&fit=crop',
            },
            quantity: 30,
            additionalPrice: 0.3,
          },
          {
            material: {
              _id: 3,
              name: 'Extra Fluffy',
              imageURL:
                'https://images.unsplash.com/photo-1608126814784-bc8067dc0d6d?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 5.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 21,
    name: 'Bagel',
    description: 'Fresh baked bagel with cream cheese',
    category: 'Pastries',
    imageURL:
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=400&fit=crop',
    barcode: '0102030405',
    components: [
      {
        categoryName: 'Bagel Type',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Plain',
              imageURL:
                'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Everything',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.2,
          },
          {
            material: {
              _id: 3,
              name: 'Whole Wheat',
              imageURL:
                'https://images.unsplash.com/photo-1585797199295-e4f9d9a5e3c0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.25,
          },
        ],
      },
      {
        categoryName: 'Spread',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Cream Cheese',
              imageURL:
                'https://images.unsplash.com/photo-1589985643048-6f3ee62b8364?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Peanut Butter',
              imageURL:
                'https://images.unsplash.com/photo-1585857-8cfc139faf71?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.3,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 6.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 22,
    name: 'Muffin',
    description: 'Delicious muffin in various flavours',
    category: 'Pastries',
    imageURL:
      'https://images.unsplash.com/photo-1607623801529-036fca1b5dbc?w=400&h=400&fit=crop',
    barcode: '0607080910',
    components: [
      {
        categoryName: 'Flavour',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Blueberry',
              imageURL:
                'https://images.unsplash.com/photo-1607623801529-036fca1b5dbc?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Chocolate',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.2,
          },
          {
            material: {
              _id: 3,
              name: 'Banana',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.15,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 4.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 23,
    name: 'Tomato Soup',
    description: 'Warm and comforting homemade tomato soup',
    category: 'Soups',
    imageURL:
      'https://images.unsplash.com/photo-1476124369162-f4978d69b89f?w=400&h=400&fit=crop',
    barcode: '1112131415',
    components: [
      {
        categoryName: 'Add-ons',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'No Add-ons',
              imageURL:
                'https://images.unsplash.com/photo-1476124369162-f4978d69b89f?w=200&h=200&fit=crop',
            },
            quantity: 0,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Croutons',
              imageURL:
                'https://images.unsplash.com/photo-1411632765486-a01980e01a22?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.4,
          },
          {
            material: {
              _id: 3,
              name: 'Sour Cream',
              imageURL:
                'https://images.unsplash.com/photo-1589985643048-6f3ee62b8364?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 6 },
    price: 6.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 24,
    name: 'Pasta Primavera',
    description: 'Fresh pasta with seasonal vegetables',
    category: 'Main Course',
    imageURL:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
    barcode: '1617181920',
    components: [
      {
        categoryName: 'Protein Add-on',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'None',
              imageURL:
                'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop',
            },
            quantity: 0,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Chicken',
              imageURL:
                'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
            },
            quantity: 150,
            additionalPrice: 2.0,
          },
          {
            material: {
              _id: 3,
              name: 'Shrimp',
              imageURL:
                'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
            },
            quantity: 120,
            additionalPrice: 2.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 12 },
    price: 11.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 25,
    name: 'Grilled Cheese Sandwich',
    description: 'Classic grilled cheese with perfectly melted cheese',
    category: 'Sandwiches',
    imageURL:
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=400&fit=crop',
    barcode: '2122232425',
    components: [
      {
        categoryName: 'Cheese Type',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'American Cheese',
              imageURL:
                'https://images.unsplash.com/photo-1606787620525-bbad1981e250?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Cheddar',
              imageURL:
                'https://images.unsplash.com/photo-1589985643048-6f3ee62b8364?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.25,
          },
          {
            material: {
              _id: 3,
              name: 'Swiss',
              imageURL:
                'https://images.unsplash.com/photo-1626082927389-6cd097cfd330?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.35,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 7 },
    price: 7.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 26,
    name: 'Tiramisu',
    description: 'Classic Italian tiramisu with mascarpone and espresso',
    category: 'Desserts',
    imageURL:
      'https://images.unsplash.com/photo-1571115764595-644a12c7fb3b?w=400&h=400&fit=crop',
    barcode: '2627282930',
    components: [
      {
        categoryName: 'Portion Size',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Small (1 serving)',
              imageURL:
                'https://images.unsplash.com/photo-1571115764595-644a12c7fb3b?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Large (2 servings)',
              imageURL:
                'https://images.unsplash.com/photo-1571115764595-644a12c7fb3b?w=200&h=200&fit=crop',
            },
            quantity: 2,
            additionalPrice: 4.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 7.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 27,
    name: 'Mocha',
    description: 'Perfect blend of coffee and chocolate',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
    barcode: '3132333435',
    components: [
      {
        categoryName: 'Chocolate Level',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Light Chocolate',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Regular Chocolate',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 3,
              name: 'Extra Chocolate',
              imageURL:
                'https://images.unsplash.com/photo-1599599810694-f3515314fdd0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.4,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 6.75,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 28,
    name: 'Fruit Salad',
    description: 'Fresh seasonal fruit salad',
    category: 'Salads',
    imageURL:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    barcode: '3637383940',
    components: [
      {
        categoryName: 'Dressing',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'No Dressing',
              imageURL:
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
            },
            quantity: 0,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Honey Lime',
              imageURL:
                'https://images.unsplash.com/photo-1587049352693-ee9edbf0e3c6?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.4,
          },
          {
            material: {
              _id: 3,
              name: 'Balsamic',
              imageURL:
                'https://images.unsplash.com/photo-1585797199295-e4f9d9a5e3c0?w=200&h=200&fit=crop',
            },
            quantity: 50,
            additionalPrice: 0.5,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 8.99,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 29,
    name: 'Cheesecake Slice',
    description: 'Rich and creamy New York style cheesecake',
    category: 'Desserts',
    imageURL:
      'https://images.unsplash.com/photo-1515182629504-727d7753751f?w=400&h=400&fit=crop',
    barcode: '4142434445',
    components: [
      {
        categoryName: 'Topping',
        isOptional: true,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Plain',
              imageURL:
                'https://images.unsplash.com/photo-1515182629504-727d7753751f?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Strawberry Sauce',
              imageURL:
                'https://images.unsplash.com/photo-1517684712202-2f1d62553aa5?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.75,
          },
          {
            material: {
              _id: 3,
              name: 'Chocolate Ganache',
              imageURL:
                'https://images.unsplash.com/photo-1517684712202-2f1d62553aa5?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.85,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 5 },
    price: 8.5,
    currency: '£',
    availabilityStatus: 'in Stock',
  },
  {
    _id: 30,
    name: 'Protein Smoothie',
    description: 'Nutritious protein-packed smoothie',
    category: 'Beverages',
    imageURL:
      'https://images.unsplash.com/photo-1590080876-2ba2b0b5d40b?w=400&h=400&fit=crop',
    barcode: '4647484950',
    components: [
      {
        categoryName: 'Protein Type',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Whey Protein',
              imageURL:
                'https://images.unsplash.com/photo-1590080876-2ba2b0b5d40b?w=200&h=200&fit=crop',
            },
            quantity: 25,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Plant-Based',
              imageURL:
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
            },
            quantity: 25,
            additionalPrice: 0.3,
          },
          {
            material: {
              _id: 3,
              name: 'Greek Yogurt',
              imageURL:
                'https://images.unsplash.com/photo-1488207353020-2db45a9a6c6d?w=200&h=200&fit=crop',
            },
            quantity: 100,
            additionalPrice: 0.5,
          },
        ],
      },
      {
        categoryName: 'Flavour',
        isOptional: false,
        materialChoices: [
          {
            material: {
              _id: 1,
              name: 'Vanilla',
              imageURL:
                'https://images.unsplash.com/photo-1578516846235-a150ef688ab0?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0,
          },
          {
            material: {
              _id: 2,
              name: 'Strawberry',
              imageURL:
                'https://images.unsplash.com/photo-1590080876-2ba2b0b5d40b?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.2,
          },
          {
            material: {
              _id: 3,
              name: 'Chocolate',
              imageURL:
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
            },
            quantity: 1,
            additionalPrice: 0.2,
          },
        ],
      },
    ],
    productTax: { isTaxExcluded: false, baseTax: 7.5, additionalTaxAmount: 6 },
    price: 9.99,
    currency: '£',
    availabilityStatus: 'in Stock',
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
