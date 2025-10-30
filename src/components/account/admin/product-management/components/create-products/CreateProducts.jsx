import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import React from 'react';
import ProductManagementSidebar from '../ProductManagementSidebar';
import PageDescription from '@/components/account/PageDescription';
import { useCreateProducts } from '@/contexts/createProductsContext';
import CreateProductForm from './CreateProductForm';
import CreateProductSidePreview from './CreateProductSidePreview';
import { useAuth } from '@/contexts/authContext';
import { getAllBranchBandsByCompanyId, getAllTaxBandsByCompanyId } from '@/services/branchServices';
import { createOrUpdateProductService, getAllProductCategoriesByCompanyIdService } from '@/services/productsServices';
import { getAllMaterials } from '@/services/materialServices';
import { verifyName } from '@/utilities/verifyInput';
import Spinner from '@/components/account/Spinner';
import SuccessModal from '@/components/account/SuccessModal';
import WarningModal from '@/components/account/WarningModal';
import { getCompanyDetails } from '@/services/companyServices';


const CreateProducts = ({pageDescription}) => {

    const selectedSubMenu = {
      name: 'Create New Product',
      link: '/create-new-product',
    };

    const {products, setProducts, emptyForm} = useCreateProducts(); // global state for products to be created

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [productCategories, setProductCategories] = React.useState([]);
    const [selectedProduct, setSelectedProduct] = React.useState(products[0] || null);
    const {user} = useAuth();
    const [bands, setBands] = React.useState([]);
    const [taxBands, setTaxBands] = React.useState([]);
    const [bandsError, setBandsError] = React.useState({});
    const [materials, setMaterials] = React.useState([]);
    const [error, setError] = React.useState([]);
    const [openWarning, setOpenWarning] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [companyDetails, setCompanyDetails] = React.useState(null);

    //fetch all materials
    React.useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await getAllMaterials();
          if (response.error) {
            console.error('Error fetching materials', response.error);
            return;
          }
          if (response?.data) {
              setMaterials(response.data || []);
          }
        } catch (error) {
            console.error('Error fetching materials', error);
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

    //fetch company details
    React.useEffect(() => {
      if (user && user.company) {
        // Fetch company details based on user.company
        const fetchCompanyDetails = async () => {
          try {
            const response = await getCompanyDetails();
            if (response?.data) {
              setCompanyDetails(response.data);
            } else if (response?.error) {
              console.error('Error fetching company details:', response.error);
            }
          } catch (error) {
            console.error('Error fetching company details:', error);
          }
        };
  
        fetchCompanyDetails();
      }
    }, [user, getCompanyDetails]);

    // handle all validations and open warning modal
    const handleOpenWarning = () => {
      setLoading(true);

      // loop through products to validate each one
      for(const product of products){
        if(!product.name || product.name.trim() === ''){
          setError([`Product name is required for product number ${products.indexOf(product) + 1}.`]);
          setLoading(false);
          return;
        };

        //validate invalid characters in name
        const validName = verifyName(product.name);
        if(!validName.passed){
          setError([`${validName.message} for product number ${products.indexOf(product) + 1}.`]);
          setLoading(false);
          return;
        };

        // validate description for all products
        if(!product.description || product.description.trim() === ''){
          setError([`Product description is required for ${product.name ? product.name : 'this'} product number ${products.indexOf(product) + 1}.`]);
          setLoading(false);
          return;
        }

        // validate invalid characters in description
        const validDescription = verifyName(product.description);
        if(!validDescription.passed){
          setError([`${validDescription.message} for product description of ${product.name ? product.name : 'this'} product number ${products.indexOf(product) + 1}.`]);
          setLoading(false);
          return;
        }

        // validate category for all products
        if(!product.category || product.category.trim() === ''){
          setError([`Product category is required for ${product.name ? product.name : 'this'} product number ${products.indexOf(product) + 1}.`]);
          setLoading(false);
          return;
        }

        // Ensure at least one component and pricing for all bands is provided
        if(
          !product.components ||
          !product.components.every(
            component => component.materialChoices.length > 0 
          )
        ){
          setError([`At least one component with material choices is required for ${product.name ? product.name : 'this'} product number ${products.indexOf(product) + 1}.`]);
          setLoading(false);
          return;
        }

        // ensure all material choices have quantity selected for all products
        if(
          !product.components.every(
            component => component.materialChoices.every(
              material => material.quantity && material.quantity > 0
            )
          )
        ){
          setError([`Please ensure all material choices for ${product.name ? product.name : 'this'} product number ${products.indexOf(product) + 1} have a quantity greater than zero.`]);
          setLoading(false);
          return;
        }
      };

      // loop through bands error to check if any product has error
      for(const key in bandsError){
        if(bandsError[key]){
          setError([`Please resolve the band price errors for ${products[key].name ? products[key].name : 'product number ' + (parseInt(key) + 1)} before creating products.`]);
          setLoading(false);
          return;
        }
      }

      // Ensure no duplicate product names (case-insensitive)
      const names = products.map(p => p.name.trim().toLowerCase());
      const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);

      if (duplicateNames.length > 0) {
        setError([`Duplicate product names found for: ${[...new Set(duplicateNames)].join(', ')}. Please ensure all product names are unique.`]);
        setLoading(false);
        return;
      }

      setLoading(false);
      setOpenWarning(true);
    };

    const handleCreateProduct = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess(false);

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

      // Call the service to create or update products
      try {
        const { data, error } = await createOrUpdateProductService(formData);

        if (error) {
            setError([error || 'An error occurred while creating products, please try again.']);
        } else if (data) {
            setSuccess(true);
            setProducts([emptyForm]);
            setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error creating products:', error);
        setError([error || 'An error occurred while creating products, please try again.']);
      } finally {
        setOpenWarning(false);
        setLoading(false);
      }

    };

  if (loading) {
    return <Spinner />;
  }

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
                    handleCreateProduct={handleOpenWarning}
                    error={error}
                    companyDetails={companyDetails}
                  />
              </div>
              <div className='max-h-[90%] overflow-y-auto scrollbar-thin w-1/5'>
                  <CreateProductSidePreview 
                    products={products}
                    selectedProduct={selectedProduct}
                    materials={materials}
                    taxBands={taxBands}
                    companyDetails={companyDetails}
                  />
              </div>
            </div>
        <div className=''><PageDescription pageDescription={pageDescription}/></div>
      </div>
    </div>

    {/* Warning Modal */}
    {openWarning && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
        <WarningModal
          title={'Create Products'}
          message={`Are you sure you want to create ${products.length} product${products.length > 1 ? 's' : ''}?`}
          subText={`Please ensure all details are correct before proceeding.`}
          button1Style={`bg-primary text-white hover:bg-primary-hover`}
          button2Style={`bg-error text-white hover:bg-error-hover`}
          button1Text={`Yes, Create`}
          button2Text={`Cancel`}
          onClose={() => setOpenWarning(false)}
          onClick={handleCreateProduct}
          loading={loading}
          loadingText={`Creating Products...`}
        />
      </div>
    )}

    {/* Success Modal */}
    {success && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
        <SuccessModal
          message={`Product${products.length > 1 ? 's' : ''} created successfully!`}
          subText={`You can view these products in the Products section.`}
          title={'Success'}
          buttonStyle={`bg-brand-blue text-white hover:bg-blue-shadow4`}
          onClose={()=>{
            setSuccess(false);
            setError([]);
            setOpenWarning(false);
          }}
          buttonText={`OK`}
        />
      </div>
    )}
  </div>
  )
}

export default CreateProducts;