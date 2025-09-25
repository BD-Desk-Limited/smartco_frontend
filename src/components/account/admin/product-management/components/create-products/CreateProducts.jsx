import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import React, { Component } from 'react';
import ProductManagementSidebar from '../ProductManagementSidebar';
import PageDescription from '@/components/account/PageDescription';
import CreateProductForm from './CreateProductForm';
import CreateProductSidePreview from './CreateProductSidePreview';
import { useAuth } from '@/contexts/authContext';
import { getAllBranchBandsByCompanyId, getAllTaxBandsByCompanyId } from '@/services/branchServices';
import { createOrUpdateProductService, getAllProductCategoriesByCompanyIdService } from '@/services/productsServices';
import { getAllMaterials } from '@/services/materialServices';


const CreateProducts = ({pageDescription}) => {

    const selectedSubMenu = {
      name: 'Create New Product',
      link: '/create-new-product',
    };

    const emptyForm = { name: '', description: '', category: '', image: null, pricing: [], productTax: [] };

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [products, setProducts] = React.useState([emptyForm]); // State to hold products data
    const [loading, setLoading] = React.useState(false);
    const [productCategories, setProductCategories] = React.useState([]);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const {user} = useAuth();
    const [bands, setBands] = React.useState([]);
    const [taxBands, setTaxBands] = React.useState([]);
    const [bandsError, setBandsError] = React.useState({});
    const [materials, setMaterials] = React.useState([]);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    //fetch all materials
    React.useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await getAllMaterials();
          if (response.error) {
              console.error('Error fetching products', response.error);
              return;
          }
          if (response?.data) {
              setMaterials(response.data);
          }
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
      };
      fetchProducts();
    }, []);

    //fetch product categories
    React.useEffect(() => {
      const fetchCategories = async () => {
        setLoading(true);
        try {
          const response = await getAllProductCategoriesByCompanyIdService();
          if (response.error) {
            console.error('Error fetching product categories', response.error);
            return;
          }
          if (response?.data) {
            setProductCategories(response.data);
          }
        } catch (error) {
          console.error('Error fetching product categories', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }, []);

    //fetch all store price bands
    React.useEffect(()=>{
      const fetchBands = async() => {
        try{
          setLoading(true);
          const response = await getAllBranchBandsByCompanyId(user?.company);
          if(response.error){
            setBandsError(response.error);
          };

          if(response?.data){
            setBands(response.data);
          }
        }catch(error){
          console.error('Error fetching price bands', error)
          setBandsError(error);
        }finally{
          setLoading(false);
        }
      };

      fetchBands();
    },[user?.company]);

    //fetch all store tax bands
    React.useEffect(()=>{
      const fetchBands = async() => {
        try{
          setLoading(true);
          const response = await getAllTaxBandsByCompanyId();
          if(response.error){
            setBandsError(response.error);
          };

          if(response?.data){
            setTaxBands(response.data);
          }
        }catch(error){
          console.error('Error fetching price bands', error)
          setBandsError(error);
        }finally{
          setLoading(false);
        }
      };

      fetchBands();
    },[user?.company]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    //validations
    //product must have a name, category, at last one component, pricing for all bands, tax for all tax bands and description is optional




    // Create FormData object
    const formData = new FormData();

    // Format and append each product individually
    const formattedProducts = products.map(product => ({
        name: product.name,
        description: product.description || '', 
        category: product.category,
        components: product.components,
        pricing: product.pricing,
        productTax: product.productTax || [],
    }));

    // Attach products array as JSON string
    formData.append('products', JSON.stringify(formattedProducts));

    // Attach image files using product names as keys (matching controller expectation)
    products.forEach(product => {
        if (product.image && product.image.file) {
            formData.append(product.name, product.image.file); // Use product name as key
        }
    });

    try {
        const { data, error } = await createOrUpdateProductService(formData);
        console.log('Create Product Response:', { data, error });
        
        if (error) {
            console.error('Error creating products:', error);
            setError(error || 'An error occurred while creating products, please try again.');
        } else if (data) {
            setSuccess(true);
            setProducts([emptyForm]);
            setSelectedProduct(null);
        }
    } catch (error) {
        console.error('Error creating products:', error);
        setError('An error occurred while creating products, please try again.');
    } finally {
        setLoading(false);
    }
  };

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
                        emptyForm={emptyForm}
                        products={products}
                        setProducts={setProducts}
                        productCategories={productCategories}
                        setSelectedProduct={setSelectedProduct}
                        bands={bands}
                        taxBands={taxBands}
                        bandsError={bandsError}
                        setBandsError={setBandsError}
                        setBands={setBands}
                        setTaxBands={setTaxBands}
                        materials={materials}
                        loading={loading}
                        setLoading={setLoading}
                        setMaterials={setMaterials}
                        handleCreateProduct={handleCreateProduct}
                    />
                </div>
                <div className='max-h-[90%] overflow-y-auto scrollbar-thin w-1/5'>
                    <CreateProductSidePreview 
                        products={products}
                        selectedProduct={selectedProduct}
                        taxBands={taxBands}
                    />
                </div>
            </div>
        <div className=''><PageDescription pageDescription={pageDescription}/></div>
      </div>
    </div>

    {/* Success Modal */}
    {/*success && (
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