import React, { useCallback, useEffect, useState } from 'react';
import PageDescription from '@/components/account/PageDescription';
import { useRouter } from 'next/navigation';
import Header from '@/components/account/AdminHeader';
import SubHeader from '../../../SubHeader';
import SideBar from '../../../SideBar';
import { PURCHASES_AND_SUPPLY_SUBMENUS } from '../PurchasesAndSupplySubMenus';
import { FaChevronDown, FaShippingFast } from 'react-icons/fa';
import SelectSupplierPannel from './SelectSupplierPannel';
import { fetchSuppliersData } from '@/services/sampleData';
import { getAllMaterials } from '@/services/materialServices';
import Spinner from '@/components/account/Spinner';
import PurchaseDetails from './PurchaseDetails';
import SelectItemPannel from './SelectItemPannel';

const NewPurchase = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [suppliers, setSuppliers] = React.useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = React.useState(null);
  const [openSupplierSelectPannel, setOpenSupplierSelectPannel] =
    React.useState(false);
  const [openSelectItemPannel, setOpenSelectItemPannel] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [purchaseRecord, setPurchaseRecord] = useState({
    supplierId: '',
    vendorName: '',
    destination: '',
    date: null,
    purchaseId: '',
    items: [],
  });
  const router = useRouter();
  const OPEN_MARKET_ID = 'open_market';

  // Fetch suppliers data on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await fetchSuppliersData();

        if (response.error) {
          setSuppliers([]);
          return;
        }

        setSuppliers(response.data);
      } catch (err) {
        console.error(err, 'error fetching suppliers');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

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

  console.log('record:', purchaseRecord);

  if (loading) return <Spinner />;

  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'New Purchase Record'} />
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
              <div className="flex flex-row items-center w-full gap-10">
                <div className="flex flex-col w-full gap-1">
                  <label className="font-semibold text-sm text-text-black">
                    Select purchase supplier
                  </label>

                  <div
                    onClick={(e) => openSelectSupplierPannel(e)}
                    className="h-8 px-2 border border-gray-border rounded-md flex flex-row items-center w-full"
                  >
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
                  className="font-thin text-xs w-fit bg-error text-text-white p-0.5 rounded-full shadow-md cursor-pointer hover:bg-red-500"
                >
                  change supplier
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

            {/* Selected supplier on the order */}
            {selectedSupplier && (
              <PurchaseDetails
                loading={loading}
                setLoading={setLoading}
                purchaseRecord={purchaseRecord}
                setPurchaseRecord={setPurchaseRecord}
                onChangePurchaseRecord={onChangePurchaseRecord}
                onOpenSelectItemPannel={onOpenSelectItemPannel}
                onCloseSelectItemPannel={onCloseSelectItemPannel}
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
                  setSelectedSupplier={setSelectedSupplier}
                  setOpenSupplierSelectPannel={setOpenSupplierSelectPannel}
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
                  onChangePurchaseRecord={onChangePurchaseRecord}
                  purchaseRecord={purchaseRecord}
                />
              </div>
            )}
          </div>

          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchase;
