import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import React from 'react';

const EditTaxBandForm = ({
  taxbandData,
  newTaxBand,
  updateRate,
  setUpdateRate,
  setNewTaxBand,
  loading,
  error,
  onSubmit,
  dateNowToDateTime,
}) => {
  const hasNoChanges =
    taxbandData?.name === newTaxBand?.name &&
    taxbandData?.description === newTaxBand?.description &&
    String(taxbandData?.effectiveRate?.rate) ===
      String(newTaxBand?.effectiveRate?.rate) &&
    String(taxbandData?.effectiveRate?.effectiveDate) ===
      String(newTaxBand?.effectiveRate?.effectiveDate);

  return (
    <div className="w-full h-full relative bg-white rounded-lg shadow-lg flex flex-col p-5 items-center">
      <form
        onSubmit={(e) => onSubmit(e)}
        className=" text-sm flex flex-col w-full gap-7 h-full items-center justify-center"
      >
        {/* Tax band name and rate */}
        <div className="flex flex-row justify-center items-center gap-5 w-[80%]">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-text-black w-fit" htmlFor="name">
              Tax Profile Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter Band Name"
              value={newTaxBand?.name || ''}
              className="border border-gray-border rounded-md p-3 w-full focus:ring-2 focus:ring-brand-blue focus:outline-none"
              onChange={(e) =>
                setNewTaxBand({ ...newTaxBand, name: e.target.value })
              }
            />
          </div>
          {/*Effective Tax Rate */}
          <div className="flex flex-col gap-1 w-full">
            <label
              className="text-text-black text-sm w-fit"
              htmlFor="rate"
            >{`Effective Tax Rate (%)`}</label>
            <input
              id="rate"
              type="number"
              value={taxbandData?.effectiveRate?.rate || ''}
              placeholder="Tax Rate(%)"
              disabled
              className="w-full p-3 border border-gray-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Update rate toggle */}
        <div className="flex items-center gap-2 w-[80%] justify-start">
          <input
            type="checkbox"
            id="updateRate"
            checked={updateRate}
            onChange={(e) => setUpdateRate(e.target.checked)}
            className="form-checkbox h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-border rounded"
          />
          <label className="text-text-black text-sm" htmlFor="updateRate">
            Update Tax Rate
          </label>
        </div>

        {/* New rate & Effective date */}
        <div
          className={`flex flex-row justify-center items-center gap-5 w-[80%] ${updateRate ? '' : 'bg-gray-200 p-2 pointer-events-none opacity-50 rounded-md'}`}
        >
          <div className="flex flex-col gap-1 w-[80%]">
            <label
              className="text-text-black text-sm w-fit"
              htmlFor="rate"
            >{`New Tax Rate (%)`}</label>
            <input
              id="rate"
              type="number"
              value={newTaxBand?.effectiveRate?.rate || ''}
              min={0}
              max={100}
              step={0.01}
              placeholder="Tax Rate(%)"
              disabled={!updateRate}
              className="w-full p-2 border border-gray-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
              onChange={(e) =>
                setNewTaxBand({
                  ...newTaxBand,
                  effectiveRate: {
                    ...newTaxBand?.effectiveRate,
                    rate: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1 w-[80%]">
            <label
              className="text-text-black text-sm w-fit"
              htmlFor="date"
            >{`Effective Date`}</label>
            <input
              id="date"
              type="datetime-local"
              value={
                newTaxBand?.effectiveRate?.effectiveDate || dateNowToDateTime
              }
              placeholder="yyyy-mm-dd"
              disabled={!updateRate}
              className="w-full p-2 border border-gray-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
              onChange={(e) =>
                setNewTaxBand({
                  ...newTaxBand,
                  effectiveRate: {
                    ...newTaxBand?.effectiveRate,
                    effectiveDate: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 w-[80%]">
          <label
            className="text-text-black text-sm w-fit"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            type="text"
            placeholder="Description"
            value={newTaxBand?.description}
            className="w-full h-24 p-2 border border-gray-border rounded-lg mb-2 focus:ring-2 focus:ring-brand-blue focus:outline-none"
            onChange={(e) =>
              setNewTaxBand({ ...newTaxBand, description: e.target.value })
            }
          />
        </div>
        {error && <ErrorInterface error={error} />}
        <button
          type="submit"
          disabled={loading || hasNoChanges}
          className={`bg-brand-blue text-text-white p-3 rounded-md hover:bg-blue-shadow3 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {loading ? 'Updating Tax Band...' : 'Update Tax Band'}
        </button>
      </form>
    </div>
  );
};

export default EditTaxBandForm;
