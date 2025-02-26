import PageDescription from '@/components/account/PageDescription';
import React from 'react';
import Header from '@/components/account/Header';
import SubHeader from './SubHeader';
import MaterialSidebar from './materialSidebar';

const CreateGroupedMaterial = ({pageDescription}) => {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const selectedSubMenu = {
        name: 'Create Grouped Material',
        link: '/create-grouped-material',
    };
  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Create a grouped material'} />
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
                    Let&apos;s create a grouped material for your store...
                  </span>
                  <form className="flex flex-col gap-5 my-5">
                  </form>



            </div>
            <PageDescription pageDescription={pageDescription}/>
          </div>
        </div>
    </div>
  )
}

export default CreateGroupedMaterial