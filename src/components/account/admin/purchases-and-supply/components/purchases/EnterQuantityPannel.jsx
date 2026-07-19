import ErrorInterface from '@/components/account/errorInterface';
import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const EnterQuantityPannel = ({
  material,
  setMaterial,
  onCloseSelectItemPannel,
  onChangePurchaseRecord,
  purchaseRecord,
  setOpenEnterQuantityPannel,
}) => {
  const [validationError, setValidationError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onUpdatePurchaseItems = (e) => {
    setValidationError(null);
    if (!material.quantity || Number(material.quantity) <= 0) {
      setValidationError('Please enter valid quantity.');
      return;
    }
    if (!material.totalCost || Number(material.totalCost) <= 0) {
      setValidationError('Please enter valid total cost.');
      return;
    }

    //check that expiry date is in the future, if provided
    if (material.expiryDate) {
      const selectedTimestamp = new Date(material.expiryDate).getTime();
      const dateNow = Date.now();
      if (selectedTimestamp <= dateNow) {
        setValidationError('Error, expiry date cannot be in the past.');
        return;
      }
    }

    let updatedItemsList = [];

    const existingItems = Array.isArray(purchaseRecord?.items)
      ? purchaseRecord.items
      : [];

    const newItem = {
      materialId: material._id || material.materialId || null, // Use the existing materialId if available, otherwise use _id
      name: material.name,
      unitOfMeasurement: material.unitOfMeasurement,
      quantity: Number(material.quantity),
      totalCost: Number(material.totalCost),
      brand: material.brand || null,
      expiryDate: material.expiryDate || null,
    };

    const addItem = () => {
      updatedItemsList = [...existingItems, newItem];
    };

    const updateItem = () => {
      updatedItemsList = existingItems.map((item, index) => {
        if (index === material.index) {
          return newItem; // Replace the item at the specified index with the updated item
        }
        return item;
      });
    };

    const isEditingExistingItem =
      material?.isUpdate === true &&
      material?.index !== undefined &&
      material?.index !== null;

    if (isEditingExistingItem) {
      updateItem();
    } else {
      addItem();
    }

    onChangePurchaseRecord('items', updatedItemsList);
    setOpenEnterQuantityPannel(false);
    onCloseSelectItemPannel(e); // Close the SelectItemPannel after adding the item
  };

  const onClose = (e) => {
    setOpenEnterQuantityPannel(false);
    material.isUpdate && onCloseSelectItemPannel(e); // Close the SelectItemPannel if editing an item
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
            Quantity in {material?.unitOfMeasurement ?? ''}:
          </label>
          <span className="flex flex-row items-center gap-2">
            <input
              type="number"
              placeholder="Enter quantity"
              name="quantity"
              value={material?.quantity || ''}
              onChange={handleChange}
              className="border-2 border-gray-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <span className="text-sm ml-2 text-brand-blue font-semibold">
              {material?.unitOfMeasurement ?? ''}
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
              value={material?.totalCost || ''}
              onChange={handleChange}
              className="border-2 border-gray-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </span>
        </li>
        {/* Display unit cost */}
        {material?.totalCost && material?.quantity && (
          <li className="flex flex-row items-center gap-2">
            <label className="text-sm">Cost per unit:</label>
            <span className="font-semibold text-brand-blue">
              {(Number(material.totalCost) / Number(material.quantity)).toFixed(
                2
              )}
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
              value={material?.brand || ''}
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
              value={material?.expiryDate || ''}
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
          onClick={onUpdatePurchaseItems}
          className={`flex flex-row items-center gap-2 w-fit p-2 rounded-md text-text-white ${material?.isUpdate ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-brand-blue hover:bg-blue-shadow1'}`}
        >
          <FaCheckCircle className="text-white text-lg" />
          {material?.isUpdate ? 'Update Item' : 'Add Item'}
        </button>
      </span>
    </div>
  );
};

export default EnterQuantityPannel;
