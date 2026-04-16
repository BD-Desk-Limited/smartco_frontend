'use client';
import {
  getAllDocuments,
  getErrorMessage,
} from '@/utilities/indexedDBManagement';
import React from 'react';
import Spinner from '../../Spinner';
import UnsyncedDataTableView from './UnsyncedDataTableView';

const UnsyncedDataCheckPage = () => {
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [table, setTable] = React.useState({
    name: 'products',
    label: 'Products',
    filterHeaders: [],
    normalizedData: {},
  });
  const [documentSearchInput, setDocumentSearchInput] = React.useState('');
  const [fetchedDocuments, setFetchedDocuments] = React.useState([]);
  const [message, setMessage] = React.useState('');

  const ALL_DATA_STORES = [
    { name: 'products', label: 'Products' },
    { name: 'transactions', label: 'Transactions' },
  ];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllDocuments(table.name);
        if (response?.data) {
          const responseDataArray = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setFetchedDocuments(responseDataArray);
        } else {
          setError(getErrorMessage(response?.error || response?.message));
        }
      } catch (error) {
        // Handle any errors that occur during the operation
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table.name]);

  console.log('fetchedDocuments:', fetchedDocuments);

  return (
    <div className="p-6 space-y-4 h-full w-full">
      <h1 className="font-bold text-2xl w-full text-center">
        Offline Data Management
      </h1>
      <p className=" text-text-gray text-sm w-full text-center">
        You are viewing the Offline Data Management Page. This page is designed
        to help you identify and manage any data that has not yet been
        synchronized with the server.
      </p>
      <div className="w-full flex flex-row items-start space-y-2">
        <p className=" text-brand-blue text-sm w-full border-t border-brand-blue p-2">
          Select Table:
          <select
            value={table.name}
            onChange={(e) =>
              setTable((prev) => ({ ...prev, name: e.target.value }))
            }
            className="ml-2 p-1 border border-brand-blue rounded focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            {ALL_DATA_STORES.map((dataStore) => (
              <option key={dataStore.name} value={dataStore.name}>
                {dataStore.label}
              </option>
            ))}
          </select>
        </p>
        <p>
          {error && <span className="text-red-500">Error: {error}</span>}
          {message && <span className="text-green-500">{message}</span>}
        </p>
      </div>

      {loading || !mounted ? (
        <Spinner size={100} spaceHeight="80vh" />
      ) : (
        <UnsyncedDataTableView
          fetchedDocuments={fetchedDocuments}
          documentSearchInput={documentSearchInput}
          setDocumentSearchInput={setDocumentSearchInput}
          table={table}
          setTable={setTable}
          setMessage={setMessage}
          setError={setError}
        />
      )}
    </div>
  );
};

export default UnsyncedDataCheckPage;
