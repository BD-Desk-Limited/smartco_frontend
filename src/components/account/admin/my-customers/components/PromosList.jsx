import Spinner from '@/components/account/Spinner';
import { formatDate } from '@/utilities/formatTime';
import { capitalizeFirst } from '@/utilities/stringUtils';
import React from 'react';
import { FaChevronDown, FaChevronLeft, FaGift } from 'react-icons/fa';

const PromosList = ({
  options,
  setOpenStatusesDropDown,
  filterDraft,
  openStatusesDropDown,
  onStatusChange,
  PROMO_STATUSES,
  onDateChange,
  applyFilter,
  loading,
  promos,
  error,
  selectedId,
  setSelectedId,
  PHASE,
  branchText,
  resetFilter,
  setForm,
}) => {
  return (
    <div className="text-text-gray">
      <div className="flex flex-wrap items-center justify-between gap-2 my-2">
        <p className="text-sm">
          {options.permissions.canManage
            ? 'Promos reward customers automatically when they meet your rules. Redeeming happens at the till.'
            : 'Promos running for your branches, and the customers who earned them.'}
        </p>
        {options.permissions.canManage && (
          <button
            onClick={() => setForm({ promo: null })}
            className="p-2 shadow-md bg-brand-blue text-text-white rounded-md hover:bg-blue-shadow1 whitespace-nowrap flex flex-row gap-1 items-center"
          >
            {' '}
            <FaGift />
            Create New promo
          </button>
        )}
      </div>

      {/* filter */}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-border p-2">
        <div className="flex w-full sm:w-auto md:min-w-[180px] flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-text-gray">
            Status
          </label>
          <div className="group relative">
            <summary
              onClick={() => {
                setOpenStatusesDropDown((prev) => !prev);
              }}
              className="flex h-9 cursor-pointer list-none items-center justify-between rounded-md border border-gray-border bg-white px-2 text-sm text-text-black focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <span className="flex justify-between w-full">
                {filterDraft.status === 'all'
                  ? 'All statuses'
                  : filterDraft.status.length === 0
                    ? 'Select statuses'
                    : filterDraft.status.length === 1
                      ? capitalizeFirst(filterDraft.status[0])
                      : `${filterDraft.status.length} statuses selected`}
                {openStatusesDropDown ? <FaChevronDown /> : <FaChevronLeft />}
              </span>
            </summary>

            {openStatusesDropDown && (
              <div className="absolute left-0 top-full z-40 mt-1 max-h-60 w-full md:min-w-[180px] overflow-y-auto rounded-md border border-gray-border bg-white p-2 shadow-lg">
                <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-1 py-1">
                  <input
                    type="checkbox"
                    checked={filterDraft.status === 'all'}
                    onChange={(e) => onStatusChange('all', e.target.checked)}
                  />
                  All statuses
                </label>
                {PROMO_STATUSES.map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-1 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={
                        filterDraft.status === 'all' ||
                        filterDraft.status.includes(value)
                      }
                      onChange={(e) => onStatusChange(value, e.target.checked)}
                    />
                    {capitalizeFirst(value)}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full sm:w-auto md:min-w-[170px] flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-text-gray">
            From
          </label>
          <input
            type="date"
            value={filterDraft.dateRange.from}
            onChange={(e) => onDateChange('from', e.target.value)}
            className="h-9 rounded-md border border-gray-border bg-white px-2 text-sm text-text-black focus:outline-none"
            aria-label="Filter promos from date"
          />
        </div>

        <div className="flex w-full sm:w-auto md:min-w-[170px] flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-text-gray">
            To
          </label>
          <input
            type="date"
            value={filterDraft.dateRange.to}
            onChange={(e) => onDateChange('to', e.target.value)}
            className="h-9 rounded-md border border-gray-border bg-white px-2 text-sm text-text-black focus:outline-none"
            aria-label="Filter promos to date"
          />
        </div>

        <div className="ml-auto flex items-end gap-2">
          <button
            onClick={applyFilter}
            className="h-9 rounded-md bg-brand-blue px-4 text-sm font-medium text-white hover:bg-blue-shadow1"
          >
            Apply filter
          </button>
          <button
            onClick={resetFilter}
            className="h-9 rounded-md border border-gray-border bg-white px-4 text-sm font-medium text-text-gray hover:bg-gray-shadow10"
          >
            Reset
          </button>
        </div>
      </div>

      {error && <p className="text-error">{error}</p>}
      {loading || (!promos && !error) ? (
        <Spinner />
      ) : (
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin my-2">
          {promos?.length ? (
            <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 xl:grid-cols-3">
              {promos.map((p) => {
                const isSelected = selectedId === p._id;

                return (
                  <button
                    key={p._id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(p._id)}
                    className={`group w-full overflow-hidden rounded-xl text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 ${
                      isSelected
                        ? 'border-brand-green ring-2 ring-green-shadow9'
                        : 'border-green-shadow8'
                    } bg-green-shadow8`}
                  >
                    <div className="bg-green-shadow3 px-5 py-4 relative text-text-black">
                      {
                        <span
                          className={`px-2 py-1 rounded-full shadow-sm absolute top-1 right-1 ${PHASE[p.phase].style}`}
                        >
                          {PHASE[p.phase].label}
                        </span>
                      }
                      <div className="break-words flex flex-row gap-1 items-center">
                        <FaGift className="text-base" />
                        <h2 className="text-base font-semibold uppercase tracking-widest ">
                          {p.name}
                        </h2>
                      </div>
                    </div>

                    <div className="relative bg-green-shadow7 px-5 py-4">
                      <div
                        aria-hidden="true"
                        className="absolute -left-2 top-0 h-4 w-4 -translate-y-1/2 rounded-full border border-gray-shadow8 bg-white"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -right-2 top-0 h-4 w-4 -translate-y-1/2 rounded-full border border-gray-shadow8 bg-white"
                      />
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-black">
                        Your customers get:
                      </p>
                      <p className="mt-1 min-h-12 break-words text-base font-mono text-brand-green">
                        {p.offer.description}
                      </p>

                      <div className="my-4 border-t-2 border-dashed border-brand-green" />

                      <div className="space-y-2 text-xs text-text-gray">
                        <div className="flex justify-between gap-3">
                          <span className=" text-text-black">Period:</span>
                          <span className=" font-semibold text-right text-text-black">
                            {formatDate(new Date(p.startsAt))} to{' '}
                            {formatDate(new Date(p.endsAt))}
                          </span>
                        </div>
                        <div className=" flex justify-between gap-3">
                          <span className="text-text-black">Branches:</span>
                          <span className="font-semibold text-right text-text-black">
                            {branchText(p)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 divide-x divide-gray-shadow8 rounded-lg bg-gray-shadow10 py-3 text-center">
                        <div className="px-2">
                          <p className="text-lg font-bold text-brand-green">
                            {p.awardedCount}
                            {p.limits.maxTotal ? ` / ${p.limits.maxTotal}` : ''}
                          </p>
                          <p className="text-xs text-brand-green">Given</p>
                        </div>
                        <div className="px-2">
                          <p className="text-lg font-bold text-error">
                            {p.redeemedCount}
                          </p>
                          <p className="text-xs text-error">Used</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[30vh] items-center justify-center text-center font-semibold">
              No promos yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromosList;
