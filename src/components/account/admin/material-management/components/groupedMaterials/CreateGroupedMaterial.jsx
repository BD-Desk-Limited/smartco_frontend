import PageDescription from '@/components/account/PageDescription';
import React from 'react';
import Header from '@/components/account/Header';
import SubHeader from '../SubHeader';
import MaterialSidebar from '../materialSidebar';
import CreateGroupedMaterialForm from './CreateGroupedMaterialForm';
import CreateGroupedMaterialPreview from './CreateGroupedMaterialPreview';
import { getMaterialCategories, getMaterialUnits, getAllMaterials } from '@/services/materialServices';

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

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Grouped material'} />
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
          <div className='flex flex-row gap-5 w-full max-h-[80vh] overflow-y-auto scrollbar-thin'>
            <CreateGroupedMaterialForm 
              formData={formData} 
              setFormData={setFormData}
              allCategories={allCategories}
              allUnits={allUnits}
              allMaterials={allMaterials}
            />
            <CreateGroupedMaterialPreview
              formData={formData}
              setFormData={setFormData}
              allMaterials={allMaterials}
              allUnits={allUnits}
            />
          </div>
          <PageDescription pageDescription={pageDescription}/>
        </div>
        </div>
    </div>
  )
}

export default CreateGroupedMaterial