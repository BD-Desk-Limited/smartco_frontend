import React from 'react';
import HeadBar from '../HeadBar';
import Footer from '../Footer';
import { motion } from 'framer-motion';
import SalesPointContent from './SalesPointContent';
import { loadProducts } from '../productFetchManagement';
import SelectedProductCard from './SelectedProductCard';

const SalesPoint = ({
  mode,
  setMode,
  menuItems,
  activeMenuItem,
  setActiveMenuItem,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const [products, setProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
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

  return (
    <div className="h-screen overflow-y-auto no-scrollbar flex flex-col items-center relative">
      <HeadBar
        mode={mode}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />
      <div className="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar w-full flex items-center justify-center relative">
        <SalesPointContent
          mode={mode}
          activeMenuItem={activeMenuItem}
          lightThemeStyle={lightThemeStyle}
          darkThemeStyle={darkThemeStyle}
          loading={loading}
          setLoading={setLoading}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          error={error}
          setError={setError}
          products={products}
          setProducts={setProducts}
        />
      </div>

      <Footer
        mode={mode}
        setMode={setMode}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />

      {/* Overlay for selected product, onclick outside, close it */}
      {selectedProduct && (
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50`}
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ x: '', y: '50%' }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-[640px] h-[70vh] flex justify-center items-center opacity-95 rounded-xl p-5 ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
            onClick={(e) => e.stopPropagation()}
          >
            <SelectedProductCard
              product={selectedProduct}
              mode={mode}
              lightThemeStyle={lightThemeStyle}
              darkThemeStyle={darkThemeStyle}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SalesPoint;
