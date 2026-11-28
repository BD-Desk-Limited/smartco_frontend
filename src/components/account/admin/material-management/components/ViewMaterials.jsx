import React, { use } from 'react';
import Image from 'next/image';
import Header from '@/components/account/admin/shell/AdminHeader';
import SubHeader from '../../shell/SubHeader';
import MaterialSidebar from './materialSidebar';
import PageDescription from '@/components/account/common/PageDescription';
import Link from 'next/link';
import ExportContent from '../../../common/ExportContent';
import { deleteMaterials, getMaterials } from '@/services/materialServices';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';
import Spinner from '@/components/account/common/Spinner';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/components/account/common/DeleteModal';
import SubMenuQuickLinks from './SubMenuQuicklinks';

const ViewMaterial = ({ pageDescription }) => {
  const selectedSubMenu = {
    name: 'View All Materials',
    link: '/view-materials',
  };
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [allMaterials, setAllMaterials] = React.useState([]);
  const [filteredMaterials, setFilteredMaterials] = React.useState([]);
  const [selectedMaterials, setSelectedMaterials] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedMaterialType, setSelectedMaterialType] = React.useState('');
  const [exportContent, setExportContent] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleteErrors, setDeleteErrors] = React.useState([]);
  const [deleteMessages, setDeleteMessages] = React.useState([]);
  const Router = useRouter();

  React.useEffect(() => {
    const fetchAllMaterials = async () => {
      try {
        setLoading(true);
        const response = await getMaterials();
        if (response.data) {
          setAllMaterials(response.data);
        }
        if (response.error) {
          console.error('Error fetching materials:', response.error);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMaterials();
  }, []);

  React.useEffect(() => {
    const filtered =
      (Array.isArray(allMaterials) &&
        allMaterials?.filter(
          (material) =>
            (material.name.toLowerCase().includes(searchInput.toLowerCase()) ||
              material.description
                .toLowerCase()
                .includes(searchInput.toLowerCase())) &&
            (material.category?.name === selectedCategory ||
              selectedCategory === '') &&
            (material.materialType === selectedMaterialType ||
              selectedMaterialType === '')
        )) ||
      [];
    setFilteredMaterials(filtered);
  }, [allMaterials, searchInput, selectedCategory, selectedMaterialType]);

  const allCategories = [
    ...new Set(allMaterials.map((material) => material.category?.name)),
  ];
  const allMaterialTypes = [
    ...new Set(allMaterials.map((material) => material.materialType)),
  ];

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedMaterialType('');
    setSearchInput('');
  };

  const handleSelectMaterial = (materialId) => {
    if (selectedMaterials.includes(materialId)) {
      setSelectedMaterials(selectedMaterials.filter((id) => id !== materialId));
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

  const handleDeleteMaterials = async () => {
    try {
      setLoading(true);
      const response = await deleteMaterials(selectedMaterials);
      if (response.data) {
        const data = response.data;
        if (data.deletedMaterials.length > 0) {
          const deletedMaterialsId = data.deletedMaterials.map(
            (material) => material._id
          );

          setDeleteMessages([
            `${data.deletedMaterials.length} materials deleted successfully.`,
          ]);
          setAllMaterials(
            allMaterials.filter(
              (material) => !deletedMaterialsId.includes(material._id)
            )
          );
          setSelectedMaterials([]);
        }
        if (data.materialsWithStock.length > 0) {
          const materialsWithStockId = data.materialsWithStock.map(
            (material) => material.material_id
          );
          const collectErrorMessages = data.materialsWithStock.map(
            (material) => material.message
          );

          const errorTypes = [...new Set(collectErrorMessages)];
          let errorWithStocksUnderIt = [];
          errorTypes.forEach((errorType) => {
            const errorMaterials = data.materialsWithStock.filter(
              (material) => material.message === errorType
            );
            errorWithStocksUnderIt = [
              ...errorWithStocksUnderIt,
              { errorType, errorMaterials },
            ];
          });

          const errorMessages = errorWithStocksUnderIt.map((error) => {
            return `${error.errorType} - Materials affected: ${error.errorMaterials.map((material) => material.name).join(', ')}`;
          });

          setDeleteErrors(errorMessages);
          setSelectedMaterials(materialsWithStockId);
        }
      }
      if (response.error) {
        setDeleteErrors(
          [response.error] || ['Error deleting materials, please try again.']
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setDeleteErrors(['Error deleting materials, please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader
          title={'List of Materials'}
          ExtraComponents={
            <SubMenuQuickLinks
              currentPageLabel="Ungrouped materials"
              otherLinks={[
                {
                  label: 'Grouped materials',
                  link: '/pages/account/admin/manage-materials/view-grouped-materials',
                },
              ]}
            />
          }
        />
      </div>
      <div className="flex flex-col md:flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit md:absolute md:left-0 md:top-0 md:z-50">
          <MaterialSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-3 md:p-5 mx-2 md:mx-5 mt-2 mb-6 rounded-md h-full flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-3 md:gap-5 w-full md:justify-between md:items-center">
              <div className="h-10 md:h-8 px-3 border border-gray-border rounded-md focus-within:ring focus-within:border-brand-blue flex flex-row items-center w-full">
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
              <div className="flex flex-row flex-wrap gap-2 text-sm md:min-w-fit text-text-gray">
                <div className="h-8 px-1 border border-gray-border rounded-md flex flex-row items-center">
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
                      <option key={type} className="">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="h-8 px-1 border border-gray-border rounded-md flex flex-row items-center">
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
                    {allCategories.length > 0 &&
                      allCategories?.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                  </select>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-text-black"
                >
                  {`All Materials - ${allMaterials.length}`}
                </button>
                <button>
                  <Link
                    href="/pages/account/admin/manage-materials/create-material"
                    className="flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1"
                  >
                    <Image
                      src="/assets/add.png"
                      alt="add"
                      width={15}
                      height={15}
                    />
                    <span className="">Add Material</span>
                  </Link>
                </button>
                <button
                  className="h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1"
                  onClick={() => setExportContent(true)}
                >
                  <Image
                    src={'/assets/export.png'}
                    alt="export"
                    width={15}
                    height={15}
                  />
                  <span className="">Export</span>
                </button>
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <div className="flex flex-col gap-2">
                <ResponsiveTable
                  align="left"
                  rows={filteredMaterials}
                  emptyMessage="No materials found."
                  onRowClick={(material) =>
                    Router.push(
                      `/pages/account/admin/manage-materials/view-material-details?id=${material._id}`
                    )
                  }
                  selection={{
                    isSelected: (m) => selectedMaterials.includes(m._id),
                    onToggle: (m) => handleSelectMaterial(m._id),
                    allSelected:
                      filteredMaterials.length > 0 &&
                      filteredMaterials.every((m) =>
                        selectedMaterials.includes(m._id)
                      ),
                    onToggleAll: () =>
                      setSelectedMaterials(
                        filteredMaterials.every((m) =>
                          selectedMaterials.includes(m._id)
                        )
                          ? []
                          : filteredMaterials.map((m) => m._id)
                      ),
                    rowLabel: (m) => m.name,
                  }}
                  columns={[
                    {
                      key: 'name',
                      header: 'Material Name',
                      cell: (m) => m.name,
                      mobile: 'title',
                    },
                    {
                      key: 'category',
                      header: 'Category',
                      cell: (m) => m.category?.name,
                    },
                    {
                      key: 'type',
                      header: 'Material Type',
                      cell: (m) => m.materialType,
                    },
                    {
                      key: 'unit',
                      header: 'Unit',
                      cell: (m) => m.unitOfMeasurement?.name,
                    },
                  ]}
                  actions={(material) => (
                    <>
                      <Link
                        href={`/pages/account/admin/manage-materials/edit-material?id=${material._id}`}
                        title="Edit Material"
                        aria-label="Edit Material"
                      >
                        <Image
                          src="/assets/edit.png"
                          alt=""
                          width={15}
                          height={15}
                        />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleMaterialToDelete([material._id])}
                        title="Delete Material"
                        aria-label="Delete Material"
                      >
                        <Image
                          src="/assets/delete.png"
                          alt=""
                          width={15}
                          height={15}
                        />
                      </button>
                    </>
                  )}
                />

                {selectedMaterials.length > 0 && (
                  <div className="sticky bottom-0 bg-white flex flex-row flex-wrap py-2 justify-end px-2 md:px-5 gap-3 md:gap-5">
                    <button
                      onClick={() => handleMaterialToDelete(selectedMaterials)}
                      className="bg-error text-white text-sm px-2 py-2 rounded-md mt-5 hover:bg-opacity-90 flex flex-row items-center gap-1"
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
                      onClick={() => setSelectedMaterials([])}
                      className="bg-brand-gray text-white text-sm px-2 py-2 rounded-md mt-5 hover:bg-opacity-80 flex flex-row items-center gap-1"
                    >
                      {`Clear Selection`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <PageDescription pageDescription={pageDescription} />
        </div>
      </div>

      {exportContent && filteredMaterials.length > 0 && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <ExportContent
            metadata={{
              Date: [new Date().toLocaleDateString()],
              Time: [new Date().toLocaleTimeString()],
              category: selectedCategory ? [selectedCategory] : ['All'],
              materialType: selectedMaterialType
                ? [selectedMaterialType]
                : ['All'],
            }}
            data={filteredMaterials.map((material, index) => {
              return {
                'S/No': index + 1,
                Name: material.name,
                Category: material.category?.name,
                'Material Type': material.materialType,
                Unit: material.unitOfMeasurement?.name,
              };
            })}
            onClose={() => setExportContent(false)}
            title={'Export Materials'}
          />
        </div>
      )}

      {openDeleteModal && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <DeleteModal
            title={
              selectedMaterials.length > 1
                ? 'Delete Materials'
                : 'Delete Material'
            }
            message={`Are you sure you want to delete the selected ${selectedMaterials.length > 1 ? 'materials?' : 'material?'} This action cannot be undone.`}
            buttonStyle={'bg-error hover:bg-error-hover text-white'}
            onClose={handleClose}
            onConfirm={() => handleDeleteMaterials()}
            loading={loading}
            deleteErrors={deleteErrors}
            deleteMessages={deleteMessages}
          />
        </div>
      )}
    </div>
  );
};

export default ViewMaterial;
