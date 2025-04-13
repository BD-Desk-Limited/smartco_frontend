import React from 'react'
import PageDescription from '@/components/account/PageDescription';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/account/Header';
import SubHeader from '../../../../SubHeader';
import MaterialSidebar from '../materialSidebar';
import { getAllMaterials, getMaterialCategories, getMaterialUnits, updateMaterial, } from '@/services/materialServices';
import SuccessModal from '@/components/account/SuccessModal';
import EditGroupedMaterialForm from './EditGroupedMaterialForm';
import EditGroupedMaterialComponentDisplay from './EditGroupedMaterialComponentDisplay';
import ReviewGroupedMaterial from './ReviewGroupedMaterial';
import { verifyInputText } from '@/utilities/verifyInput';

const EditGroupedMaterial = ({materialData, pageDescription}) => {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [updatedMaterialData, setUpdatedMaterialData] = React.useState({});
    const [allCategories, setAllCategories] = React.useState([]);
    const [allUnits, setAllUnits] = React.useState([]);
    const [allMaterials, setAllMaterials] = React.useState([]);
    const [newMaterialImage, setNewMaterialImage] = React.useState(null);
    const [error, setError] = React.useState(false);
    const [Loading, setLoading] = React.useState(false);
    const [showReview, setShowReview] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const router = useRouter();

    const selectedSubMenu = {
        name: 'View Grouped Materials',
        link: '/view-grouped-materials',
    };

    React.useEffect(() => {
      setUpdatedMaterialData(materialData);
    }, [materialData]);

    React.useEffect(() => {
      // Fetch all categories
      const fetchAllCategories = async () => {
        try {
          const response = await getMaterialCategories();
          if (response.data) {
            setAllCategories(response.data);
          };
        } catch (err) {
          console.error(err)
        };
      };
      fetchAllCategories();
    }, []);

    React.useEffect(() => {
      // Fetch all units
      const fetchAllUnits = async () => {
        try {
          const response = await getMaterialUnits();
          if (response.data) {
            setAllUnits(response.data);
          };
        } catch (err) {
          console.error(err)
        };
      };
      fetchAllUnits();
    }, []);

    React.useEffect(() => {
      const fetchAllMaterials = async () => {
        try {
          const {data} = await getAllMaterials();
          setAllMaterials(data);
        } catch (error) {
          console.error('Error fetching all materials: ', error);
        }
      };
      fetchAllMaterials();
    }, []);

    const handleDeleteMaterial = (id) => {
      const newComponents = updatedMaterialData.components.filter((material) => material.id !== id);
      setUpdatedMaterialData({...updatedMaterialData, components: newComponents});
    };

    const handleUpdateGroupedMaterial = async () => {
      
      setError('');

      // Validate form fields
      let inputValidationErrors = [];

      const handleValidation = (input, message) => {
        if (!input) {
          inputValidationErrors.push(message);
        }else{
          const verifyInput = verifyInputText(input);
          if (!verifyInput.passed) {
            inputValidationErrors.push(verifyInput.message+ ' ' + message);
          };
        }
      };

      handleValidation(updatedMaterialData.name, 'Please enter a valid material name');
      handleValidation(updatedMaterialData.description, 'Please enter a valid material description');
      handleValidation(updatedMaterialData.materialType, 'Please select a valid material type');
      handleValidation(updatedMaterialData.category.name, 'Please select a valid material category');
      handleValidation(updatedMaterialData.unitOfMeasurement.name, 'Please select a valid unit of measurement');
      if (inputValidationErrors.length > 0) {
        setError(inputValidationErrors[0]);
        return;
      };

      //update material details
      const body = {
        ...updatedMaterialData,
        category: updatedMaterialData.category._id,
        unitOfMeasurement: updatedMaterialData.unitOfMeasurement._id,
        components: updatedMaterialData.components.map((material) => ({
          id: material.id,
          quantity: material.quantity,
          isGroup: material.isGroup || false,
        })),
      };

      //call Api to update material
      setLoading(true);
      try{
        const response = await updateMaterial(materialData._id, body, newMaterialImage);
        if (response.data){
          
          setShowSuccess(true);
          setShowReview(false);
        }else{
          setError(response.error || 'Error updating material, please try again');
        }
      }catch (err) {
        console.error('Error updating material: ', err);
        setError(err.message || 'Error updating material, please try again');
      }finally {
        setLoading(false);
      };
    };

  return (
    <div className='w-full'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Edit Grouped Material'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <MaterialSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="bg-white p-5 mx-5 my-2 rounded-md max-h-[85vh] overflow-y-auto no-scrollbar text-text-gray">
            <h1 className='font-bold text-lg'>{materialData?.name}</h1>
            <span className='text-sm'>Edit this material in your stores, Click on any field to update</span>
            <div className='flex flex-row gap-5 mt-5'>
              <EditGroupedMaterialForm
                materialData={materialData}
                updatedMaterialData={updatedMaterialData}
                setUpdatedMaterialData={setUpdatedMaterialData}
                allCategories={allCategories}
                setAllCategories={setAllCategories}
                allMaterials={allMaterials}
                allUnits={allUnits}
                setAllUnits={setAllUnits}
                newMaterialImage={newMaterialImage}
                setNewMaterialImage={setNewMaterialImage}
                error={error}
                setError={setError}
                Loading={Loading}
                setLoading={setLoading}
              />

              {<EditGroupedMaterialComponentDisplay
                updatedMaterialData={updatedMaterialData}
                setUpdatedMaterialData={setUpdatedMaterialData}
                allMaterials={allMaterials}
                setShowReview={setShowReview}
                handleDeleteMaterial={handleDeleteMaterial}
                materialData={materialData}
                newMaterialImage={newMaterialImage}
              />}
            </div>
          </div>
          <PageDescription pageDescription={pageDescription}/>
        </div>
        
      </div>
      {
        showReview && (
          <div className='inset-0 bg-black bg-opacity-70 z-50 fixed w-full h-full flex justify-center items-center'>
            <ReviewGroupedMaterial
              formData={{...updatedMaterialData, category: updatedMaterialData?.category?.name, unit: updatedMaterialData?.unitOfMeasurement?.name}}
              setFormData={setUpdatedMaterialData}
              setShowReview={setShowReview}
              handleCreateGroupedMaterial={handleUpdateGroupedMaterial}
              handleDeleteMaterial={handleDeleteMaterial}
              allMaterials={allMaterials}
              error={error}
              setError={setError}
              showSuccess={showSuccess}
              setShowSuccess={setShowSuccess}
              loading={Loading}
            />
          </div>
        )
      }
      {
        showSuccess && (
          <div className='inset-0 bg-black bg-opacity-70 z-50 fixed w-full h-full flex justify-center items-center'>
            <SuccessModal
              message={'Grouped material updated successfully'} 
              title={'Success'} 
              onClose={()=>{setShowSuccess(false); router.push('/pages/account/admin/manage-materials/view-grouped-materials')}}
              subText={`you can now view the updated grouped material in the materials list`}
              buttonStyle={'bg-brand-blue'}
              buttonText={'Close'}
            />
          </div>
        )
      }
    </div>
  )
}

export default EditGroupedMaterial;