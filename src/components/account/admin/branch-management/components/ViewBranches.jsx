
import {useState, useEffect} from 'react';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import BranchSidebar from './BranchSideBar';
import PageDescription from '@/components/account/PageDescription';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/components/account/Spinner';
import ExportContent from '@/components/account/ExportContent';
import DeleteModal from '@/components/account/DeleteModal';
import DeactivationModal from '@/components/account/DeactivationModal';
import { deleteBranchesById, getAllBranchesByCompanyId, toggleBranchStatus } from '@/services/branchServices';
import SuccessModal from '@/components/account/SuccessModal';

const ViewBranches = ({pageDescription}) => {

    const selectedSubMenu = {
        name: 'View all branches',
        link: '/',
    };

    const [openSidebar, setOpenSidebar] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [allBranches, setAllBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedBand, setSelectedBand] = useState('');
    const [selectedTaxBand, setSelectedTaxBand] = useState('');
    const [exportContent, setExportContent] = useState(false);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedBranchStatus, setSelectedBranchStatus] = useState('');
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteErrors, setDeleteErrors] = useState([]);
    const [deleteMessages, setDeleteMessages] = useState([]);
    const [deactivationErrors, setDeactivationErrors] = useState([]);
    const [deactivationMessages, setDeactivationMessages] = useState([]);
    const [toggleStatusSuccess, setToggleStatusSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const Router = useRouter();

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const { data, error } = await getAllBranchesByCompanyId();
                if (error) {
                    console.error(error, 'error fetching branches');
                } else if (data) {
                    setAllBranches(data);
                }
            }
            catch (error) {
                console.error('Error fetching branches:', error);
                setAllBranches([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchBranches();
    },[]);

    useEffect(() => {
        const filtered = allBranches && allBranches.filter(
            (branch) => {
                const result = 
                    (branch.name.toLowerCase().includes(searchInput.toLowerCase())||
                    branch.email.toLowerCase().includes(searchInput.toLowerCase())) &&
                (branch.band === selectedBand || selectedBand === '') &&
                (branch.taxBand.name === selectedTaxBand || selectedTaxBand === '')
                return result;
            }
        );
        setFilteredBranches(filtered);
    }, [searchInput, selectedBand, selectedTaxBand, allBranches]);  

    const collatedBands = allBranches.length && allBranches.map((branch) => branch.band) || [];
    const allBands = collatedBands && [...new Set(collatedBands)] || [];

    const collatedTaxBands = allBranches && allBranches.map((branch) => branch.taxBand.name) || [];
    const allTaxBands = collatedTaxBands && [...new Set(collatedTaxBands)] || [];

    const handleResetFilters = () => {
        setSelectedBand('');
        setSelectedTaxBand('');
        setSearchInput('');
    };

    const handleSelecBranch = (branchId) => {
        if (selectedBranches.includes(branchId)) {
            setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
        } else {
            setSelectedBranches([...selectedBranches, branchId]);
        }
    };

    const handleChangeBranchStatus = async(branchId) => {

        try{
            setLoading(true);

            let response;
            if (selectedBranchStatus === 'active' || branchId.length > 1) {
                //deactivate branches
                response = await toggleBranchStatus(branchId, 'inactive');
            }else if (selectedBranchStatus === 'inactive') {
                //activate branches
                response = await toggleBranchStatus(branchId, 'active');
            }
            if (response.error) {
                console.error(response.error, 'error changing branch status');
                setDeactivationErrors([response.error]);
                setDeactivationMessages([]);
            }else if (response.data) {
                setDeactivationMessages([response.message]);
                setDeactivationErrors([]);
                setAllBranches((prevBranches) =>
                    prevBranches.map((branch) =>
                        branchId.includes(branch._id)
                            ? { ...branch, status: selectedBranchStatus === 'active' ? 'inactive' : 'active' }
                            : branch
                    )
                );
                setToggleStatusSuccess(true);
                setSelectedBranches([]);
            }
        }catch(err){
            console.error('Error changing branch status:', err);
            setDeactivationErrors(['Error changing branch status, please try again']);
            setDeactivationMessages([]);
        }finally{
            setLoading(false);
            setSelectedBranches([]);
        }
    };

    const handleBranchToChangeStatus = (branchId) => {

        setOpenStatusModal(true);
        setSelectedBranches(branchId);

    };

    const handleBranchToDelete = (branchId) => {
        setOpenDeleteModal(true);
        setSelectedBranches(branchId);
    };

    const handleDeleteBranch = async(branchId) => {
        try{
            setLoading(true);
            const response = await deleteBranchesById(branchId);
            if (response.error) {
                console.error(response.error, 'error deleting branches');
                setDeleteErrors([response.error]);
                setDeleteMessages([]);
            }else if (response.data) {
                setDeleteMessages([response.message]);
                setDeleteErrors([]);
                setAllBranches((prevBranches) =>
                    prevBranches.filter(branch => !branchId.includes(branch._id))
                );
                setDeleteSuccess(true);
                setSelectedBranches([]);
            }   
        }catch(err){
            console.error('Error deleting branches:', err);
            setDeleteErrors(['Error deleting branches, please try again']);
            setDeleteMessages([]);
        }finally{
            setLoading(false);
            setOpenDeleteModal(false);
            setSelectedBranches([]);
        }
    }

    const handleClose = () => {
        setOpenDeleteModal(false);
        setOpenStatusModal(false);
        setDeactivationErrors([]);
        setDeactivationMessages([]);
        setDeleteErrors([]);
        setDeleteMessages([]);
    };

  return (
    <div>
        <div className="w-full sticky top-0 z-50">
          <Header />
        </div>
        <div className="w-full">
            <SubHeader title={'View All Branches'}/>
        </div>
        <div className="flex flex-row gap-0 w-full h-full">
          <div className="min-w-fit">
            <BranchSidebar 
              selectedSubMenu={selectedSubMenu}
              isOpen={openSidebar}
              setIsOpen={setOpenSidebar}
            />
          </div>
          <div className='flex flex-col h-full w-full'>
            <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
                {/* search bar */}
                <div className='flex flex-row gap-5 w-full justify-between items-center'>
                    <div className='h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full'>
                        <Image
                            src="/assets/search.png"
                            alt="search"
                            width={15}
                            height={15}
                        />
                        <input
                            type="text"
                            placeholder="Search branch name or email"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="focus:outline-none ml-2 w-full"
                        />
                    </div>
                    <div className="flex flex-row gap-2 text-sm min-w-fit text-text-gray">
                        <div className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center'>
                            <Image
                                src="/assets/filter.png"
                                alt="sort"
                                width={15}
                                height={15}
                            />
                            <select 
                                value={selectedBand}
                                onChange={(e) => setSelectedBand(e.target.value)}
                                className="focus:outline-none cursor-pointer"
                            >
                                <option value={''}>All Bands</option>
                                {allBands?.map((band) => (
                                    <option key={band} className=''>{band}</option>
                                ))}
                            </select>
                        </div>
                        <div className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center'>
                            <Image
                                src="/assets/filter.png"
                                alt="sort"
                                width={15}
                                height={15}
                            />
                            <select 
                                value={selectedTaxBand}
                                onChange={(e) => setSelectedTaxBand(e.target.value)}
                                className="focus:outline-none cursor-pointer"
                            >
                                <option value={''}>All TaxBands</option>
                                {allTaxBands.length>0 && 
                                    allTaxBands?.map((band, index) => (
                                    <option key={index} value={band}>{band}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={handleResetFilters}
                            className='h-8 px-1 border border-gray-border hover:bg-gray-shadow9 rounded-md flex flex-row items-center text-text-black'
                        >
                            {`All Branches - ${allBranches.length}`}
                        </button>
                        <button>
                            <Link href='/pages/account/admin/branch-management/create-branch' className='flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1'>
                                <Image
                                    src="/assets/add.png"
                                    alt="add"
                                    width={15}
                                    height={15}
                                />
                                <span className=''>Create New Branch</span>
                            </Link>
                        </button>
                        <button 
                            className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1' 
                            onClick={() => setExportContent(true)}
                        >
                            <Image
                                src={'/assets/export.png'}
                                alt="export"
                                width={15}
                                height={15}
                            />
                            <span className=''>Export</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading? (
                    <Spinner />
                    ):(
                        <div className='max-h-[70vh] overflow-y-auto scrollbar-thin'>
                            <table className="w-full">
                                <thead className='sticky top-0 bg-white'>
                                    <tr className="text-left bg-gray-shadow8 text-sm text-text-gray">
                                        <th className="px-4 py-2">Branch Name</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Phone Number</th>
                                        <th className="px-4 py-2">Band</th>
                                        <th className="px-4 py-2">Tax Band</th>
                                        <th className="px-4 py-2">status</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-text-gray'>
                                    {filteredBranches.length > 0 ? (
                                        <>
                                            {filteredBranches.map((branch) => (
                                                <tr
                                                    key={branch._id} 
                                                    onClick={() => Router.push(`/pages/account/admin/branch-management/view-branch-details?id=${branch._id}`)}
                                                    className="border-b border-gray-border text-sm py-5 cursor-pointer hover:bg-gray-shadow10"
                                                >
                                                    <td className="px-4 py-2">
                                                        <input 
                                                          type="checkbox"
                                                          value={branch._id}
                                                          checked={selectedBranches.includes(branch._id)}
                                                          onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                          onChange={(e) => {
                                                            e.stopPropagation(); // Stop event propagation
                                                            handleSelecBranch(e.target.value);
                                                          }}
                                                          className='mr-2 cursor-pointer'
                                                        />
                                                        <span>{branch.name}</span>
                                                    </td>
                                                    <td className="px-4 py-2">{branch.email}</td>
                                                    <td className="px-4 py-2">{branch.phoneNumber}</td>
                                                    <td className="px-4 py-2">{branch.band}</td>
                                                    <td className="px-4 py-2">{branch.taxBand.name}</td>
                                                    <td className={`px-4 py-2 ${
                                                        branch.status === 'active'? 'text-success': branch.status === 'inactive'? 'text-error': 'text-yellow-600'
                                                        }`}
                                                    >
                                                        {branch.status}
                                                        
                                                    </td>
                                                    <td className='px-4 py-2 gap-1 flex flex-row w-full justify-between'>
                                                        <Image
                                                            src={branch.status === 'active'? '/assets/switch_active.png': '/assets/switch_inactive.png'}
                                                            alt="switch"
                                                            height={9}
                                                            width={25}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Stop event propagation
                                                                handleBranchToChangeStatus([branch._id]);
                                                                setSelectedBranchStatus(branch.status);
                                                            }}
                                                            className='cursor-pointer'
                                                            title={branch.status === 'active'? 'Deactivate Branch': 'Activate Branch'}
                                                        />
                                                        <Link 
                                                            href={`/pages/account/admin/branch-management/edit-branch?id=${branch._id}`} 
                                                            title='Edit Branch' 
                                                            className=''
                                                        >
                                                            <Image
                                                                src="/assets/edit.png"
                                                                alt="edit"
                                                                width={15}
                                                                height={15}
                                                                onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                                className='cursor-pointer'
                                                            />
                                                        </Link>
                                                        <Image
                                                          src="/assets/delete.png"
                                                          alt="delete"
                                                          width={15}
                                                          height={15}
                                                          onClick={(e) => {
                                                            e.stopPropagation(); // Stop event propagation
                                                            handleBranchToDelete([branch._id]);
                                                          }}
                                                          className='cursor-pointer'
                                                          title='Delete Branch'
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ):(
                                        <tr className="text-center text-text-gray h-[40vh]">
                                            <td className='font-semibold' colSpan={7}>No branches found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {selectedBranches.length > 0 && 
                                <div className='sticky bottom-0 bg-white flex flex-row py-1 justify-end px-5 gap-5'>
                                    <div
                                        className='bg-success text-white text-sm px-2 py-2 rounded-md mt-5 hover:bg-opacity-90 flex flex-row items-center gap-3'
                                    >
                                        {`${selectedBranches.length} selected`}
                                        <Image
                                            src="/assets/delete-white.png"
                                            alt="delete"
                                            width={20}
                                            height={27}
                                            onClick={()=>handleBranchToDelete(selectedBranches)}
                                            className='cursor-pointer'
                                            title='Delete Branches'
                                        />
                                        <Image
                                            src="/assets/switch_inactive.png"
                                            alt="deactivate"
                                            width={27}
                                            height={27}
                                            onClick={()=>{
                                                handleBranchToChangeStatus(selectedBranches);
                                                setSelectedBranchStatus('active'); 
                                            }}
                                            className='cursor-pointer'
                                            title='Deactivate Branches'
                                        />
                                    </div>

                                    <button
                                        onClick={()=> setSelectedBranches([])}
                                        className='bg-brand-gray text-white text-sm px-2 py-2 rounded-md mt-5 hover:bg-opacity-80 flex flex-row items-center gap-1'
                                    >
                                        {`Clear Selection`}

                                    </button>
                                </div>
                            }
                        </div>
                    )
                }
            </div>
            <div className=''><PageDescription pageDescription={pageDescription}/></div>
          </div>
        </div>

        {exportContent && filteredBranches.length > 0 &&
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <ExportContent
                    metadata={{
                        Date : [new Date().toLocaleDateString()],
                        Time: [new Date().toLocaleTimeString()],
                        Band: selectedBand? [selectedBand]: ["All"],
                        TaxBand: selectedTaxBand? [selectedTaxBand] : ["All"],
                    }}
                    data={filteredBranches.map((branch, index )=> {
                        return {
                            "S/No": index+1,
                            "Name": branch.name, 
                            "Email": branch.email, 
                            "Phone Number": branch.phoneNumber,
                            "Band": branch.band,
                            "Tax Band": branch?.taxBand?.name,
                            "Status": branch.status,
                        }
                    })}
                    onClose={() => setExportContent(false)}
                    title={'Export Branches Data'}
                />
            </div>
        }

        {openDeleteModal && 
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <DeleteModal
                    title={selectedBranches.length>1? 'Delete branch':'Delete branches'}
                    message={`Are you sure you want to delete the selected ${selectedBranches.length>1? 'branches?':'branch?'} This action cannot be undone, and all data will be lost.`}
                    buttonStyle={'bg-error hover:bg-error-hover text-white'}
                    onClose={handleClose}
                    onConfirm={() => handleDeleteBranch(selectedBranches)}
                    loading={loading}
                    deleteErrors={deleteErrors}
                    deleteMessages={deleteMessages}
                />
            </div>
        }

        {openStatusModal &&
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <DeactivationModal
                    title={
                        selectedBranches.length>1? (
                            selectedBranchStatus === 'active'? 'Deactivate branches':'Activate branches'
                        ):(
                            selectedBranchStatus === 'inactive' ? 'Activate branch':'Deactivate branch'
                        )
                    }
                    message={
                        `Are you sure you want to ${
                            selectedBranchStatus === 'active'? 'deactivate':'activate'
                        } the selected ${
                            selectedBranches.length>1? 'branches?':'branch?'
                        } ${selectedBranchStatus === 'active' ? (`This would stop every activity in the selected ${
                            selectedBranches.length>1? 'branches':'branch'
                        }`):''}.`
                    }
                    buttonText={
                        selectedBranchStatus === 'active'? 'Deactivate':'Activate'
                    }
                    buttonStyle={selectedBranchStatus === 'active'? 'bg-error hover:bg-error-hover text-white':'bg-success hover:bg-success-hover text-white'}
                    onClose={handleClose}
                    onConfirm={() => handleChangeBranchStatus(selectedBranches)}
                    loading={loading}
                    deactivationErrors={deactivationErrors}
                    deactivationMessages={deactivationMessages}
                />
            </div>
        }

        {toggleStatusSuccess && (
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <SuccessModal
                    title={selectedBranchStatus === 'active'? 'Branches Deactivated': 'Branches Activated'}
                    message={`The selected ${selectedBranches.length>1? 'branches':'branch'} have been successfully ${selectedBranchStatus === 'active'? 'deactivated':'activated'}.`}
                    
                    buttonStyle={'bg-success hover:bg-success-hover text-white'}
                    onClose={() => {
                        setToggleStatusSuccess(false);
                        handleClose();
                    }}
                    loading={loading}
                    loadingText={selectedBranchStatus === 'active'? 'Deactivating branches...':'Activating branches...'}
                />
            </div>
        )}

        {deleteSuccess && (
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <SuccessModal
                    title={'Branches Deleted'}
                    message={`The selected ${selectedBranches.length>1? 'branches':'branch'} have been successfully deleted.`}
                    buttonStyle={'bg-success hover:bg-success-hover text-white'}
                    onClose={() => {
                        setDeleteSuccess(false);
                        handleClose();
                    }}
                    loading={loading}
                    loadingText={'Deleting branches...'}
                />
            </div>
        )}
    </div>
  )
}

export default ViewBranches;