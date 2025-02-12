import React from 'react';
import MaterialSidebar from './materialSidebar';
import Header from '@/components/account/Header';
import SubHeader from './SubHeader';

const categories = ['vegetables', 'fruits', 'meat', 'fish', 'dairy', 'bakery', 'beverages', 'snacks', 'cereals', 'spices', 'condiments', 'sauces', 'frozen', 'canned', 'cleaning', 'personal care', 'home care', 'pet care', 'baby care', 'others'];
const pageDescription = 'This is the description panel. It will contain a brief description';

const CreateMaterial = () => {

    const [form, setForm] = React.useState({
        materialName: '',
        materialType: '',
        materialDescription: '',
        materialUnit: '',
        materialCategory: '',
    });
    const [cantFindCategory, setCantFindCategory] = React.useState(false);
    const [cantFindUnit, setCantFindUnit] = React.useState(false);

    const selectedSubMenu = {
        name: 'Create Material',
        link: '/',
    };

    const handleCreateCategory = () => {
        console.log('Creating category...');
    };

    const handleCreateUnit = () => {
        console.log('Creating unit...');
    };


  return (
    <div>
        <div className='w-full'>
            <Header/>
        </div>
        <div>
            <SubHeader title={'Material Onboarding'}/>
        </div>
        <div className='flex flex-row gap-0 w-full h-full'>
            <div className='min-w-fit'><MaterialSidebar selectedSubMenu={selectedSubMenu}/></div>
            <div className='flex flex-col w-full h-full'>
                <div className='bg-white p-5 mx-5 my-2 rounded-md h-full'>
                    <h1 className='font-bold'>Material Onboarding</h1>
                    <span className='text-sm text-text-gray font-thin'>Let's add a material to your store...</span>
                    <form className='flex flex-col gap-5 my-5'>
                        <div className='flex flex-row gap-5'>
                            <div className=' flex flex-col gap-5'>
                                <div className='flex gap-1 flex-col'>
                                    <label className='text-sm font-thin'>
                                        Material Name
                                    </label>
                                    <input 
                                        type='text' 
                                        value={form.materialName}
                                        onChange={(e) => setForm({...form, materialName: e.target.value})}
                                        placeholder='Enter material Name'
                                        className='border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray'
                                    />
                                </div>
                                <div className='flex gap-1 flex-col'>
                                    <label className='text-sm font-thin'>
                                        Material Type
                                    </label>
                                    <select 
                                        onChange={(e) => setForm({...form, materialType: e.target.value})} 
                                        value={form.materialType}
                                        className='border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray'
                                    >
                                        <option value='' className='bg-brand-blue'>Select Material Type</option>
                                        <option value='raw-material'>Raw Material</option>
                                        <option value='packaging'>Packaging material</option>
                                    </select>
                                </div>
                                <div>
                                    {!cantFindCategory ?
                                        <div className='flex gap-1 flex-col'>
                                            <label className='text-sm font-thin'>Material Category</label>
                                            <select
                                                onChange={(e) => setForm({...form, materialCategory: e.target.value})}
                                                value={form.materialCategory}
                                                className='border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray'
                                            >
                                                <option value='' className='bg-brand-blue'>Select Material Category</option>
                                                {categories?.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                            <span onClick={() => setCantFindCategory(true)} className='text-xs font-semibold text-brand-blue cursor-pointer'>Can't find the right category?</span>
                                        </div> :
                                        <div className='flex gap-1 flex-col'>
                                            <label className='text-sm font-thin'>Material Category</label>
                                            <div className='flex gap-1'>
                                                <input
                                                    type='text'
                                                    value={form.materialCategory}
                                                    onChange={(e) => setForm({...form, materialCategory: e.target.value})}
                                                    placeholder='Enter Material Category'
                                                    className='border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray'
                                                />
                                                <button 
                                                    className='bg-brand-blue p-1 rounded-md text-xs text-text-white hover:bg-blue-shadow4' 
                                                    onClick={handleCreateCategory}
                                                >
                                                    Create category
                                                </button>
                                            </div>
                                            <span onClick={() => setCantFindCategory(false)} className='text-xs font-semibold text-brand-blue cursor-pointer'>select existing category?</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className=' flex flex-col gap-7'>
                                <div className='flex gap-1 flex-col'>
                                    <label className='text-sm font-thin'>
                                        Material Description
                                    </label>
                                    <textarea 
                                        value={form.materialDescription}
                                        onChange={(e) => setForm({...form, materialDescription: e.target.value})}
                                        placeholder='Brief description of material'
                                        className='border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray h-24'
                                    />
                                </div>
                                <div className='flex gap-1 flex-col'>
                                    {cantFindUnit ?
                                    <div className='flex gap-1 flex-col'>
                                        <label className='text-sm font-thin'>Material Unit</label>
                                        <div className='flex gap-1 flex-col'>
                                            <div className='flex gap-1'>
                                                <input
                                                    type='text'
                                                    value={form.materialUnit}
                                                    onChange={(e) => setForm({...form, materialUnit: e.target.value})}
                                                    placeholder='Enter Material Unit'
                                                    className='border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray'
                                                />
                                                <button 
                                                    className='bg-brand-blue p-1 rounded-md text-xs text-text-white hover:bg-blue-shadow4' 
                                                    onClick={handleCreateUnit}
                                                >
                                                    Create unit
                                                </button>
                                            </div>
                                            <span onClick={() => setCantFindUnit(false)} className='text-xs font-semibold text-brand-blue cursor-pointer'>Select existing unit</span>     
                                        </div>
                                    </div> :
                                    <div className='flex gap-1 flex-col'>
                                        <label className='text-sm font-thin'>Material Unit</label>
                                        <div className='flex gap-1 flex-col'>
                                            <select
                                                onChange={(e) => setForm({...form, materialUnit: e.target.value})}
                                                value={form.materialUnit}
                                                className='border border-gray-border rounded-md p-2 w-80 focus:outline-none text-sm text-text-gray'
                                            >
                                                <option value='' className='bg-brand-blue'>Select Material Unit</option>
                                                <option value='kg'>Kilogram</option>
                                                <option value='g'>Gram</option>
                                                <option value='l'>Liter</option>
                                                <option value='ml'>Milliliter</option>
                                                <option value='pcs'>Pieces</option>
                                            </select>
                                            <span onClick={() => setCantFindUnit(true)} className='text-xs font-semibold text-brand-blue cursor-pointer'>Can't find the right unit?</span>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center items-center'>
                            <button className='bg-brand-blue py-1 px-7 my-5 rounded-md text-text-white hover:bg-blue-shadow4 mt-5'>Save</button>
                        </div>
                    </form>
                    <hr className='border border-gray-border'></hr>
                    <div className='flex flex-col justify-between items-center'>
                        <span className='text-sm text-text-gray my-2'>Want to create large number of materials?</span>
                        <button className='p-2 border border-brand-green rounded-md text-brand-green hover:text-text-white hover:bg-brand-green'>Upload in bulk</button>
                    </div>
                </div>
                <div className='bg-white p-3 mx-5 my-2 rounded-md italic text-text-gray'>
                    <h1 className=''>Description Panel</h1>
                    <span className='text-sm font-thin'>{pageDescription}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateMaterial;