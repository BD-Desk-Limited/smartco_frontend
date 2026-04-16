'use client';
import React from 'react';
import ProductTables from './products/ProductTables';
import TransactionTables from './transactions/TransactionTables';

const UnsyncedDataTableView = ({
  fetchedDocuments,
  documentSearchInput,
  setDocumentSearchInput,
  table,
  setTable,
  setMessage,
  setError,
}) => {
  const [activeTable, setActiveTable] = React.useState('');
  const TABLE_TO_DATAMAPPING = {
    products: ProductTables,
    transactions: TransactionTables,
  };

  const SHARED_PROPS = {
    fetchedDocuments,
    documentSearchInput,
    setDocumentSearchInput,
    table,
    setTable,
    setMessage,
    setError,
    activeTable,
    setActiveTable,
  };

  const TableComponent = TABLE_TO_DATAMAPPING[table?.name] || TransactionTables;

  //function to get unique values for a specific header to populate filter options
  const getUniqueValuesForEachHeader = (activeTable, filterHeader) => {
    const uniqueValues = new Set(); // use a Set to store unique values
    table?.normalizedData?.[activeTable]?.forEach((doc) => {
      if (doc[filterHeader]) {
        uniqueValues.add(doc[filterHeader]);
      }
    });
    return Array.from(uniqueValues);
  };

  return (
    <div className="h-full w-full">
      {/* filter and search options */}
      <div className="flex flex-row items-center justify-between w-full">
        <input
          type="text"
          placeholder="Search table..."
          className="border border-gray-border rounded-md p-1 w-1/4 focus:outline-none focus:ring-1 focus:ring-brand-blue"
          value={documentSearchInput}
          onChange={(e) => setDocumentSearchInput(e.target.value)}
        />

        <div className="flex flex-row items-center gap-5 w-full justify-end">
          {table?.filterHeaders?.map((header) => (
            <div key={header} className="text-sm text-text-gray">
              {header}:
              <select
                value={table?.filterParameters?.[header] || ''}
                onChange={(e) =>
                  setTable((prev) => ({
                    ...prev,
                    filterParameters: {
                      ...prev.filterParameters,
                      [header]: e.target.value,
                    },
                  }))
                }
                className="ml-2 p-1 border border-brand-blue rounded focus:outline-none focus:ring-1 focus:ring-brand-blue"
              >
                <option value="">All</option>
                {getUniqueValuesForEachHeader(activeTable, header)?.map(
                  (value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
          ))}
        </div>
      </div>
      {/* table view */}
      <div>{<TableComponent {...SHARED_PROPS} />}</div>
    </div>
  );
};

export default UnsyncedDataTableView;
