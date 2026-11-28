import Header from '@/components/account/admin/shell/AdminHeader';
import React, { useEffect, useState } from 'react';
import SubHeader from '../../shell/SubHeader';
import SideBar from '../../shell/SideBar';
import { TAX_MANAGEMENT_SUB_MENUS } from './TaxManagementSideBarItems';
import PageDescription from '@/components/account/common/PageDescription';
import { useAuth } from '@/contexts/authContext';
import {
  FaEdit,
  FaFileExport,
  FaPlus,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import ExportContent from '@/components/account/common/ExportContent';
import Spinner from '@/components/account/common/Spinner';
import {
  deleteTaxBandById,
  getAllTaxBandDetailsByCompanyId,
} from '@/services/taxBandServices';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import WarningModal from '@/components/account/common/WarningModal';
import DeleteModal from '@/components/account/common/DeleteModal';
import TaxBandDetails from './TaxBandDetails';
import SuccessModal from '@/components/account/common/SuccessModal';
import { useRouter } from 'next/navigation';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const TaxManagement = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const router = useRouter();
  const [searchterm, setSearchterm] = useState('');
  const [exportContent, setExportContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBand, setSelectedBand] = useState(null);
  const [bandToDelete, setBandToDelete] = useState(null);
  const [taxBands, setTaxBands] = useState([]);
  const [filteredTaxBands, setFilteredTaxBands] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteErrors, setDeleteErrors] = useState([]);

  useEffect(() => {
    const fetchTaxBands = async () => {
      setLoading(true);
      try {
        const response = await getAllTaxBandDetailsByCompanyId();
        if (response && response.data) {
          setTaxBands(response.data);
        } else {
          console.error('Error fetching taxbands', response?.error);
        }
      } catch (err) {
        console.error('Error fetching taxband data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxBands();
  }, []);

  //filter
  useEffect(() => {
    const filter = (t) => {
      return (
        t.name?.includes(searchterm) ||
        t.associatedBranches?.some((b) => b.name?.includes(searchterm))
      );
    };

    const filtered = (taxBands || []).filter((t) => filter(t));
    setFilteredTaxBands(filtered);
  }, [taxBands, searchterm]);

  //update selected branch if it changes down-stream
  useEffect(() => {
    setTaxBands((prev) => {
      const updatedTaxBands = prev?.map((bd) => {
        if (selectedBand && bd._id === selectedBand._id) return selectedBand;
        return bd;
      });

      return updatedTaxBands;
    });
  }, [selectedBand]);

  const handleDeleteTaxBandClick = (e, band) => {
    e.stopPropagation();
    if (band?.associatedBranches?.length > 0) {
      setModalMessage(
        `You cannot delete "${band?.name || 'this tax band'}" because it is assigned to one or more branches. Please disassociate the branches before deleting this tax band.`
      );
      setShowConfirmationModal(true);
      return;
    }

    setBandToDelete(band);
    setShowDeleteModal(true);
    setModalMessage(
      `Are you sure you want to delete "${band?.name || 'this tax band'}"? This action cannot be undone.`
    ); // Set the confirmation message
  };

  const handleDeleteTaxBandConfirm = async () => {
    try {
      setLoading(true);
      const response = await deleteTaxBandById(bandToDelete._id);
      if (response && response.data) {
        setSuccess(true);
        // Refresh tax bands list
        const updatedTaxBands = taxBands?.filter(
          (band) => band._id !== response?.data._id
        );
        setTaxBands(updatedTaxBands);
        setShowDeleteModal(false);
        setBandToDelete(null);
      } else {
        console.error('Error deleting tax band:', response?.error);
        setDeleteErrors(['Failed to delete tax band. Please try again.']);
      }
    } catch (error) {
      console.error('Error deleting tax band:', error);
      setDeleteErrors([
        'An error occurred while deleting the tax band. Please try again.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTaxBandClick = (e, band) => {
    e.stopPropagation();
    router.push(
      `/pages/account/admin/tax-management/edit-tax-band?id=${band._id}`
    );
  };

  const handleOpenExportContent = () => {
    filteredTaxBands?.length > 0 && setExportContent(true);
  };

  const handleCloseAllModals = () => {
    setExportContent(false);
    setShowConfirmationModal(false);
    setShowDeleteModal(false);
    setSelectedBand(null);
    setBandToDelete(null);
    setModalMessage('');
    setDeleteErrors([]);
    setSuccess(false);
  };

  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Manage Tax Profile'} />
      </div>
      <div className="flex flex-col md:flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="view-tax-band-details"
            sideBarSubmenus={TAX_MANAGEMENT_SUB_MENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-3 md:p-5 mx-2 md:mx-5 mt-2 mb-6 rounded-md flex flex-col gap-5">
            {/* search Input and filter */}
            <div className="flex items-center justify-between gap-3 md:gap-10">
              <div className="h-10 md:h-8 px-3 border border-gray-border rounded-md focus-within:ring focus-within:border-brand-blue flex flex-row items-center w-full">
                <FaSearch className="text-text-gray text-sm" />
                <input
                  type="text"
                  placeholder="Search profile name or associated branch name"
                  value={searchterm}
                  onChange={(e) => setSearchterm(e.target.value)}
                  className="focus:outline-none ml-2 w-full text-sm"
                />
              </div>
              <button
                className="h-10 md:h-8 py-1 px-2 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1 shrink-0"
                onClick={() => handleOpenExportContent()}
              >
                <FaFileExport />
                <span className="text-sm">Export</span>
              </button>
            </div>

            {/* TaxProfiles table */}
            {loading ? (
              <Spinner />
            ) : (
              <ResponsiveTable
                align="left"
                maxHeightClass="md:max-h-[60vh]"
                rows={filteredTaxBands || []}
                onRowClick={(band) => setSelectedBand(band)}
                emptyMessage={
                  <span className="flex flex-col w-full justify-center items-center gap-4 font-normal">
                    <span className="text-lg">No tax band found</span>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          '/pages/account/admin/tax-management/create-tax-band'
                        )
                      }
                      className="flex flex-row gap-1 rounded-md bg-brand-blue text-white h-9 px-3 items-center hover:bg-blue-shadow1"
                    >
                      <FaPlus />
                      <span>Create a tax band</span>
                    </button>
                  </span>
                }
                columns={[
                  {
                    key: 'name',
                    header: 'Tax profile name',
                    mobile: 'title',
                    cellClass: () => 'font-semibold',
                    cell: (band) => band?.name || '-',
                  },
                  {
                    key: 'rate',
                    header: 'Tax band rate',
                    mobile: 'badge',
                    cell: (band) =>
                      `${band?.effectiveRate?.rate?.toFixed(2)}%` ||
                      'rate not set',
                  },
                  {
                    key: 'effective',
                    header: 'Effective date',
                    cell: (band) =>
                      ISOStringToLocalTime(
                        band?.effectiveRate?.effectiveDate
                      ) || 'effective date not set',
                  },
                  {
                    key: 'branches',
                    header: 'Assigned branches',
                    cell: (band) => (
                      <>
                        {band?.associatedBranches?.length || 0}{' '}
                        {band?.associatedBranches?.length > 1
                          ? 'branches'
                          : 'branch'}
                      </>
                    ),
                  },
                ]}
                actionsHeader=""
                actions={(band) => (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleEditTaxBandClick(e, band)}
                      title="Edit tax band"
                      aria-label="Edit tax band"
                    >
                      <FaEdit className="hover:text-error-hover" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTaxBandClick(e, band)}
                      title="Delete tax band"
                      aria-label="Delete tax band"
                    >
                      <FaTrash className="hover:text-error-hover" />
                    </button>
                  </>
                )}
              />
            )}
          </div>
          <PageDescription pageDescription={pageDescription} />
        </div>
      </div>

      {/* Tax band details */}
      {selectedBand && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <TaxBandDetails
            band={selectedBand}
            setBand={setSelectedBand}
            onClose={handleCloseAllModals}
            otherTaxBands={taxBands?.filter(
              (tb) => tb._id !== selectedBand._id
            )}
            handleEditTaxBandClick={handleEditTaxBandClick}
            handleDeleteTaxBandClick={handleDeleteTaxBandClick}
          />
        </div>
      )}

      {/*delete band with associated branches warning Modal */}
      {showConfirmationModal && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <WarningModal
            title={'Cannot delete tax band'}
            button1Text={'OK'}
            button1Style={`bg-yellow-500 hover:bg-yellow-400`}
            message={modalMessage}
            onClick={() => setShowConfirmationModal(false)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && bandToDelete && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <DeleteModal
            message={modalMessage}
            title={'Delete Tax Band'}
            buttonStyle={`bg-red-500 hover:bg-red-400`}
            onClose={handleCloseAllModals}
            onConfirm={handleDeleteTaxBandConfirm}
            button2Style={`bg-gray-500 hover:bg-gray-400`}
            deleteErrors={deleteErrors}
            loading={loading}
          />
        </div>
      )}

      {/* Success Message Modal */}
      {success && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <SuccessModal
            message={'Tax band deleted successfully.'}
            title={'Success'}
            buttonStyle={`bg-green-500 hover:bg-green-400`}
            onClose={() => handleCloseAllModals()}
            subText={'The tax band has been deleted successfully.'}
            buttonText={'OK'}
          />
        </div>
      )}

      {/* Export Content Modal */}
      {exportContent && filteredTaxBands.length > 0 && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <ExportContent
            metadata={{
              Date: [new Date().toLocaleDateString()],
              Time: [new Date().toLocaleTimeString()],
              'Showing results for': searchterm ? [`"${searchterm}"`] : ['All'],
            }}
            data={filteredTaxBands.map((band, index) => {
              return {
                'S/No': index + 1,
                Name: band?.name,
                'Tax Band Rate':
                  `${band?.effectiveRate?.rate?.toFixed(2)}%` || '-',
                'Effective Date':
                  ISOStringToLocalTime(band?.effectiveRate?.effectiveDate) ||
                  '-',
                'Assigned Branches': band?.associatedBranches
                  ?.map((b) => b.name)
                  .join(', '),
              };
            })}
            onClose={() => setExportContent(false)}
            title={'Export Tax Profiles'}
          />
        </div>
      )}
    </div>
  );
};

export default TaxManagement;
