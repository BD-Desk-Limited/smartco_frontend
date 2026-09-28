import React, { useCallback, useEffect, useState } from 'react';
import PageDescription from '@/components/account/PageDescription';
import { useRouter } from 'next/navigation';
import Header from '@/components/account/AdminHeader';
import SubHeader from '../../../SubHeader';
import SideBar from '../../../SideBar';
import { PURCHASES_AND_SUPPLY_SUBMENUS } from '../PurchasesAndSupplySubMenus';
import {
  FaAdjust,
  FaChevronDown,
  FaEdit,
  FaExchangeAlt,
  FaRegEdit,
  FaShippingFast,
} from 'react-icons/fa';
import { fetchSuppliersByCompanyIdService } from '@/services/purchaseAndSupplyServices';
import SelectSupplierPannel from './SelectSupplierPannel';
import { getAllMaterials } from '@/services/materialServices';
import Spinner from '@/components/account/Spinner';
import PurchaseDetails from './PurchaseDetails';
import SelectItemPannel from './SelectItemPannel';
import { savePurchaseRecordService } from '@/services/purchaseAndSupplyServices';
import WarningWithFeedbackModal from '@/components/account/WarningWithFeedbackModal';

const NewPurchaseRecord = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [suppliers, setSuppliers] = React.useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = React.useState(null);
  const [openSupplierSelectPannel, setOpenSupplierSelectPannel] =
    React.useState(false);
  const [openSelectItemPannel, setOpenSelectItemPannel] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [openEnterQuantityPannel, setOpenEnterQuantityPannel] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const emptyForm = {
    supplierId: '',
    vendorName: '',
    destination: '',
    date: null,
    purchaseId: '',
    items: [],
  };
  const [purchaseRecord, setPurchaseRecord] = useState(emptyForm);
  const [openSavePurchaseRecordModal, setOpenSavePurchaseRecordModal] =
    useState(false);

  const [validationsError, setValidationsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [searchMessage, setSearchMessage] = useState(
    'Enter at least 3 characters and click search, or select open market...'
  );
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const router = useRouter();
  const OPEN_MARKET_ID = 'open_market';

  //Fetch company materials data on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await getAllMaterials();

        if (response.error) {
          setMaterials([]);
          return;
        }

        setMaterials(response.data);
      } catch (err) {
        console.error(err, 'error fetching materials');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Fetch suppliers data on component mount
  const fetchSuppliers = async (page = 1, term = searchTerm) => {
    if (term.length < 3) {
      setSearchMessage('Enter at least 3 characters to search');
      return;
    }

    try {
      console.log('Params for fetchSuppliers:', {
        searchTerm: term,
        lastSearchTerm: lastSearchTerm,
        page: page,
      });

      setLoading(true);
      const response = await fetchSuppliersByCompanyIdService({
        searchTerm: term,
        page,
      });

      if (response.data && response.data.suppliers) {
        setSuppliers(response.data.suppliers);
        if (response.data.suppliers.length === 0) {
          setSearchMessage(
            `No suppliers found for term: ${searchTerm} associated with your company`
          );
        }
        setPagination(response.data.pagination);
        setLastSearchTerm(term);
        return;
      }

      setSuppliers([]);
      setSearchMessage(
        response.error || 'Error fetching suppliers, please try again'
      );
    } catch (err) {
      console.error(err, 'error fetching suppliers');
    } finally {
      setLoading(false);
    }
  };

  const openSelectSupplierPannel = (e) => {
    e.stopPropagation();
    setOpenSupplierSelectPannel(true);
  };

  const closeSelectSupplierPannel = (e) => {
    e.stopPropagation();
    setOpenSupplierSelectPannel(false);
  };

  const onCloseSelectItemPannel = (e) => {
    e.stopPropagation();
    setOpenSelectItemPannel(false);
  };

  const onOpenSelectItemPannel = (e) => {
    e.stopPropagation();
    setOpenSelectItemPannel(true);
  };

  const onChangePurchaseRecord = useCallback((field, value) => {
    setPurchaseRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetForm = () => {
    setPurchaseRecord(emptyForm);
  };

  const handleEditItem = (e, itemIndex) => {
    e.stopPropagation();
    //find the item to edit in the purchaseRecord.items array
    const item = purchaseRecord?.items[itemIndex] || null;

    if (item && item.materialId) {
      const itemToEdit = item;
      itemToEdit.isUpdate = true; // Mark the item as being updated
      itemToEdit.index = itemIndex; // Store the index of the item being edited
      setSelectedMaterial(itemToEdit);
      onOpenSelectItemPannel(e); // Open the SelectItemPannel for editing
      setOpenEnterQuantityPannel(true); // Open the EnterQuantityPannel for editing
    }
  };

  const handleDeleteItem = (e, itemIndex) => {
    e.stopPropagation();

    const deletePurchaseItem = () => {
      const updatedItems =
        purchaseRecord?.items?.filter((_, index) => index !== itemIndex) || [];
      onChangePurchaseRecord('items', updatedItems);
    };

    itemIndex !== undefined &&
      purchaseRecord?.items[itemIndex] &&
      deletePurchaseItem();
  };

  const closeConfirmSavePurchaseModal = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setOpenSavePurchaseRecordModal(false);
  };

  const onOKClick = () => {
    setOpenSavePurchaseRecordModal(false);
    setErrorMessage(null);
    setSuccessMessage(null);

    router.push('/pages/account/admin/purchases');
  };

  const handleSavePurchaseRecord = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const { data, error } = await savePurchaseRecordService(purchaseRecord);

      if (data) {
        setErrorMessage(null);
        setSuccessMessage(data.message || 'Purchase record saved successfully');
        setPurchaseRecord(emptyForm); // Reset the form after successful save
        return;
      }

      if (error) {
        setErrorMessage(error);
        console.error(error);
        return;
      }
    } catch (err) {
      console.error('Error saving purchase record', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="h-full w-full relative">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Enter New Purchase Record'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="new-purchase"
            sideBarSubmenus={PURCHASES_AND_SUPPLY_SUBMENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>

        <div className="flex flex-col h-full w-full relative p-1 text-text-gray">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-[80%] flex flex-col gap-3">
            {/* Select supplier */}
            {!selectedSupplier ? (
              <div className="flex flex-row items-center w-full h-full gap-10">
                <div
                  onClick={(e) => openSelectSupplierPannel(e)}
                  className="flex flex-col justify-center items-center w-full gap-1"
                >
                  <label className="font-semibold text-sm text-text-black">
                    Select purchase supplier
                  </label>

                  <div className="h-8 px-2 border border-gray-border rounded-md flex flex-row items-center w-full">
                    <span className="flex flex-row justify-between items-center gap-5 w-full cursor-pointer">
                      <span>Select supplier</span>
                      <FaChevronDown />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-brand-blue">Purchase from</span>

                <span className="flex flex-row items-center gap-2 font-semibold">
                  <span className="bg-brand-blue p-1 rounded-full">
                    <FaShippingFast className="text-text-white text-lg" />
                  </span>
                  <span>{selectedSupplier?.name || 'unnamed supplier'}</span>
                </span>
                {/* change supplier button */}
                <span
                  onClick={() => setOpenSupplierSelectPannel(true)}
                  title="change supplier"
                  className="font-thin text-xs w-fit bg-error text-text-white py-0.5 px-1 rounded-full shadow-black shadow-md cursor-pointer hover:bg-red-400 hover:text-text-black flex flex-row gap-2"
                >
                  <span>change supplier</span>
                  <FaExchangeAlt />
                </span>

                {/* Vendor name for open market */}
                {selectedSupplier &&
                  selectedSupplier._id &&
                  selectedSupplier._id === OPEN_MARKET_ID && (
                    <div className="flex flex-col justify-start w-auto gap-1 my-1 mx-5">
                      <label className="text-text-black text-sm font-semibold">
                        Vendor name <span className="italic">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={purchaseRecord?.vendorName || ''}
                        onChange={(e) =>
                          onChangePurchaseRecord('vendorName', e.target.value)
                        }
                        placeholder="enter vendor / supplier name..."
                        className="py-1 border border-gray-border rounded-md px-2 focus:outline-brand-blue"
                      />
                    </div>
                  )}
              </div>
            )}

            <hr />

            {/* If Selected supplier on the order, show purchase details */}
            {selectedSupplier && (
              <PurchaseDetails
                loading={loading}
                setLoading={setLoading}
                purchaseRecord={purchaseRecord}
                resetForm={resetForm}
                onChangePurchaseRecord={onChangePurchaseRecord}
                onOpenSelectItemPannel={onOpenSelectItemPannel}
                onEditItemClick={handleEditItem}
                onDeleteItemClick={handleDeleteItem}
                setOpenSavePurchaseRecordModal={setOpenSavePurchaseRecordModal}
                closeConfirmSavePurchaseModal={closeConfirmSavePurchaseModal}
                validationsError={validationsError}
                setValidationsError={setValidationsError}
              />
            )}

            {openSupplierSelectPannel && (
              <div
                onClick={(e) => closeSelectSupplierPannel(e)}
                className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-center items-center "
              >
                <SelectSupplierPannel
                  loading={loading}
                  OPEN_MARKET_ID={OPEN_MARKET_ID}
                  setPurchaseRecord={setPurchaseRecord}
                  suppliers={suppliers}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  lastSearchTerm={lastSearchTerm}
                  searchMessage={searchMessage}
                  setSelectedSupplier={setSelectedSupplier}
                  setOpenSupplierSelectPannel={setOpenSupplierSelectPannel}
                  fetchSuppliers={fetchSuppliers}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              </div>
            )}

            {openSelectItemPannel && (
              <div
                onClick={onCloseSelectItemPannel}
                className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-center items-center "
              >
                <SelectItemPannel
                  onCloseSelectItemPannel={onCloseSelectItemPannel}
                  materials={materials}
                  setMaterials={setMaterials}
                  onChangePurchaseRecord={onChangePurchaseRecord}
                  purchaseRecord={purchaseRecord}
                  selectedMaterial={selectedMaterial}
                  setSelectedMaterial={setSelectedMaterial}
                  openEnterQuantityPannel={openEnterQuantityPannel}
                  setOpenEnterQuantityPannel={setOpenEnterQuantityPannel}
                  validationsError={validationsError}
                  setValidationsError={setValidationsError}
                />
              </div>
            )}
          </div>

          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>

      {openSavePurchaseRecordModal && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-center items-center ">
          <WarningWithFeedbackModal
            warningMessage={
              'Are you sure your data is correct, and you want to save this purchase record? '
            }
            subText={
              'Only admin can make a change to this purchase, after you have submitted'
            }
            title={'Save purchase record?'}
            buttonStyle={`bg-brand-green hover:bg-green-shadow1`}
            button2Style={`bg-error hover:bg-error`}
            onClose={closeConfirmSavePurchaseModal}
            onConfirm={handleSavePurchaseRecord}
            onOKClick={onOKClick}
            responseErrors={[errorMessage]}
            responseMessages={[successMessage]}
            loading={loading}
            confirmationText={'Confirm'}
          />
        </div>
      )}
    </div>
  );
};

export default NewPurchaseRecord;
