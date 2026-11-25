import Button from '@/components/account/Button';
import Pagination from '@/components/account/Pagination';
import Spinner from '@/components/account/Spinner';
import React from 'react';
import { FaSearch, FaShippingFast, FaTimes, FaWalking } from 'react-icons/fa';

const SelectSupplierPannel = ({
  loading,
  setPurchaseRecord,
  OPEN_MARKET_ID,
  suppliers,
  searchTerm,
  setSearchTerm,
  lastSearchTerm,
  searchMessage,
  setSelectedSupplier,
  setOpenSupplierSelectPannel,
  fetchSuppliers,
  pagination,
  setPagination,
}) => {
  const onSelectSupplier = (supplier) => {
    supplier && setSelectedSupplier(supplier);
    setPurchaseRecord({ supplierId: supplier._id });
    setOpenSupplierSelectPannel(false);
    return;
  };

  const onPageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: page });
      fetchSuppliers(page, lastSearchTerm); // Fetch suppliers for the new page
    }
  };

  const OPEN_MARKET_DATA = {
    name: 'Open market purchase',
    _id: OPEN_MARKET_ID,
  };

  if (loading) return <Spinner />;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="bg-white w-[80%] h-[90%] rounded-lg p-5 relative"
    >
      {/* Close button */}
      <span
        onClick={() => setOpenSupplierSelectPannel(false)}
        title="close"
        className="absolute top-0 right-0 p-2 rounded-full bg-gray-shadow5 hover:bg-error-hover cursor-pointer"
      >
        <FaTimes className="text-text-white" />
      </span>

      {/* search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchSuppliers(1, searchTerm);
        }}
        className="h-8 px-3 border-2 border-gray-border rounded-md flex flex-row items-center w-full"
      >
        <FaSearch className="text-text-gray" />
        <input
          type="text"
          placeholder="Enter supplier name, email or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="focus:outline-none ml-2 w-full font-thin"
        />

        <Button
          type="submit"
          loading={loading}
          loadingText="Searching.."
          text="Search"
          onClick={() => fetchSuppliers(1, searchTerm)}
          buttonStyle={`bg-brand-blue text-text-white font-semibold px-3 py-1 rounded-md hover:bg-blue-shadow1 ${loading || searchTerm.length < 3 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          icon={FaSearch}
          iconAfterText={true}
          iconStyle="ml-2 text-text-white"
        />
      </form>

      <span className="text-error text-sm ml-3">
        {searchTerm.length < 3
          ? 'Enter at least 3 characters to search...'
          : ''}
      </span>

      {/* List of suppliers */}
      <div className="h-[80%] relative mt-5 overflow-y-auto scrollbar-thin">
        <li
          onClick={() => onSelectSupplier(OPEN_MARKET_DATA)}
          className="py-2 mx-2 border-y-1 border-y px-2 cursor-pointer flex flex-row items-center gap-3 hover:bg-gray-shadow9 hover:text-text-black sticky top-0 bg-white z-10"
        >
          <span className="bg-brand-blue p-1 rounded-full">
            <FaWalking className="text-text-white text-lg" />
          </span>
          <span className="text-text-black">{OPEN_MARKET_DATA.name}</span>
        </li>

        {suppliers && suppliers?.length > 0 ? (
          <ul className="mx-2 shadow-inner h-full pb-10">
            {suppliers.map((supplier) => (
              <li
                key={supplier._id}
                onClick={() => onSelectSupplier(supplier)}
                className="py-2 border-y-1 border-y px-2 cursor-pointer flex flex-row items-center gap-3 hover:bg-gray-shadow9 hover:text-text-black"
              >
                <span className="bg-brand-blue p-1 rounded-full">
                  <FaShippingFast className="text-text-white text-lg" />
                </span>
                <span>{supplier?.name || 'unnamed supplier'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="flex w-full h-full justify-center items-center font-semibold">
            {searchMessage}
          </span>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="absolute bottom-5 left-0 w-full bg-white py-2 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SelectSupplierPannel;
