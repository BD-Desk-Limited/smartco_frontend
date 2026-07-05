import ErrorInterface from '@/components/account/errorInterface';
import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const EnterQuantityPannel = ({
  material,
  onClose,
  onCloseSelectItemPannel,
  onChangePurchaseRecord,
  purchaseRecord,
}) => {
  const [materialPurchaseDetails, setMaterialPurchaseDetails] = React.useState(
    {}
  );
  const [validationError, setValidationError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialPurchaseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onAddPurchaseItem = (e, material) => {
    setValidationError(null);
    if (
      !materialPurchaseDetails.quantity ||
      Number(materialPurchaseDetails.quantity) <= 0
    ) {
      setValidationError('Please enter valid quantity.');
      return;
    }
    if (
      !materialPurchaseDetails.totalCost ||
      Number(materialPurchaseDetails.totalCost) <= 0
    ) {
      setValidationError('Please enter valid total cost.');
      return;
    }

    //check that expiry date is in the future, if provided
    if (materialPurchaseDetails.expiryDate) {
      const selectedTimestamp = new Date(
        materialPurchaseDetails.expiryDate
      ).getTime();
      const dateNow = Date.now();
      if (selectedTimestamp <= dateNow) {
        setValidationError('Error, expiry date cannot be in the past.');
        return;
      }
    }

    // Add the material to the purchase record (ensure items is iterable)
    const existingItems = Array.isArray(purchaseRecord?.items)
      ? purchaseRecord.items
      : [];

    const newItem = {
      materialId: material._id,
      name: material.name,
      unitOfMeasurement: material.unitOfMeasurement?.name,
      quantity: Number(materialPurchaseDetails.quantity),
      totalCost: Number(materialPurchaseDetails.totalCost),
      brand: materialPurchaseDetails.brand || null,
      expiryDate: materialPurchaseDetails.expiryDate || null,
    };

    const updatedItems = [newItem, ...existingItems];
    onChangePurchaseRecord('items', updatedItems);
    onClose();
    onCloseSelectItemPannel(e); // Close the SelectItemPannel after adding the item
  };

  return (
    <div className="flex flex-col bg-white w-80 h-auto gap-3 rounded-lg p-3 relative">
      {/* Close button */}
      <span
        onClick={onClose}
        title="close"
        className="absolute top-0 right-0 p-2 rounded-full bg-gray-shadow5 hover:bg-error-hover cursor-pointer"
      >
        <FaTimes className="text-text-white" />
      </span>

      <span className="font-semibold text-brand-blue">Item purchased:</span>

      <ul className="flex flex-col my-5 gap-2">
        <li className="font-semibold">
          {material?.name || 'unnamed material'}
        </li>

        {/* Enter quantity */}
        <li>
          <label className="text-sm">
            Quantity in {material?.unitOfMeasurement?.name ?? ''}:
          </label>
          <span className="flex flex-row items-center gap-2">
            <input
              type="number"
              placeholder="Enter quantity"
              name="quantity"
              value={materialPurchaseDetails?.quantity || ''}
              onChange={handleChange}
              className="border-2 border-gray-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <span className="text-sm ml-2 text-brand-blue font-semibold">
              {material?.unitOfMeasurement?.name ?? ''}
            </span>
          </span>
        </li>

        {/* Enter total cost of item */}
        <li>
          <label className="text-sm">Total cost:</label>
          <span className="flex flex-row items-center gap-2">
            <input
              type="number"
              placeholder="Enter total cost"
              name="totalCost"
              value={materialPurchaseDetails?.totalCost || ''}
              onChange={handleChange}
              className="border-2 border-gray-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </span>
        </li>

        {/* Display unit cost */}
        {materialPurchaseDetails?.totalCost &&
          materialPurchaseDetails?.quantity && (
            <li className="flex flex-row items-center gap-2">
              <label className="text-sm">Cost per unit:</label>
              <span className="font-semibold text-brand-blue">
                {(
                  Number(materialPurchaseDetails.totalCost) /
                  Number(materialPurchaseDetails.quantity)
                ).toFixed(2)}
              </span>
            </li>
          )}

        {/* Enter brand of item */}
        <li className="flex flex-col gap-1 w-full">
          <label className="text-sm">Brand (optional):</label>
          <span className="flex flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Item Brand"
              name="brand"
              value={materialPurchaseDetails?.brand || ''}
              onChange={handleChange}
              className="border-2 border-gray-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </span>
        </li>

        {/* Expiry date */}
        <li>
          <label className="text-sm">Expiry date (optional):</label>
          <span className="flex flex-row items-center gap-2">
            <input
              type="datetime-local"
              placeholder="Enter expiry date and time"
              name="expiryDate"
              value={materialPurchaseDetails?.expiryDate || ''}
              onChange={handleChange}
              className="border-2 border-gray-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </span>
        </li>
      </ul>

      {validationError && (
        <span className="text-sm font-semibold w-full text-center">
          <ErrorInterface error={validationError} />
        </span>
      )}

      <span className="flex flex-row items-center justify-end gap-2">
        <button
          onClick={(e) => onAddPurchaseItem(e, material)}
          className="flex flex-row items-center gap-2 w-fit bg-brand-blue p-2 rounded-md text-text-white hover:bg-blue-shadow1"
        >
          <FaCheckCircle className="text-white text-lg" />
          Add item
        </button>
      </span>
    </div>
  );
};

export default EnterQuantityPannel;
