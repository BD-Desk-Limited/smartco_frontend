import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import { fetchUserBranchesById } from '@/services/sampleData';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import PurchaseSummary from './PurchaseSummary';
import Button from '@/components/account/Button';
import { verifyInputText } from '@/utilities/verifyInput';

const PurchaseDetails = ({
  loading,
  setLoading,
  purchaseRecord,
  onOpenSelectItemPannel,
  onChangePurchaseRecord,
  onEditItemClick,
  onDeleteItemClick,
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
    onChangePurchaseRecord('date', dateSelectionString);
  };

  const AddItemButton = ({ buttonText }) => (
    //Add items Button
    <button
      onClick={onOpenSelectItemPannel}
      className="flex flex-row items-center gap-2 text-brand-gray p-2 rounded-md hover:bg-gray-shadow9"
    >
      <FaPlusCircle className="" />
      <span>{buttonText}</span>
    </button>
  );

  const handleSavePurchaseRecord = () => {
    setValidationsError('');

    const compulsoryFields = [
      {
        isStringValue: true,
        name: 'supplier',
        value: purchaseRecord?.supplierId,
      },
      {
        isStringValue: true,
        name: 'purchase date',
        value: purchaseRecord?.date,
      },
      {
        isStringValue: false,
        name: 'purchase items',
        value: purchaseRecord?.items?.length > 0,
      },
      {
        isStringValue: true,
        name: 'Purchase ID',
        value: purchaseRecord?.purchaseId,
      },
      {
        isStringValue: true,
        name: 'Purchase Destination',
        value: purchaseRecord?.destination?._id,
      },
    ];

    const validateCompulsoryFields = () => {
      for (const field of compulsoryFields) {
        if (
          !field?.value ||
          field.value === null ||
          (field.isStringValue && !verifyInputText(field.value).passed)
        ) {
          setValidationsError(`Error: Please enter valid ${field?.name}`);
          return;
        }
      }
    };

    validateCompulsoryFields();

    const dateSelectionString = purchaseRecord?.date;
    const selectedTimestamp = new Date(dateSelectionString).getTime();
    const dateNow = Date.now();

    // Validate purchase date and ensure date is not in future
    if (Number.isNaN(selectedTimestamp) || selectedTimestamp > dateNow) {
      setValidationsError(
        'Please select a valid purchase date. Purchase date cannot be in the future, '
      );

      //clear the date field if invalid date is selected
      onChangePurchaseRecord('date', null);
      return;
    }

    try {
      setLoading(true);
      // TODO: implement save purchase order

      console.log('Saving purchase record:', purchaseRecord);
    } catch (err) {
      console.error('Error saving purchase record', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-h-screen overflow-y-auto no-scrollbar relative">
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
      </div>

      {/* list of items purchased */}
      <div
        className="flex flex-col gap-2 mx-10 my-5 h-[70%] overflow-y-auto scrollbar-thin
       relative"
      >
        <table className="w-full relative">
          <thead className="w-full sticky top-0">
            <tr className="flex flex-row justify-between items-center p-1 border-y border-gray-border bg-gray-shadow4 text-white sticky top-0">
              <td className="font-semibold text-sm w-12 text-left">#</td>
              <td className="font-semibold text-sm w-1/6 text-left">Item</td>
              <td className="font-semibold text-sm w-1/6 text-left">Brand</td>
              <td className="font-semibold text-sm w-1/6 text-left">
                Quantity
              </td>
              <td className="font-semibold text-sm w-1/6 text-left">
                Total cost
              </td>
              <td className="font-semibold text-sm w-1/6 text-left">
                Cost per unit
              </td>
              <td className="font-semibold text-sm w-1/6 text-left">
                Expiry Date
              </td>
              <td className="font-semibold text-sm w-10 text-left"></td>
            </tr>
          </thead>

          <tbody className="h-full overflow-y-auto scrollbar-thin px-2 w-full">
            {purchaseRecord?.items?.length > 0 ? (
              purchaseRecord.items.map((item, index) => (
                <tr
                  key={index}
                  className="w-full  flex flex-row border-b border-gray-border text-sm py-1 hover:bg-gray-shadow9"
                >
                  <td className="w-12 text-left">{index + 1}</td>
                  <td className="w-1/6 text-left">{item.name}</td>
                  <td className="w-1/6 text-left">{item.brand || '-'}</td>
                  <td className="w-1/6 text-left">
                    {commaNumberFormat(item.quantity)} {item.unitOfMeasurement}
                  </td>
                  <td className="w-1/6 text-left">
                    {commaNumberFormat(item.totalCost, 2)}
                  </td>
                  <td className="w-1/6 text-left">
                    {commaNumberFormat(
                      Number(item.totalCost) / Number(item.quantity),
                      2
                    ) || 0}
                  </td>
                  <td className="w-1/6 text-left">
                    {ISOStringToLocalTime(item.expiryDate)}
                  </td>
                  <td className="w-10 text-left flex flex-row items-center gap-2">
                    <FaEdit
                      className="cursor-pointer"
                      title="Edit item"
                      onClick={(e) => onEditItemClick(e, index)}
                    />
                    <FaTrash
                      className="cursor-pointer"
                      title="Delete item"
                      onClick={(e) => onDeleteItemClick(e, index)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr className="w-full py-5 h-full flex flex-col justify-center items-center gap-2">
                <td colSpan="6" className="text-text-gray text-center">
                  No items added to this purchase.
                </td>
                <td>
                  <AddItemButton buttonText="Add a purchase item" />
                </td>
              </tr>
            )}
          </tbody>

          {/* Add item button and summary at the bottom of the table if there are items in the purchase*/}
          {purchaseRecord?.items?.length > 0 && (
            <tfoot className="w-full sticky bottom-0 bg-text-white drop-shadow-lg p-2">
              <tr className="w-full h-full flex flex-col justify-center items-center">
                <td className="mt-2">
                  <AddItemButton buttonText="Add another purchase item" />
                </td>
              </tr>

              {/* summary of purchase */}
              <PurchaseSummary data={purchaseRecord} />
            </tfoot>
          )}
        </table>
      </div>

      <div className="w-full flex items-center py-1"></div>

      {/* Save purchase button and error display */}

      <div className="w-full py-2 sticky bottom-0 bg-text-white flex flex-col justify-end items-end px-5 gap-2">
        {/* error display */}
        <p className="">
          {validationsError && <ErrorInterface error={validationsError} />}
        </p>
        <Button
          icon={FaSave}
          iconAfterText={false}
          buttonStyle={`w-1/4 bg-brand-green hover:bg-green-shadow1`}
          onClick={handleSavePurchaseRecord}
        />
      </div>
    </div>
  );
};

export default PurchaseDetails;
