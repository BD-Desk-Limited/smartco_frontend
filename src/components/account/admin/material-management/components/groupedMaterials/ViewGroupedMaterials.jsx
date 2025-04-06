import React from 'react';
import { useRouter } from 'next/navigation';
import { deleteMaterials, getAllMaterials } from '@/services/materialServices';
import Header from '@/components/account/Header';
import SubHeader from '../SubHeader';
import MaterialSidebar from '../materialSidebar';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/components/account/Spinner';
import PageDescription from '@/components/account/PageDescription';
import ExportContent from '@/components/account/ExportContent';
import DeleteModal from '@/components/account/DeleteModal';
import ComponentMaterialsModal from './ComponentMaterialsModal';

const ViewGroupedMaterials = ({pageDescription}) => {
    
    const selectedSubMenu = {
        name: 'View Grouped Materials',
        link: '/view-grouped-materials',
    };

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    const [allMaterialsIncludingUngrouped, setAllMaterialsIncludingUngrouped] = React.useState([]);
    const [groupedMaterials, setGroupedMaterials] = React.useState([]);
    const [filteredMaterials, setFilteredMaterials] = React.useState([]);
    const [selectedMaterials, setSelectedMaterials] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [selectedMaterialType, setSelectedMaterialType] = React.useState('');
    const [exportContent, setExportContent] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [deleteErrors, setDeleteErrors] = React.useState([]);
    const [deleteMessages, setDeleteMessages] = React.useState([]);
    const [materialToView, setMaterialToView] = React.useState(null);
    const Router = useRouter();

    React.useEffect(() => {
        const fetchGroupedMaterials = async () => {
            try{
                setLoading(true);
                const response = await getAllMaterials();
                const data = response.data || [];
                if(response.data){
                    setAllMaterialsIncludingUngrouped(response.data);
                    const groupedMaterials = data.filter(material => material.isGroup === true && material.isDeleted === false);
                    setGroupedMaterials(groupedMaterials);
                };
            }catch(error){
                console.error('Error fetching grouped materials:', error);
            }finally{
                setLoading(false);
            }
        };
        fetchGroupedMaterials();
    }, []);

    React.useEffect(() => {
        const filtered = Array.isArray(groupedMaterials)&& groupedMaterials?.filter(
            (material) =>
              (material.name.toLowerCase().includes(searchInput.toLowerCase()) ||
              material.description.toLowerCase().includes(searchInput.toLowerCase()))&&
                (material.category.name === selectedCategory || selectedCategory === '') &&
                (material.materialType === selectedMaterialType || selectedMaterialType === '')
        )||[];
        setFilteredMaterials(filtered);
        
    }, [groupedMaterials, searchInput, selectedCategory, selectedMaterialType]);

    const allCategories = [...new Set(groupedMaterials.map(material => material.category?.name))];
    const allMaterialTypes = [...new Set(groupedMaterials.map(material => material.materialType))];

    const handleResetFilters = () => {
        setSelectedCategory('');
        setSelectedMaterialType('');
        setSearchInput('');
    };

    const handleSelectMaterial = (materialId) => {
        if (selectedMaterials.includes(materialId)) {
            setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
        } else {
            setSelectedMaterials([...selectedMaterials, materialId]);
        }
    };

    const handleMaterialToDelete = (materialIds) => {
        setSelectedMaterials(materialIds);
        setOpenDeleteModal(true);
    };

    const handleClose = () => {
        setOpenDeleteModal(false); 
        setDeleteErrors([]);
        setDeleteMessages([]);
    };

    const handleDeleteMaterials = async() => {
        try{
            setLoading(true);
            const response = await deleteMaterials(selectedMaterials);
            if(response.data){
                const data = response.data;
                if(data.deletedMaterials.length>0){
                    const deletedMaterialsId = data.deletedMaterials.map(material => material._id);

                    setDeleteMessages([`${data.deletedMaterials.length} materials deleted successfully.`]);
                    setAllMaterialsIncludingUngrouped(allMaterialsIncludingUngrouped.filter(material => !deletedMaterialsId.includes(material._id)));
                    setSelectedMaterials([]);
                }
                if(data.materialsWithStock.length>0){
                    const materialsWithStockId = data.materialsWithStock.map(material => material.material_id);
                    const collectErrorMessages = data.materialsWithStock.map(material => material.message);

                    const errorTypes = [...new Set(collectErrorMessages)];
                    let errorWithStocksUnderIt = [];
                    errorTypes.forEach((errorType) => {
                        
                        const errorMaterials = data.materialsWithStock.filter(material => material.message === errorType);
                        errorWithStocksUnderIt =  [...errorWithStocksUnderIt, {errorType, errorMaterials}];
                    });

                    const errorMessages = errorWithStocksUnderIt.map(error => {
                        return `${error.errorType} - Materials affected: ${error.errorMaterials.map(material => material.name).join(', ')}`;
                    });
                    
                    setDeleteErrors(errorMessages);
                    setSelectedMaterials(materialsWithStockId);
                }
            };
            if(response.error){
                setDeleteErrors([response.error]||['Error deleting materials, please try again.']);
            };
        }catch(error){
            console.error('Error:', error);
            setDeleteErrors(['Error deleting materials, please try again.']);
        }finally{
            setLoading(false);
        };
    };

    const getMaterialNameAndUnitById = (id) => {

        const material = allMaterialsIncludingUngrouped.find((material) => material._id === id);
        if (material) {
            return `(${material?.unitOfMeasurement?.name}) ${material?.name}`;
        } else {
            return 'Unknown Material';
        }
    };

  return (
    <div>
        <div className="w-full sticky top-0 z-50">
          <Header />
        </div>
        <div className="w-full">
            <SubHeader title={'List of Grouped Materials'}/>
        </div>
        <div className="flex flex-row w-full h-full gap-5">
          <div className="min-w-fit">
            <MaterialSidebar 
              selectedSubMenu={selectedSubMenu}
              isOpen={openSidebar}
              setIsOpen={setOpenSidebar}
            />
          </div>
          <div className='flex flex-col h-full w-full'>
            <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
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
                            placeholder="Search materials"
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
                                value={selectedMaterialType}
                                onChange={(e) => setSelectedMaterialType(e.target.value)}
                                className="focus:outline-none cursor-pointer"
                            >
                                <option value={''}>All Types</option>
                                {allMaterialTypes?.map((type) => (
                                    <option key={type} className=''>{type}</option>
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
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="focus:outline-none cursor-pointer"
                            >
                                <option value={''}>All Categories</option>
                                {allCategories.length>0 && 
                                    allCategories?.map((category, index) => (
                                    <option key={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={handleResetFilters}
                            className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-text-black'
                        >
                            {`All Materials - ${groupedMaterials.length}`}
                        </button>
                        <button>
                            <Link href='/pages/account/admin/manage-materials/create-grouped-material' className='flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1'>
                                <Image
                                    src="/assets/add.png"
                                    alt="add"
                                    width={15}
                                    height={15}
                                />
                                <span className=''>Add Grouped Material</span>
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

                {loading? (
                    <Spinner/>
                    ):(
                        <div className='max-h-[70vh] overflow-y-auto scrollbar-thin'>
                            <table className="w-full">
                                <thead className='sticky top-0 bg-white'>
                                    <tr className="text-left bg-gray-shadow8 text-sm text-text-gray">
                                        <th className="px-4 py-2">Material Name</th>
                                        <th className="px-4 py-2">Category</th>
                                        <th className="px-4 py-2">Material Type</th>
                                        <th className="px-4 py-2">Unit</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-text-gray'>
                                    {filteredMaterials.length>0? (
                                        <>
                                            {filteredMaterials.map((material) => (
                                                <tr 
                                                  key={material._id} 
                                                  onClick={() => Router.push(`/pages/account/admin/manage-materials/view-material-details?id=${material._id}`)}
                                                  className="border-b border-gray-border text-sm py-5 cursor-pointer hover:bg-gray-shadow10"
                                                >
                                                  <td className="px-4 py-2">
                                                    <input 
                                                      type="checkbox"
                                                      value={material._id}
                                                      checked={selectedMaterials.includes(material._id)}
                                                      onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                      onChange={(e) => {
                                                        e.stopPropagation(); // Stop event propagation
                                                        handleSelectMaterial(e.target.value);
                                                      }}
                                                      className='mr-2 cursor-pointer'
                                                    />
                                                    <span>{material.name}</span>
                                                  </td>
                                                  <td className="px-4 py-2">{material.category?.name}</td>
                                                  <td className="px-4 py-2">{material.materialType}</td>
                                                  <td className="px-4 py-2">{material.unitOfMeasurement?.name}</td>
                                                  <td className="px-4 py-2 flex flex-row w-full justify-between">
                                                    <Image
                                                        src="/assets/eye-gray.png"
                                                        alt="view"
                                                        width={15}
                                                        height={15}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Stop event propagation
                                                            setMaterialToView(material);
                                                        }} 
                                                        title='View Component Materials'
                                                    />
                                                    <Link href={`/pages/account/admin/manage-materials/edit-grouped-material?id=${material._id}`} title='Edit Material'>
                                                      <Image
                                                        src="/assets/edit.png"
                                                        alt="view"
                                                        width={15}
                                                        height={15}
                                                        onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                      />
                                                    </Link>
                                                    <Image
                                                      src="/assets/delete.png"
                                                      alt="delete"
                                                      width={15}
                                                      height={15}
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Stop event propagation
                                                        handleMaterialToDelete([material._id]);
                                                      }}
                                                      className='cursor-pointer'
                                                      title='Delete Material'
                                                    />
                                                  </td>
                                                </tr>
                                            ))}
                                        </>
                                    ):(
                                        <tr className="text-center text-text-gray h-[40vh]">
                                            <td className='font-semibold' colSpan={5}>No materials found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                                
                            {selectedMaterials.length>0 &&
                                <div className='sticky bottom-0 bg-white flex flex-row py-1 justify-end px-5 gap-5'>
                                    <button 
                                        onClick={()=>handleMaterialToDelete(selectedMaterials)}
                                        className='bg-error text-white text-sm px-2 py-2 rounded-md mt-5 hover:bg-opacity-90 flex flex-row items-center gap-1'
                                    >
                                        {`${selectedMaterials.length} selected`}
                                        <Image
                                            src="/assets/delete-white.png"
                                            alt="delete"
                                            width={15}
                                            height={15}
                                        />
                                    </button>

                                    <button
                                        onClick={()=> setSelectedMaterials([])}
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
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>

        {exportContent && filteredMaterials.length > 0 &&
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <ExportContent 
                    metadata={{
                        Date : [new Date().toLocaleDateString()],
                        Time: [new Date().toLocaleTimeString()],
                        category: selectedCategory? [selectedCategory]: ["All"],
                        materialType: selectedMaterialType? [selectedMaterialType]: ["All"],
                    }}
                    data={filteredMaterials.map((material, index )=> {
                        return {
                            "S/No": index+1,
                            "Name": material.name, 
                            "Category": material.category?.name, 
                            "Material Type": material.materialType, 
                            "Unit": material.unitOfMeasurement?.name,
                            "Description": material.description,
                            "Component Materials": material.components?.map((componentMaterial) => {
                                return `${componentMaterial?.quantity}${getMaterialNameAndUnitById(componentMaterial.id)}, `;
                            }),
                        }
                    })}
                    onClose={() => setExportContent(false)}
                    title={'Export Grouped Materials'}
                />
            </div>
        }

        {openDeleteModal && 
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <DeleteModal
                    title={selectedMaterials.length>1? 'Delete Materials':'Delete Material'}
                    message={`Are you sure you want to delete the selected ${selectedMaterials.length>1? 'materials?':'material?'} This action cannot be undone.`}
                    buttonStyle={'bg-error hover:bg-error-hover text-white'}
                    onClose={handleClose}
                    onConfirm={() => handleDeleteMaterials(selectedMaterials)}
                    loading={loading}
                    deleteErrors={deleteErrors}
                    deleteMessages={deleteMessages}
                />
            </div>
        }

        {materialToView && 
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center w-full h-full'>
                <ComponentMaterialsModal 
                    material={materialToView}
                    allMaterials={allMaterialsIncludingUngrouped}
                    onClose={() => setMaterialToView(null)}
                />
            </div>
        }

    </div>
  )
}

export default ViewGroupedMaterials;