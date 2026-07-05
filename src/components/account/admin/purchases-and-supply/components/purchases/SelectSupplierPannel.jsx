import Spinner from '@/components/account/Spinner';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaShippingFast, FaTimes, FaWalking } from 'react-icons/fa';

const SelectSupplierPannel = ({
  loading,
  setPurchaseRecord,
  OPEN_MARKET_ID,
  suppliers,
  setSelectedSupplier,
  setOpenSupplierSelectPannel,
}) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  useEffect(() => {
    const filtered = () => {
      const filterResult = suppliers?.filter((sup) => {
        if (!filterTerm || filterTerm === '') return true;
        return sup.name?.toLowerCase()?.includes(filterTerm.toLowerCase());
      });
      setFilteredSuppliers(filterResult);
    };

    filtered();
  }, [suppliers, setFilteredSuppliers, filterTerm]);

  const onSelectSupplier = (supplier) => {
    supplier && setSelectedSupplier(supplier);
    setPurchaseRecord({ supplierId: supplier._id });
    setOpenSupplierSelectPannel(false);
    return;
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
      <div className="h-8 px-3 border-2 border-gray-border rounded-md flex flex-row items-center w-full">
        <FaSearch className="text-text-gray" />
        <input
          type="text"
          placeholder="Search suppliers"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="focus:outline-none ml-2 w-full font-semibold"
        />
      </div>

      {/* hot keys */}
      <div className="h-10"></div>

      {/* List of suppliers */}
      <div className="h-[80%]">
        <li
          onClick={() => onSelectSupplier(OPEN_MARKET_DATA)}
          className="py-2 mx-2 border-y-1 border-y px-2 cursor-pointer flex flex-row items-center gap-3 hover:bg-gray-shadow9 hover:text-text-black"
        >
          <span className="bg-brand-blue p-1 rounded-full">
            <FaWalking className="text-text-white text-lg" />
          </span>
          <span className="text-text-black">{OPEN_MARKET_DATA.name}</span>
        </li>

        {filteredSuppliers && filteredSuppliers?.length > 0 ? (
          <ul className="mx-2 shadow-inner h-full overflow-y-auto scrollbar-thin">
            {filteredSuppliers.map((supplier) => (
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
            {filterTerm
              ? `There is no supplier that matches ${filterTerm}`
              : `No supplier record found`}
          </span>
        )}
      </div>
    </div>
  );
};

export default SelectSupplierPannel;
