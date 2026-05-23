import Header from '@/components/account/Header';
import React, { useEffect, useState } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import { TAX_MANAGEMENT_SUB_MENUS } from './TaxManagementSideBarItems';
import PageDescription from '@/components/account/PageDescription';
import { useAuth } from '@/contexts/authContext';
import {
  FaEdit,
  FaFileExport,
  FaPlus,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import ExportContent from '@/components/account/ExportContent';
import Spinner from '@/components/account/Spinner';
import {
  deleteTaxBandById,
  getAllTaxBandDetailsByCompanyId,
  getAllTaxBandsByCompanyId,
} from '@/services/branchServices';
import Image from 'next/image';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import Link from 'next/link';
import WarningModal from '@/components/account/WarningModal';
import DeleteModal from '@/components/account/DeleteModal';
import TaxBandDetails from './TaxBandDetails';
import SuccessModal from '@/components/account/SuccessModal';

const TaxManagement = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const auth = useAuth();
  const loggedInUser = auth.user;
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
  console.log('Taxbands:', taxBands);
  console.log('selectedBand:', selectedBand);

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
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="view-tax-band-details"
            sideBarSubmenus={TAX_MANAGEMENT_SUB_MENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-[80%] flex flex-col gap-5">
            {/* search Input and filter */}
            <div className="flex items-center justify-between gap-10">
              <div className="h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full">
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
                className="h-8 py-1 px-2 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1"
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
              <div className="overflow-x-auto w-full h-full min-h-[50vh] max-h-[60vh] overflow-y-auto scrollbar-thin relative">
                <table className="w-full table-auto relative">
                  <thead className="bg-background-1 sticky top-[-1px] z-10">
                    <tr className="text-left text-text-gray text-sm font-medium border border-gray-border">
                      <th className="px-2 py-2 border border-gray-border text-left">
                        TAX PROFILE NAME
                      </th>
                      <th className="px-2 py-2 text-left border border-gray-border">
                        TAX BAND RATE
                      </th>
                      <th className="px-2 py-2 text-left border border-gray-border">
                        EFFECTIVE DATE
                      </th>
                      <th className="px-2 py-2 text-left border border-gray-border">
                        ASSIGNED BRANCHES
                      </th>
                      <th className="px-2 py-2 text-left border border-gray-border"></th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-text-gray min-h-[40vh] w-full">
                    {filteredTaxBands?.length > 0 ? (
                      filteredTaxBands?.map((band) => (
                        <tr
                          key={band._id}
                          onClick={() => setSelectedBand(band)}
                          className={`border-b border-gray-border hover:bg-gray-shadow10 hover:text-text-black cursor-pointer items-center w-full`}
                        >
                          <td
                            className={`px-2 py-1 text-left flex items-left gap-2`}
                          >
                            <span
                              className={`px-2 py-2 text-center font-semibold`}
                            >
                              {band?.name || '-'}
                            </span>
                          </td>
                          <td className={`px-2 py-1 text-left w-32`}>
                            {`${band?.effectiveRate?.rate?.toFixed(2)}%` ||
                              'rate not set'}
                          </td>
                          <td className={`px-2 py-1 text-left w-1/5`}>
                            {ISOStringToLocalTime(
                              band?.effectiveRate?.effectiveDate
                            ) || 'effective date not set'}
                          </td>
                          <td className={`px-2 py-1 text-left w-1/5`}>
                            {band?.associatedBranches?.length || 0}{' '}
                            {band?.associatedBranches?.length > 1
                              ? 'branches'
                              : 'branch'}
                          </td>

                          {/* action buttons */}
                          <td className={`px-2 py-1 text-left w-1/8`}>
                            <span className="flex flex-row items-center gap-2 justify-around">
                              <button
                                onClick={(e) => {
                                  handleDeleteTaxBandClick(e, band);
                                }}
                                className=""
                              >
                                <FaTrash className="cursor-pointer hover:text-error-hover" />
                              </button>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        {
                          <td colSpan={5} className="text-center py-32">
                            <div className="flex flex-col w-full justify-center items-center gap-4">
                              <span className="text-lg">No tax band found</span>
                              <Link
                                href="/pages/account/admin/tax-management/create-tax-band"
                                className="flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1"
                              >
                                <FaPlus />
                                <span>Create a tax band</span>
                              </Link>
                            </div>
                          </td>
                        }
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>

      {/* Tax band details */}
      {selectedBand && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <TaxBandDetails band={selectedBand} onClose={handleCloseAllModals} />
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
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              handleDeleteTaxBandConfirm();
            }}
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
