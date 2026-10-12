import React from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FaCalendar,
  FaHome,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaShippingFast,
} from 'react-icons/fa';

const PurchasesAndSupplyFilters = ({
  selectedFilters,
  draftFilters,
  setSelectedFilters,
  setDraftFilters,
  onChangeFilter,
  allSuppliers,
  formatDate,
  userBranches,
  STATUS_OPTIONS,
}) => {
  const Router = useRouter();
  const OPEN_MARKET_ID = 'open_market';
  const [branchesOpen, setBranchesOpen] = React.useState(false);
  const [suppliersOpen, setSuppliersOpen] = React.useState(false);

  // a single-branch user has nothing to choose; the server scopes them anyway
  const branches = userBranches.length > 1 ? userBranches : [];
  const suppliers = allSuppliers;

  const branchIds = branches.map((b) => b._id);
  const supplierIds = suppliers.map((s) => s._id);

  const allBranchesSelected =
    branchIds.length > 0 &&
    branchIds.every((id) => draftFilters.branches.includes(id));
  const someBranchesSelected =
    draftFilters.branches.length > 0 && !allBranchesSelected;

  const allSuppliersSelected =
    supplierIds.length > 0 &&
    supplierIds.every((id) => draftFilters?.suppliers?.includes(id));
  const someSuppliersSelected =
    draftFilters.suppliers.length > 0 && !allSuppliersSelected;

  const toggleBranch = (id) =>
    console.log('toggleBranch', id) ||
    setDraftFilters((prev) => ({
      ...prev,
      branches: prev.branches.includes(id)
        ? prev.branches.filter((x) => x !== id)
        : [...prev.branches, id],
    }));

  const toggleSupplier = (id) =>
    setDraftFilters((prev) => ({
      ...prev,
      suppliers: prev.suppliers.includes(id)
        ? prev.suppliers.filter((x) => x !== id)
        : [...prev.suppliers, id],
    }));

  const toggleAllBranches = () =>
    setDraftFilters((prev) => ({
      ...prev,
      branches: allBranchesSelected ? [] : branchIds,
    }));

  const toggleAllSuppliers = () =>
    setDraftFilters((prev) => ({
      ...prev,
      suppliers: allSuppliersSelected ? [] : supplierIds,
    }));

  // [] means "all", so opening the dropdown shows everything ticked in that case
  const toggleBranchesDropdown = () => {
    setBranchesOpen((prev) => !prev);
  };

  const toggleSuppliersDropdown = () => {
    if (!suppliersOpen) {
      setDraftFilters((prev) => ({
        ...prev,
        suppliers:
          selectedFilters.suppliers.length > 0
            ? selectedFilters.suppliers
            : supplierIds,
      }));
    }
    setSuppliersOpen((open) => !open);
  };

  const includesOpenMarket = draftFilters?.suppliers?.includes(OPEN_MARKET_ID);

  const toggleIncludeOpenMarkets = () => {
    setDraftFilters((prev) => ({
      ...prev,
      suppliers: includesOpenMarket
        ? prev.suppliers.filter((s) => s !== OPEN_MARKET_ID)
        : [...prev.suppliers, OPEN_MARKET_ID],
    }));
  };

  // everything ticked (or nothing ticked) is stored as [] so the request omits the filter
  const normalizeIds = (ids, all) =>
    ids.length === 0 || ids.length === all.length ? [] : ids;

  const applyFilters = () => {
    setSelectedFilters({
      ...draftFilters,
      branches: normalizeIds(draftFilters.branches, branches),
      suppliers: normalizeIds(draftFilters.suppliers, suppliers),
      page: 1,
    });
    setBranchesOpen(false);
    setSuppliersOpen(false);
  };

  const parseDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
      return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) || formatDate(date) !== value
      ? null
      : date;
  };

  const countLabel = (count, singular, plural) =>
    count === 0
      ? `All ${plural} Selected`
      : `${count} ${count === 1 ? singular : plural} Selected`;

  return (
    <div className="flex flex-row gap-5 w-auto justify-between items-center">
      <div className="flex flex-col gap-2 w-full border border-collapse border-gray-border rounded-md p-2">
        <div className="flex flex-row gap-2 items-center w-full justify-between">
          {/* Search */}
          <div className="h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-1/2">
            <FaSearch width={15} height={15} />
            <input
              type="text"
              placeholder="Search by order ID/Supplier name"
              value={draftFilters.searchTerm || ''}
              onChange={(e) => onChangeFilter('searchTerm', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="focus:outline-none ml-2 w-full text-sm"
            />
          </div>

          {/* Branches multi-selects */}
          {branches.length > 0 && (
            <div className="w-1/4 relative">
              <div
                onClick={toggleBranchesDropdown}
                className="focus:outline-none cursor-pointer whitespace-nowrap h-8 px-2 border border-gray-border rounded-md flex flex-row justify-between items-center text-sm text-text-gray w-full relative"
              >
                <FaHome
                  aria-hidden="true"
                  className="mr-2 text-brand-blue text-base"
                />
                <button>
                  {countLabel(
                    draftFilters.branches?.length,
                    'Branch',
                    'Branches'
                  )}
                </button>
                {branches.length > 1 && branchesOpen ? (
                  <FaChevronLeft className="ml-1" />
                ) : (
                  <FaChevronDown className="ml-1" />
                )}
              </div>

              {branchesOpen && (
                <div className="absolute z-10 bg-white border border-gray-border rounded-md mt-1 p-2 shadow-md min-w-[200px] max-h-72 overflow-y-auto scrollbar-thin">
                  <label className="flex flex-row items-center gap-2 p-1 text-sm cursor-pointer border-b border-gray-border mb-1 pb-1 bg-blue-shadow10">
                    <input
                      type="checkbox"
                      checked={allBranchesSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someBranchesSelected;
                      }}
                      onChange={toggleAllBranches}
                    />
                    <span>All Branches</span>
                  </label>
                  {branches.length > 1 &&
                    userBranches?.map((branch) => (
                      <label
                        key={branch._id}
                        className="flex flex-row items-center gap-2 p-1 text-sm cursor-pointer border-b border-gray-border mb-1 pb-1"
                      >
                        <input
                          type="checkbox"
                          checked={
                            draftFilters.branches.includes(branch._id) ||
                            allBranchesSelected
                          }
                          onChange={() => toggleBranch(branch._id)}
                        />
                        <span>{branch.name}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Suppliers multi-selects */}
          {suppliers.length > 0 && (
            <div className="w-1/4 relative">
              <div
                onClick={toggleSuppliersDropdown}
                className="focus:outline-none cursor-pointer whitespace-nowrap h-8 px-2 border border-gray-border rounded-md flex flex-row justify-between items-center text-sm text-text-gray w-full relative"
              >
                <FaShippingFast
                  aria-hidden="true"
                  className="mr-2 text-brand-blue text-base"
                />
                <button>
                  {countLabel(
                    draftFilters.suppliers?.length,
                    'Supplier',
                    'Suppliers'
                  )}
                </button>
                {suppliers.length > 1 && suppliersOpen ? (
                  <FaChevronLeft className="ml-1" />
                ) : (
                  <FaChevronDown className="ml-1" />
                )}
              </div>

              {suppliersOpen && (
                <div className="absolute z-10 bg-white border border-gray-border rounded-md mt-1 p-2 shadow-md w-full max-h-72 overflow-y-auto scrollbar-thin">
                  <label className="flex flex-row items-center gap-2 p-1 text-sm cursor-pointer border-b border-gray-border mb-1 pb-1 bg-blue-shadow10">
                    <input
                      type="checkbox"
                      checked={allSuppliersSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSuppliersSelected;
                      }}
                      onChange={toggleAllSuppliers}
                    />
                    <span>All Suppliers</span>
                  </label>
                  <label className="flex flex-row items-center gap-2 p-1 text-sm cursor-pointer border-b border-gray-border mb-1 pb-1 bg-blue-shadow10">
                    <input
                      type="checkbox"
                      checked={includesOpenMarket || allSuppliersSelected}
                      onChange={toggleIncludeOpenMarkets}
                    />
                    <span>Open market purchases</span>
                  </label>
                  {suppliers.length > 1 &&
                    allSuppliers?.map((supplier) => (
                      <label
                        key={supplier._id}
                        className="flex flex-row items-center gap-2 p-1 text-sm cursor-pointer border-b border-gray-border mb-1 pb-1"
                      >
                        <input
                          type="checkbox"
                          checked={
                            draftFilters.suppliers.includes(supplier._id) ||
                            allSuppliersSelected
                          }
                          onChange={() => toggleSupplier(supplier._id)}
                        />
                        <span>{supplier.name}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Date range */}
          <div className="h-8 px-2 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray w-1/4">
            <FaCalendar aria-hidden="true" className="mr-2 text-brand-blue" />
            <DatePicker
              selectsRange
              startDate={parseDate(draftFilters.from)}
              endDate={parseDate(draftFilters.to)}
              onChange={([from, to]) => {
                onChangeFilter('from', from ? formatDate(from) : '');
                onChangeFilter('to', to ? formatDate(to) : '');
              }}
              dateFormat="yyyy-MM-dd"
              className="w-fit focus:outline-none cursor-pointer"
              aria-label="Filter by date range"
            />
          </div>

          {/* Status */}
          <div className="flex flex-row gap-2 text-sm w-1/4 text-text-gray">
            <div className="h-8 px-1 border border-gray-border rounded-md flex flex-row items-center">
              <FaFilter aria-hidden="true" />
              <select
                value={draftFilters.status}
                onChange={(e) => onChangeFilter('status', e.target.value)}
                className="focus:outline-none cursor-pointer"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center w-full">
          <button
            onClick={applyFilters}
            className="px-4 w-1/3 py-1 bg-brand-blue text-white rounded-lg hover:bg-blue-shadow1"
          >
            Apply filter
          </button>
        </div>
      </div>

      <div className="text-sm rounded-md flex justify-center gap-2 max-w-[300px] h-full">
        <button
          onClick={() =>
            Router.push('/pages/account/admin/purchases/new-purchase')
          }
          className="px-1 shadow-md bg-blue-shadow1 text-text-white rounded-md hover:bg-brand-blue p-1 whitespace-nowrap"
        >
          Record new purchase
        </button>
      </div>
    </div>
  );
};

export default PurchasesAndSupplyFilters;
