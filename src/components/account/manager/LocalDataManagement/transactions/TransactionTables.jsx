import React from 'react';
import AllTransactionsTable from './AllTransactionsTable';

const TransactionTables = ({
  fetchedDocuments,
  documentSearchInput,
  table,
  setTable,
  setMessage,
  setError,
  setActiveTable,
}) => {
  const [activeTransactionTable, setActiveTransactionTable] =
    React.useState('all-transactions');

  //update active tab when changed locally
  React.useEffect(() => {
    if (table?.name === 'transactions') {
      setActiveTable(activeTransactionTable);
    }
  }, [activeTransactionTable, table?.name, setActiveTable]);

  const TABLE_TABS = [{ id: 'all-transactions', label: 'All Transactions' }];

  const ACTIVE_TRANSACTION_TABLE_COMPONENTS_MAP = {
    'all-transactions': AllTransactionsTable,
  };

  const SHARED_PROPS = {
    fetchedDocuments,
    documentSearchInput,
    table,
    setTable,
    activeTransactionTable,
    setMessage,
    setError,
  };

  const ActiveTransactionTableComponent =
    ACTIVE_TRANSACTION_TABLE_COMPONENTS_MAP[activeTransactionTable] ||
    AllTransactionsTable;

  return (
    <div>
      {/* table tabs */}
      <div className="flex flex-row items-center gap-4 border-b border-gray-border">
        {TABLE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTransactionTable(tab.id)}
            className={`py-2 px-4 -mb-px ${
              activeTransactionTable === tab.id
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
        <ActiveTransactionTableComponent {...SHARED_PROPS} />
      </div>
    </div>
  );
};

export default TransactionTables;
