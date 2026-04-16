import React, { act } from 'react';
import AllProductsTable from './AllProductsTable';
import ProductItemsTable from './ProductItemsTable';

const ProductTables = ({
  fetchedDocuments,
  documentSearchInput,
  setDocumentSearchInput,
  table,
  setTable,
  setMessage,
  setError,
  setActiveTable,
}) => {
  const [activeProductTable, setActiveProductTable] =
    React.useState('all-products');

  //update active tab when changed locally
  React.useEffect(() => {
    if (table?.name === 'products') {
      setActiveTable(activeProductTable);
    }
  }, [activeProductTable, table?.name, setActiveTable]);

  const TABLE_TABS = [
    { id: 'all-products', label: 'All Products' },
    { id: 'products-items', label: 'Products Items' },
  ];

  const ACTIVE_PRODUCT_TABLE_COMPONENTS_MAP = {
    'all-products': AllProductsTable,
    'products-items': ProductItemsTable,
  };

  const SHARED_PROPS = {
    fetchedDocuments,
    documentSearchInput,
    setDocumentSearchInput,
    table,
    setTable,
    activeProductTable,
    setMessage,
    setError,
  };

  const ActiveProductTableComponent =
    ACTIVE_PRODUCT_TABLE_COMPONENTS_MAP[activeProductTable] || AllProductsTable;

  return (
    <div>
      {/* table tabs */}
      <div className="flex flex-row items-center gap-4 border-b border-gray-border">
        {TABLE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveProductTable(tab.id)}
            className={`py-2 px-4 -mb-px ${
              activeProductTable === tab.id
                ? 'border-b-2 border-brand-blue text-brand-blue font-semibold'
                : 'text-gray-600 hover:text-brand-blue'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* table content */}
      <div className="mt-4">
        <ActiveProductTableComponent {...SHARED_PROPS} />
      </div>
    </div>
  );
};

export default ProductTables;
