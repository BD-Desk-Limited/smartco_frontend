import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import React from 'react';
import ProductManagementSidebar from '../ProductManagementSidebar';
import PageDescription from '@/components/account/PageDescription';
import CreateProductForm from './CreateProductForm';
import CreateProductSidePreview from './CreateProductSidePreview';

const sampleProductCategories = [
    { _id: 1, name: 'Electronics' },
    { _id: 2, name: 'Clothing' },
    { _id: 3, name: 'Accessories' },
];
const CreateProducts = ({pageDescription}) => {

    const selectedSubMenu = {
      name: 'Create New Product',
      link: '/create-new-product',
    };
    const [openSidebar, setOpenSidebar] = React.useState(true);
    const [products, setProducts] = React.useState([
        { name: '', description: '', price: '', category: '', availability: 0, images: [] }
    ]); // State to hold products data
    const [loading, setLoading] = React.useState(false);
    const [productCategories, setProductCategories] = React.useState([]);
    const [selectedProduct, setSelectedProduct] = React.useState(null);

    // fetch product categories
    React.useEffect(() => { 
        setProductCategories(sampleProductCategories);
    }, []);



  return (
    <div className='relative bg-background-1'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
          <SubHeader title={'Create a Product'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute top-0 z-10">
          <ProductManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full'>
            <div className="p-5 h-full flex flex-row gap-5 min-h-[70vh] max-h-[80vh] overflow-y-auto no-scrollbar">
                <div className='max-h-[90%] overflow-y-auto scrollbar-thin w-4/5'>
                    <CreateProductForm
                        products={products}
                        setProducts={setProducts}
                        productCategories={productCategories}
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                    />
                </div>
                <div className='max-h-[90%] overflow-y-auto scrollbar-thin w-1/5'>
                    <CreateProductSidePreview />
                </div>
            </div>
        <div className=''><PageDescription pageDescription={pageDescription}/></div>
      </div>
    </div>

    {/* Delete Confirmation Modal */}
    {/*openDeleteModal && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
        <DeleteModal
          message={`Are you sure you want to delete the selected ${selectedProduct.length>1? 'products?':'product?'} This action cannot be undone.`}
          title={selectedProduct.length>1? 'Delete Products':'Delete Product'}
          buttonStyle={`bg-error text-white hover:bg-error-hover`}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteProducts}
          button2Style={`bg-brand-blue text-white`}
          deleteErrors={deleteErrors}
          deleteMessages={deleteMessages}
          loading={loading}
        />
      </div>
    )*/}
  </div>
  )
}

export default CreateProducts;