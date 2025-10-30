import PageDescription from '@/components/account/PageDescription';
import React from 'react';
import Header from '@/components/account/Header';
import SubHeader from '../../../../SubHeader';
import MaterialSidebar from '../materialSidebar';
import CreateGroupedMaterialForm from './CreateGroupedMaterialForm';
import CreateGroupedMaterialPreview from './CreateGroupedMaterialPreview';
import { getMaterialCategories, getMaterialUnits, getAllMaterials, createMaterial } from '@/services/materialServices';
import ReviewGroupedMaterial from './ReviewGroupedMaterial';
import { verifyInputText } from '@/utilities/verifyInput';
import SuccessModal from '@/components/account/SuccessModal';

const CreateGroupedMaterial = ({pageDescription}) => {

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    materialType: '',
    category: '',
    unit: '',
    components: [],
  });
  const [allCategories, setAllCategories] = React.useState([]);
  const [allUnits, setAllUnits] = React.useState([]);
  const [allMaterials, setAllMaterials] = React.useState([]); 
  const [showReview, setShowReview] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [addComponentsError, setAddComponentsError] = React.useState(null);

  const [openSidebar, setOpenSidebar] = React.useState(false);
  const selectedSubMenu = {
      name: 'Create Grouped Material',
      link: '/create-grouped-material',
  };

  React.useEffect(() => {
    const fetchMaterialCategories = async () => {

      try {
        const {data} = await getMaterialCategories();
        setAllCategories(data);
      } catch (error) {
        console.error('Error fetching material categories: ', error);
      }
      
    };
    fetchMaterialCategories();
  }, []);

  React.useEffect(() => {
    const fetchMaterialUnits = async () => {
      try {
        const {data} = await getMaterialUnits();
        setAllUnits(data);
      } catch (error) {
        console.error('Error fetching material units: ', error);
      }

    };
    fetchMaterialUnits();
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

  const handleCreateGroupedMaterial = async(e) => { 
    e.preventDefault();
    setError(null);

    // Validate form data input helper function
    const passedInputValidation = (input) => {
      const passed = verifyInputText(input);
      if (!passed.passed) {
        return passed.message;
      }else {
        return true;
      }
    }

    for (const field of Object.values(formData)) {
      if (typeof field === 'string') {
        if (field.trim() === '') {
          setError('Please fill in all fields');
          return;
        }
        
        if(passedInputValidation(field) !== true) {
          setError(`${passedInputValidation(field)} please check ${Object.keys(formData).find(key => formData[key] === field)}`);
          return;
        }
      };

      if (Array.isArray(field)) {
        if (field.length < 2) {
          setError('Please select at least two component materials to create a grouped material');
          return;
        }
      }
    };

    const body = {
      name: formData.name,
      description: formData.description,
      materialType: formData.materialType,
      category: formData.category,
      unitOfMeasurement: formData.unit,
      components: formData.components,
      isGroup: true,
    };

    setLoading(true);
    try{
      const {data, error} = await createMaterial(body);

      if(error){
        setError('An error occurred while creating the grouped material');
        console.error('Error creating grouped material: ', error);
      };

      if(data && data.success){
        setShowSuccess(true);
        setFormData({
          name: '',
          description: '',
          materialType: '',
          category: '',
          unit: '',
          components: [],
        });
        setShowReview(false);
      }
    }catch(err){
      setError('An error occurred while creating the grouped material');
      console.error('Error creating grouped material: ', err);
    }finally{
      setLoading(false);
    };
  };

  const handleDeleteMaterial = (id) => {
    const newComponents = formData.components.filter((material) => material.id !== id);
    setFormData({...formData, components: newComponents});
  };

  const handleCloseSuccessModal = () => {
    setShowSuccess(false);
    setAddComponentsError(null);
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Grouped material'} />
      </div>
      <div className="flex flex-row gap-5 w-full h-full">
        <div className="min-w-fit">
          <MaterialSidebar 
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col w-full h-full gap-5"> 
          <div className='flex flex-row gap-5 w-full max-h-[80vh] overflow-y-auto scrollbar-thin'>
            <CreateGroupedMaterialForm 
              formData={formData} 
              setFormData={setFormData}
              allCategories={allCategories}
              allUnits={allUnits}
              allMaterials={allMaterials}
              error={addComponentsError}
              setError={setAddComponentsError}
            />
            <CreateGroupedMaterialPreview
              formData={formData}
              setFormData={setFormData}
              allMaterials={allMaterials}
              allUnits={allUnits}
              setShowReview={setShowReview}
              handleDeleteMaterial={handleDeleteMaterial}
            />
          </div>
          <PageDescription pageDescription={pageDescription}/>
        </div>
      </div>
      {
        showReview && (
          <div className='inset-0 bg-black bg-opacity-70 z-50 fixed w-full h-full flex justify-center items-center'>
            <ReviewGroupedMaterial 
              formData={formData}
              setFormData={setFormData}
              setShowReview={setShowReview}
              handleCreateGroupedMaterial={handleCreateGroupedMaterial}
              handleDeleteMaterial={handleDeleteMaterial}
              allMaterials={allMaterials}
              error={error}
              setError={setError}
              showSuccess={showSuccess}
              setShowSuccess={setShowSuccess}
              loading={loading}
            />
          </div>
        )
      }
      {
        showSuccess && (
          <div className='inset-0 bg-black bg-opacity-70 z-50 fixed w-full h-full flex justify-center items-center'>
            <SuccessModal 
              message={'Grouped material created successfully'} 
              title={'Success'} 
              onClose={handleCloseSuccessModal} 
              subText={`you can now view the grouped material in the materials list`}
              buttonStyle={'bg-brand-blue'}
              buttonText={'Close'}
            />
          </div>
        )
      }
    </div>
  )
}

export default CreateGroupedMaterial