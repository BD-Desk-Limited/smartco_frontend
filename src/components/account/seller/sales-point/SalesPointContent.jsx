import React from 'react';
import SalesPointProducts from './SalesPointProducts';
import { fetchProductsFromAPI, loadProducts } from './productFetchManagement';

const SalesPointContent = ({
  mode,
  activeMenuItem,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('All Products');
  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [productCategories, setProductCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [refreshingProducts, setRefreshingProducts] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedProducts = await loadProducts();
        setProducts(loadedProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term and selected filter
  React.useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === '' ||
        (product.name + product.description + product.category)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); // Check if search term matches name or description
      const matchesFilter =
        filterValue === 'All Products' ||
        product.availabilityStatus === filterValue;
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesFilter && matchesCategory;
    });

    const filteredCategories = [
      ...new Set(filtered.map((product) => product.category)),
    ];
    setProductCategories(filteredCategories);
    setFilteredProducts(filtered);
  }, [searchTerm, filterValue, products, selectedCategory]);

  const handleRefreshProducts = async () => {
    setRefreshingProducts(true);
    setLoading(true);
    const fetchedProducts = await fetchProductsFromAPI();
    setProducts(fetchedProducts);
    setLoading(false);
    setRefreshingProducts(false);
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      {/*Top search Filters and tools */}
      <div className="p-4 border-b border-gray-border w-full flex flex-row justify-between items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-lg">
        {/* Top Search and filter bar */}
        <div className="flex flex-row items-center">
          {/* Search input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items name, category or description..."
            className={`w-80 p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
          />

          {/* Available products filter */}
          <select
            className={`ml-4 p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="All Products">All Products</option>
            {['in Stock', 'out of Stock', 'low stock', 'discontinued'].map(
              (option) => (
                <option
                  key={option}
                  value={option}
                  className={
                    mode === 'light' ? lightThemeStyle : darkThemeStyle
                  }
                >
                  {option}
                </option>
              )
            )}
          </select>
        </div>

        {/* action buttons */}
        <div className="inline-flex ml-4 space-x-2">
          <button className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/80">
            Pending Orders
          </button>
          <button className="px-4 py-2 bg-gray-200 text-text-black rounded-md hover:bg-gray-300">
            Pending Registrations
          </button>
          <button className="px-4 py-2 bg-gray-200 text-text-black rounded-md hover:bg-gray-300">
            Order Schedule
          </button>
        </div>
      </div>

      {/* Sales point products */}
      <div className="flex-1 p-4">
        <div className="w-full h-full rounded-md p-4">
          <SalesPointProducts
            products={products}
            filteredProducts={filteredProducts}
            productCategories={productCategories}
            setProductCategories={setProductCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            handleRefreshProducts={handleRefreshProducts}
            refreshingProducts={refreshingProducts}
            loading={loading}
            error={error}
            mode={mode}
            lightThemeStyle={lightThemeStyle}
            darkThemeStyle={darkThemeStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesPointContent;
