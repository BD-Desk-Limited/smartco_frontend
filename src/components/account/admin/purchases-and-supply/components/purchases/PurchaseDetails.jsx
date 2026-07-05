import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import { fetchUserBranchesById } from '@/services/sampleData';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaPlusCircle, FaTimes, FaTrash } from 'react-icons/fa';

const PurchaseDetails = ({
  loading,
  setLoading,
  purchaseRecord,
  onOpenSelectItemPannel,
  onCloseSelectItemPannel,
  onChangePurchaseRecord,
}) => {
  const [userBranches, setUserBranches] = useState([]);
  const [validationsError, setValidationsError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await fetchUserBranchesById();
        setUserBranches(response.data);
      } catch (err) {
        console.error(err, 'error fetching branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [setLoading]);

  //link destination branch directly if use has only one branch
  useEffect(() => {
    if (userBranches && userBranches.length === 1) {
      onChangePurchaseRecord('destination', userBranches[0]);
    }
  }, [userBranches, onChangePurchaseRecord]);

  const handleBranchChange = (e) => {
    const selectedId = e.target?.value || '';
    const selectedBranch = userBranches?.find(
      (b) => b._id?.toString() === selectedId?.toString()
    );
    onChangePurchaseRecord('destination', selectedBranch);
  };

  const handleDateChange = (e) => {
    const dateSelectionString = e.target.value;
    /*const selectedTimestamp = new Date(dateSelectionString).getTime();
    const dateNow = Date.now();

    if (Number.isNaN(selectedTimestamp) || selectedTimestamp > dateNow) {
      setValidationsError(
        'Purchase date cannot be in the future, please select a valid date.'
      );

      //clear the date field if invalid date is selected
      onChangePurchaseRecord('date', null);
      return;
    }*/

    onChangePurchaseRecord('date', dateSelectionString);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-row justify-between items-center mx-10">
        {/* select destination branch */}
        <div className="flex flex-col justify-start w-fit gap-1 my-1 mx-5">
          <label className="text-text-black text-sm font-semibold">
            Purchase Destination
          </label>
          <select
            value={purchaseRecord?.destination?._id ?? ''}
            onChange={handleBranchChange}
            className="py-1 border border-gray-border rounded-md px-2 focus:outline-brand-blue"
          >
            <option value="" disabled>
              select destination branch
            </option>
            {userBranches?.length > 0 &&
              userBranches?.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
          </select>
        </div>

        {/* Supply date */}
        <div className="flex flex-col justify-start w-fit gap-1 my-1 mx-5">
          <label className="text-text-black text-sm font-semibold">
            Purchase Date / Time
          </label>
          <input
            type="datetime-local"
            onChange={handleDateChange}
            value={purchaseRecord?.date || ''}
            className="py-1 border border-gray-border rounded-md px-2 focus:outline-brand-blue"
          />
        </div>

        {/* purchase/Invoice Id */}
        <div className="flex flex-col justify-start w-fit gap-1 my-1 mx-5">
          <label className="text-text-black text-sm font-semibold">
            Purchase/Invoice ID
          </label>
          <input
            type="text"
            onChange={(e) =>
              onChangePurchaseRecord('purchaseId', e.target.value)
            }
            value={purchaseRecord?.purchaseId || ''}
            placeholder="ID-00123"
            className="py-1 border border-gray-border rounded-md px-2 focus:outline-brand-blue"
          />
        </div>

        {/* Add items Button */}
        <button
          onClick={onOpenSelectItemPannel}
          className="flex flex-row items-center gap-2 bg-brand-blue p-3 rounded-md text-text-white hover:bg-blue-shadow1"
        >
          <FaPlusCircle className="" />
          <span>Add purchase Item</span>
        </button>
      </div>
      {/* error display */}
      {validationsError && <ErrorInterface error={validationsError} />}

      {/* list of items purchased */}
      <div
        className="flex flex-col gap-2 mx-10 my-5 h-[70%] overflow-y-auto scrollbar-none
       relative"
      >
        <table className="w-full h-full ">
          <thead className="flex flex-row justify-between items-center border-y border-gray-border bg-gray-shadow4 text-white sticky top-0">
            <th className="font-semibold text-sm w-1/6 text-left">Item</th>
            <th className="font-semibold text-sm w-1/6 text-left">Brand</th>
            <th className="font-semibold text-sm w-1/6 text-left">Quantity</th>
            <th className="font-semibold text-sm w-1/6 text-left">
              Total cost
            </th>
            <th className="font-semibold text-sm w-1/6 text-left">
              Cost per unit
            </th>
            <th className="font-semibold text-sm w-1/6 text-left">
              Expiry Date
            </th>
            <th className="font-semibold text-sm w-10 text-left"></th>
          </thead>

          <tbody className="h-full overflow-y-auto scrollbar-thin px-2 w-full">
            {purchaseRecord?.items?.length > 0 ? (
              purchaseRecord.items.map((item, index) => (
                <tr
                  key={index}
                  className="w-full  flex flex-row border-b border-gray-border text-sm py-1 hover:bg-gray-shadow9"
                >
                  <td className="w-1/6 text-left">{item.name}</td>
                  <td className="w-1/6 text-left">{item.brand || '-'}</td>
                  <td className="w-1/6 text-left">
                    {item.quantity} {item.unitOfMeasurement}
                  </td>
                  <td className="w-1/6 text-left">{item.totalCost}</td>
                  <td className="w-1/6 text-left">
                    {(Number(item.totalCost) / Number(item.quantity)).toFixed(
                      2
                    )}
                  </td>
                  <td className="w-1/6 text-left">
                    {ISOStringToLocalTime(item.expiryDate)}
                  </td>
                  <td className="w-10 text-left flex flex-row items-center gap-2">
                    <FaEdit className="cursor-pointer" />
                    <FaTrash className="cursor-pointer" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-text-gray text-center">
                  No items added to this purchase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* summary of purchase */}
      <div></div>

      {/* submit purchase button */}
      <div></div>
    </div>
  );
};

export default PurchaseDetails;
