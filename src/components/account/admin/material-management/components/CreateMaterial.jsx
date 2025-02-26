import React, { use } from 'react';
import MaterialSidebar from './materialSidebar';
import Header from '@/components/account/Header';
import SubHeader from './SubHeader';
import PageDescription from '@/components/account/PageDescription';
import {
  getMaterialCategories,
  getMaterialUnits,
  createMaterialCategories,
  createMaterialUnits,
  createMaterial,
} from '@/services/materialServices';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import BulkMaterialUploadModal from './BulkMaterialUploadModal';
import { verifyInputText } from '@/utilities/verifyInput';
import SuccessModal from '@/components/account/SuccessModal';

const CreateMaterial = ({ pageDescription }) => {
  const [form, setForm] = React.useState({
    materialName: '',
    materialType: '',
    materialDescription: '',
    materialUnit: '',
    materialCategory: '',
  });
  const [openSidebar, setOpenSidebar] = React.useState(true);
  const [categories, setCategories] = React.useState([]);
  const [units, setUnits] = React.useState([]);
  const [cantFindCategory, setCantFindCategory] = React.useState(false);
  const [cantFindUnit, setCantFindUnit] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [newUnit, setNewUnit] = React.useState('');
  const [categoryCreated, setCategoryCreated] = React.useState(false);
  const [unitCreated, setUnitCreated] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [bulkUpload, setBulkUpload] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const selectedSubMenu = {
    name: 'Create Material',
    link: '/',
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      const response = await getMaterialCategories();
      if (response.data) {
        setCategories(response.data || []);
      }
    };
    fetchCategories();
  }, []);

  React.useEffect(() => {
    const sampleUnits = [
      { name: 'kilograme', _id: '1' },
      { name: 'gram', _id: '2' },
      { name: 'litre', _id: '3' },
    ];

    const fetchUnits = async () => {
      const response = await getMaterialUnits();
      if (response.data) {
        const unitsFromDB = response.data || [];
        const allUnits = [...new Set([...unitsFromDB, ...sampleUnits])];
        setUnits([...allUnits]);
      }
    };
    fetchUnits();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const createCategory = async () => {
      setError('');
      
      if (!newCategory) {
        setError('Please enter a new category name');
        return;
      };

      const passedVerification = verifyInputText(newCategory);
      if (!passedVerification.passed) {
        setError(passedVerification.message);
        return;
      };  

      try {
        setLoading(true);
        const response = await createMaterialCategories({ name: newCategory });
        if (response.data) {
          setForm({ ...form, materialCategory: newCategory });
          const tempId = `sampleCategoryId-${Math.floor(Math.random() * 1000)}`;
          setCategories([...categories, {name: newCategory, _id: tempId}]);
          setCategoryCreated(true);
          setNewCategory('');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('error creating material category, please try again!!!');
      } finally {
        setLoading(false);
      }
    };
    createCategory();
  };

  const handleCreateUnit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!newUnit) {
      setError('Please enter a new unit name');
      return;
    }

    const passedVerification = verifyInputText(newUnit);
    if (!passedVerification.passed) {
      setError(passedVerification.message);
      return;
    };

    const createUnit = async () => {
      setLoading(true);
      try {
        const response = await createMaterialUnits({ name: newUnit });
        if (response.data) {

          setForm({ ...form, materialUnit: newUnit });
          const tempId = `sampleUnitId-${Math.floor(Math.random() * 1000)}`;
          setUnits([...units, { name: newUnit, _id: tempId }]);
          setUnitCreated(true);
          setNewUnit('');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('error creating new unit, please try again!!!');
      } finally {
        setLoading(false);
      }
    };
    createUnit();
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !form.materialName ||
      !form.materialType ||
      !form.materialCategory ||
      !form.materialUnit ||
      !form.materialDescription
    ) {
      setError(
        `Please fill all fields. ${
            !form.materialName ? 'Material Name, ' : ''} ${
                !form.materialType ? 'Material Type, ' : ''} ${
                    !form.materialCategory ? 'Material Category, ' : ''} ${
                        !form.materialUnit ? 'Material Unit, ' : ''} ${
                            !form.materialDescription ? 'Material Description, ' : ''
        } is not filled`
      );
      return;
    };

    const verifyInputs =(input) => {
      const passed = verifyInputText(input);
      if (!passed.passed) {
        setError(passed.message);
        return;
      };
    };

    verifyInputs(form.materialName);
    verifyInputs(form.materialDescription); 
    
    try {
      setLoading(true);
      const body = {
        name: form.materialName,
        materialType: form.materialType,
        category: form.materialCategory,
        unitOfMeasurement: form.materialUnit,
        description: form.materialDescription,
      };

      const response = await createMaterial(body);
      if(response.data) {
        setSuccess(true);
        setForm({
          materialName: '',
          materialType: '',
          materialDescription: '',
          materialUnit: '',
          materialCategory: '',
        });
        setCantFindCategory(false);
        setCantFindUnit(false);
        setCategoryCreated(false);
        setUnitCreated(false);
      } else {
        setError(response.error);
      };

    } catch (error) {
      setError(error || 'error creating material, please try again!!!');
      console.error('Error:', error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Material Onboarding'} />
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
            <div className="bg-white p-5 mx-5 my-2 rounded-md h-full">
              <h1 className="font-bold">Material Onboarding</h1>
              <span className="text-sm text-text-gray font-thin">
                Let&apos;s add a material to your store...
              </span>
              <form className="flex flex-col gap-5 my-5">
                <div className="flex flex-row gap-5">
                  <div className=" flex flex-col gap-5">
                    <div className="flex gap-1 flex-col">
                      <label className="text-sm font-thin">Material Name</label>
                      <input
                        type="text"
                        value={form.materialName}
                        onChange={(e) =>
                          setForm({ ...form, materialName: e.target.value })
                        }
                        placeholder="Enter material Name"
                        className="border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray"
                      />
                    </div>
                    <div className="flex gap-1 flex-col">
                      <label className="text-sm font-thin">Material Type</label>
                      <select
                        onChange={(e) =>
                          setForm({ ...form, materialType: e.target.value })
                        }
                        value={form.materialType}
                        className="border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray"
                      >
                        <option value="" className="bg-brand-blue">
                          Select Material Type
                        </option>
                        <option value="raw-material">Raw Material</option>
                        <option value="packaging">Packaging material</option>
                      </select>
                    </div>
                    <div>
                      {!categoryCreated ? (
                        !cantFindCategory ? (
                          <div className="flex gap-1 flex-col">
                            <label className="text-sm font-thin">
                              Material Category
                            </label>
                            <select
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  materialCategory: e.target.value,
                                })
                              }
                              value={form.materialCategory}
                              className="border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray"
                            >
                              <option value="" className="bg-brand-blue">
                                Select Material Category
                              </option>
                              {categories &&
                                categories?.map((category) => (
                                  <option key={category._id} value={category.name}>
                                    {category.name}
                                  </option>
                                ))}
                            </select>
                            <span
                              onClick={() => setCantFindCategory(true)}
                              className="text-xs font-semibold text-brand-blue cursor-pointer"
                            >
                              Can&apos;t find the right category?
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-1 flex-col">
                            <label className="text-sm font-thin">
                              Material Category
                            </label>
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter New Material Category"
                                className="border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray"
                              />
                              <button
                                className="bg-brand-blue p-1 rounded-md text-xs text-text-white hover:bg-blue-shadow4"
                                onClick={handleCreateCategory}
                              >
                                Create category
                              </button>
                            </div>
                            <span
                              onClick={() => setCantFindCategory(false)}
                              className="text-xs font-semibold text-brand-blue cursor-pointer"
                            >
                              select existing category?
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="text-sm flex flex-col gap-1 text-brand-green py-5 justify-center items-center">
                          <span>
                            New category <strong>{newCategory}</strong> created
                            successfully!!!
                          </span>
                          <span>
                            New category would be assigned to your new material
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className=" flex flex-col gap-7">
                    <div className="flex gap-1 flex-col">
                      <label className="text-sm font-thin">
                        Material Description
                      </label>
                      <textarea
                        value={form.materialDescription}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            materialDescription: e.target.value,
                          })
                        }
                        placeholder="Brief description of material"
                        className="border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray h-24"
                      />
                    </div>
                    <div className="flex gap-1 flex-col">
                      {!unitCreated ? (
                        cantFindUnit ? (
                          <div className="flex gap-1 flex-col">
                            <label className="text-sm font-thin">
                              Material Unit
                            </label>
                            <div className="flex gap-1 flex-col">
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  value={newUnit}
                                  onChange={(e) => setNewUnit(e.target.value)}
                                  placeholder="Enter New Material Unit"
                                  className="border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray"
                                />
                                <button
                                  className="bg-brand-blue p-1 rounded-md text-xs text-text-white hover:bg-blue-shadow4"
                                  onClick={handleCreateUnit}
                                >
                                  Create unit
                                </button>
                              </div>
                              <span
                                onClick={() => setCantFindUnit(false)}
                                className="text-xs font-semibold text-brand-blue cursor-pointer"
                              >
                                Select existing unit
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-1 flex-col">
                            <label className="text-sm font-thin">
                              Material Unit
                            </label>
                            <div className="flex gap-1 flex-col">
                              <select
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    materialUnit: e.target.value,
                                  })
                                }
                                value={form.materialUnit}
                                className="border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray"
                              >
                                <option value="" className="bg-brand-blue">
                                  Select Material Unit
                                </option>
                                {units?.map((unit) => (
                                  <option key={unit._id} value={unit.name}>
                                    {unit.name}
                                  </option>
                                ))}
                              </select>
                              <span
                                onClick={() => setCantFindUnit(true)}
                                className="text-xs font-semibold text-brand-blue cursor-pointer"
                              >
                                Can&apos;t find the right unit?
                              </span>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="text-sm flex flex-col gap-1 text-brand-green py-5 justify-center items-center">
                          <span>
                            New unit <strong>{newUnit}</strong> created
                            successfully!!!
                          </span>
                          <span>
                            New unit would be assigned to your new material
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {error && <ErrorInterface error={error} />}
                <div className="flex justify-center items-center my-5">
                  <Button
                    onClick={handleCreateMaterial}
                    type={'submit'}
                    loading={loading}
                    text={'create material'}
                    loadingText={'creating material...'}
                  />
                </div>
              </form>
              <hr className="border border-gray-border"></hr>
              <div className="flex flex-col justify-between items-center">
                <span className="text-sm text-text-gray my-2">
                  Want to create large number of materials?
                </span>
                <button
                  onClick={() => setOpenModal(true)}
                  className="p-2 border border-brand-green rounded-md text-brand-green hover:text-text-white hover:bg-brand-green"
                >
                  Upload in bulk
                </button>
              </div>
            </div>
            <PageDescription 
              pageDescription={pageDescription} 
            />
          </div>
      </div>
      {openModal && (
        <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center flex-col">
          <div
            className="bg-gray-shadow2 text-text-white cursor-pointer py-3 px-5 m-1 rounded-[100%] hover:bg-gray-shadow5"
            onClick={() => setOpenModal(false)}
            title="close"
          >
            X
          </div>
          <BulkMaterialUploadModal />
        </div>
      )}
      {success && (
        <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
          <SuccessModal 
            message={'Material created successfully'}
            title={'Create New Material'}
            buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
            onClose={() => setSuccess(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CreateMaterial;
