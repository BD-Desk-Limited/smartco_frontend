import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import PurchaseSummary from './PurchaseSummary';
import Button from '@/components/account/Button';
import { verifyInputText } from '@/utilities/verifyInput';
import { getUserBranchesService } from '@/services/branchServices';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const PurchaseDetails = ({
  loading,
  purchaseRecord,
  onOpenSelectItemPannel,
  onChangePurchaseRecord,
  onEditItemClick,
  onDeleteItemClick,
  setOpenSavePurchaseRecordModal,
  validationsError,
  setValidationsError,
}) => {
  const [userBranches, setUserBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await getUserBranchesService();
        if (response.data) {
          setUserBranches(response.data);
        } else if (response.error) {
          console.error(response.error, 'error fetching branches');
        }
      } catch (err) {
        console.error(err, 'error fetching branches');
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

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

  const onSavePurchaseRecord = () => {
    setValidationsError(null);

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
        value: purchaseRecord?.items?.length > 0 ? true : false,
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
      let errorCollection = [];
      for (const field of compulsoryFields) {
        if (
          !field?.value ||
          field.value === null ||
          (field.isStringValue && !verifyInputText(field.value).passed)
        ) {
          errorCollection.push(`Error: Please enter valid ${field?.name}`);
        } else {
          continue;
        }
      }

      if (errorCollection.length > 0) {
        setValidationsError(errorCollection[0]);
        return false;
      }
      return true;
    };

    const passedValidation = validateCompulsoryFields();

    if (passedValidation) {
      setOpenSavePurchaseRecordModal(true);
    }
  };

  if (loading || branchesLoading) return <Spinner />;

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 md:mx-10">
        {/* select destination branch */}
        <div className="flex flex-col justify-start w-full md:w-fit gap-1 md:my-1 md:mx-5">
          <label className="text-text-black text-sm font-semibold">
            Purchase Destination
          </label>
          <select
            value={purchaseRecord?.destination?._id ?? ''}
            onChange={handleBranchChange}
            className="h-10 md:h-auto py-1 border border-gray-border rounded-md px-2 focus:outline-brand-blue bg-white text-base md:text-sm"
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
        <div className="flex flex-col justify-start w-full md:w-fit gap-1 md:my-1 md:mx-5">
          <label className="text-text-black text-sm font-semibold">
            Purchase Date / Time
          </label>
          <input
            type="datetime-local"
            onChange={handleDateChange}
            value={purchaseRecord?.date || ''}
            className="h-10 md:h-auto py-1 border border-gray-border rounded-md px-2 focus:outline-brand-blue bg-white text-base md:text-sm"
          />
        </div>

        {/* purchase/Invoice Id */}
        <div className="flex flex-col justify-start w-full md:w-fit gap-1 md:my-1 md:mx-5">
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
            className="h-10 md:h-auto py-1 border border-gray-border rounded-md px-2 focus:outline-brand-blue text-base md:text-sm"
          />
        </div>
      </div>

      {/* purchased items: a table from md up, cards on phones */}
      <div className="flex flex-col gap-2 my-4 md:mx-10 md:my-5">
        <p className="md:hidden text-sm font-semibold text-text-black">
          Items purchased
        </p>
        <ResponsiveTable
          align="left"
          dense
          maxHeightClass="md:max-h-[55vh]"
          rows={purchaseRecord?.items || []}
          getRowKey={(_, i) => i}
          emptyMessage="No items added to this purchase."
          columns={[
            {
              key: 'n',
              header: '#',
              mobile: 'hidden',
              cell: (_, i) => i + 1,
            },
            {
              key: 'name',
              header: 'Item',
              mobile: 'title',
              cell: (item, i) => (
                <>
                  <span className="md:hidden">{i + 1}. </span>
                  {item.name}
                </>
              ),
            },
            {
              key: 'brand',
              header: 'Brand',
              mobile: 'subtitle',
              cell: (item) => item.brand || '-',
            },
            {
              key: 'quantity',
              header: 'Quantity',
              cell: (item) => `${commaNumberFormat(item.quantity)} ${item.unitOfMeasurement || ''}`,
            },
            {
              key: 'total',
              header: 'Total cost',
              cell: (item) => commaNumberFormat(item.totalCost, 2),
            },
            {
              key: 'unit',
              header: 'Cost per unit',
              cell: (item) =>
                commaNumberFormat(
                  Number(item.totalCost) / Number(item.quantity),
                  2
                ) || 0,
            },
            {
              key: 'expiry',
              header: 'Expiry Date',
              mobileLabel: 'Expiry',
              cell: (item) =>
                item.expiryDate ? ISOStringToLocalTime(item.expiryDate) : '-',
            },
          ]}
          actionsHeader=""
          actions={(item) => {
            const index = purchaseRecord.items.indexOf(item);
            return (
              <>
                <button
                  type="button"
                  title="Edit item"
                  aria-label={`Edit ${item.name}`}
                  onClick={(e) => onEditItemClick(e, index)}
                  className="rounded-md hover:bg-gray-shadow9"
                >
                  <FaEdit />
                </button>
                <button
                  type="button"
                  title="Delete item"
                  aria-label={`Delete ${item.name}`}
                  onClick={(e) => onDeleteItemClick(e, index)}
                  className="rounded-md hover:bg-gray-shadow9 text-error"
                >
                  <FaTrash />
                </button>
              </>
            );
          }}
          footer={
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-center">
                <AddItemButton
                  buttonText={
                    purchaseRecord?.items?.length > 0
                      ? 'Add another purchase item'
                      : 'Add a purchase item'
                  }
                />
              </div>
              {purchaseRecord?.items?.length > 0 && (
                <div className="border-t border-gray-border pt-2">
                  <PurchaseSummary data={purchaseRecord} asRow={false} />
                </div>
              )}
            </div>
          }
        />
      </div>

      <div className="w-full flex items-center py-1"></div>

      {/* Save purchase button and error display */}
      <div className="w-full py-2 sticky bottom-0 bg-text-white flex flex-col justify-end items-stretch md:items-end md:px-5 gap-2">
        {/* error display */}
        <div>
          {validationsError && <ErrorInterface error={validationsError} />}
        </div>
        <Button
          icon={FaSave}
          iconAfterText={false}
          buttonStyle={`w-full md:w-1/4 bg-brand-green hover:bg-green-shadow1`}
          onClick={onSavePurchaseRecord}
        />
      </div>
    </div>
  );
};

export default PurchaseDetails;
