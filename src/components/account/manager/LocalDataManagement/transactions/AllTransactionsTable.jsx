import React from 'react';

const AllTransactionsTable = ({
  fetchedDocuments,
  documentSearchInput,
  table,
  setTable,
  activeTransactionTable,
  setMessage,
  setError,
}) => {
  const [filteredTableData, setFilteredTableData] = React.useState([]);

  //filter table data based on search input and filter parameters
  React.useEffect(() => {
    let filteredDataForCurrentTable =
      table?.normalizedData?.[activeTransactionTable] || [];

    // Apply search filter
    if (documentSearchInput) {
      const searchInputLower = documentSearchInput.toLowerCase();
      filteredDataForCurrentTable = filteredDataForCurrentTable.filter((doc) =>
        Object.values(doc).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchInputLower)
        )
      );
    }

    //apply additional filters based on filter parameters for the active table
    if (table?.filterParameters) {
      Object.entries(table.filterParameters).forEach(
        ([header, filterValue]) => {
          if (filterValue) {
            filteredDataForCurrentTable = filteredDataForCurrentTable.filter(
              (doc) =>
                doc[header] && doc[header].toString() === filterValue.toString()
            );
          }
        }
      );
    }

    setFilteredTableData(filteredDataForCurrentTable);
  }, [
    table?.documentSearchInput,
    table?.filterParameters,
    table?.normalizedData,
    activeTransactionTable,
    documentSearchInput,
  ]);

  // Normalise data for easier display, when in the active product table
  React.useEffect(() => {
    const normalised = fetchedDocuments.map((doc) => ({
      //list data to be displayed in table with their corresponding headers.
      'Order Id': doc.orderId,
      Name: doc.name?.toLowerCase(),
      currency: doc.currency,
      Price: doc.price,
    }));

    setTable((prev) => ({
      ...prev,
      normalizedData: {
        ...prev.normalizedData,
        [activeTransactionTable]: normalised,
      },
    }));
  }, [fetchedDocuments, activeTransactionTable, setTable]);

  //extract table headers to be included as filter options and the ones to display in the table
  React.useEffect(() => {
    if (table?.normalizedData?.[activeTransactionTable]?.length > 0) {
      const headers = Object.keys(
        table.normalizedData[activeTransactionTable][0]
      );

      //remove any non-essential filter fields from headers
      const nonEssentialFieldsForFilters = [
        '_id',
        'Name',
        'Order Id',
        'Price',
        'createdAt',
        'updatedAt',
        '__v',
      ];

      const essentialHeadersForFilters = headers?.filter(
        (header) => !nonEssentialFieldsForFilters.includes(header)
      );

      setTable((prev) => ({
        ...prev,
        displayHeaders: headers,
        filterHeaders: essentialHeadersForFilters,
      }));
    }
  }, [table?.normalizedData, setTable, activeTransactionTable]);

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin relative">
      <table className="min-w-full table-auto">
        <thead className="sticky top-0 bg-text-white border-b-2">
          <tr>
            <th className="px-4 py-2 border-b border-gray-border text-left text-sm font-semibold text-gray-700">
              #
            </th>
            {table?.displayHeaders?.map((header) => (
              <th
                key={header}
                className="px-4 py-2 border-b border-gray-border text-left text-sm font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredTableData?.map((doc, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b border-gray-border text-sm text-gray-700">
                {index + 1}
              </td>
              {table?.displayHeaders?.map((header) => (
                <td
                  key={header}
                  className="px-4 py-2 border-b border-gray-border text-sm text-gray-700"
                >
                  {doc[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTransactionsTable;
