import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import React from 'react';
import ProductManagementSidebar from '../ProductManagementSidebar';
import PageDescription from '@/components/account/PageDescription';
import EditProductForm from './EditProductForm';
import { useAuth } from '@/contexts/authContext';
import { getAllBranchBandsByCompanyId, getAllTaxBandsByCompanyId } from '@/services/branchServices';
import { createOrUpdateProductService, getAllProductCategoriesByCompanyIdService, getProductByIdService } from '@/services/productsServices';
import { getAllMaterials } from '@/services/materialServices';
import { verifyInputText } from '@/utilities/verifyInput';
import Spinner from '@/components/account/Spinner';
import SuccessModal from '@/components/account/SuccessModal';
import WarningModal from '@/components/account/WarningModal';
import { getCompanyDetails } from '@/services/companyServices';
import { useRouter, useSearchParams } from 'next/navigation';

const EditProduct = ({ pageDescription }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [productCategories, setProductCategories] = React.useState([]);
  const [product, setProduct] = React.useState(null);
  const { user } = useAuth();
  const [bands, setBands] = React.useState([]);
  const [taxBands, setTaxBands] = React.useState([]);
  const [bandsError, setBandsError] = React.useState({});
  const [materials, setMaterials] = React.useState([]);
  const [error, setError] = React.useState([]);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [companyDetails, setCompanyDetails] = React.useState(null);

  const selectedSubMenu = {
    name: 'Edit Product',
    link: '/edit-product',
  };

  // Fetch product details
  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        router.push('/pages/account/admin/product-management');
        return;
      }
      setLoading(true);
      try {
        const response = await getProductByIdService(id);
        if (response.error) {
          console.error('Error fetching product', response.error);
          router.push('/pages/account/admin/product-management');
          return;
        }
        if (response.data) {
          const p = response.data;
          setProduct({
            _id: p._id,
            name: p.name || '',
            description: p.description || '',
            category: p?.category?.name || '',
            image: p.imageURL ? { file: null, url: p.imageURL } : null,
            pricing: (p.pricing || []).map(band => ({ band: band.band, price: band.price })),
            productTax: (p.productTax || []).map(tax => ({
              taxBand: tax?.taxBand?._id,
              taxPercentage: tax?.taxPercentage || 0,
              additionalTaxAmount: tax?.additionalTaxAmount || 0,
            })),
            components: (p.components || []).map(comp => ({
              categoryName: comp?.categoryName || '',
              materialChoices: (comp.materialChoices || []).map(choice => ({
                material: choice?.material?._id,
                quantity: choice?.quantity || 0,
                additionalPrice: (choice?.additionalPrice || []).map(add => ({ band: add.band, price: add.price || 0 }))
              }))
            })),
          });
        }
      } catch (e) {
        console.error('Unhandled error fetching product', e);
        router.push('/pages/account/admin/product-management');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  // Fetch materials
  React.useEffect(() => {
    const fetchMaterials = async () => {
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
    fetchMaterials();
  }, []);

  // Fetch categories
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

  // Fetch price bands
  React.useEffect(() => {
    const fetchBands = async () => {
      try {
        setLoading(true);
        const response = await getAllBranchBandsByCompanyId(user?.company);
        if (response.error) {
          setBandsError(response.error);
        }
        if (response?.data) {
          setBands(response.data);
        }
      } catch (error) {
        console.error('Error fetching price bands', error);
        setBandsError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBands();
  }, [user?.company]);

  // Fetch tax bands
  React.useEffect(() => {
    const fetchTaxBands = async () => {
      try {
        setLoading(true);
        const response = await getAllTaxBandsByCompanyId();
        if (response.error) {
          setBandsError(response.error);
        }
        if (response?.data) {
          setTaxBands(response.data);
        }
      } catch (error) {
        console.error('Error fetching tax bands', error);
        setBandsError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxBands();
  }, [user?.company]);

  // Fetch company details
  React.useEffect(() => {
    if (user && user.company) {
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
  }, [user]);

  // Validation then open warning
  const handleOpenWarning = () => {
    setLoading(true);
    if (!product) { setLoading(false); return; }

    if (!product.name) {
      setError(['Product name is required.']);
      setLoading(false); return;
    }
    const validName = verifyInputText(product.name);
    if (!validName.passed) {
      setError([validName.message]);
      setLoading(false); return;
    }
    if (!product.description) {
      setError(['Product description is required.']);
      setLoading(false); return;
    }
    const validDescription = verifyInputText(product.description);
    if (!validDescription.passed) {
      setError([validDescription.message]);
      setLoading(false); return;
    }
    if (!product.category || product.category.trim() === '') {
      setError(['Product category is required.']);
      setLoading(false); return;
    }
    if (!product.components || !product.components.every(c => c.materialChoices.length > 0)) {
      setError(['At least one component with material choices is required.']);
      setLoading(false); return;
    }
    if (!product.components.every(c => c.materialChoices.every(m => m.quantity && m.quantity > 0))) {
      setError(['All material choices must have a quantity greater than zero.']);
      setLoading(false); return;
    }
    for (const key in bandsError) {
      if (bandsError[key]) {
        setError(['Please resolve price/tax band errors before updating.']);
        setLoading(false); return;
      }
    }

    setLoading(false);
    setOpenWarning(true);
  };

  const handleUpdateProduct = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError([]);
    setSuccess(false);

    try {
      const formData = new FormData();
      const formattedProducts = [{
        _id: product._id,
        name: product.name,
        description: product.description || '',
        category: product.category,
        components: product.components,
        pricing: product.pricing,
        productTax: product.productTax || [],
      }];
      formData.append('products', JSON.stringify(formattedProducts));
      formData._id = product._id; // trigger PUT in service
      if (product.image && product.image.file) {
        formData.append(product.name, product.image.file);
      }
      const { data, error: svcError } = await createOrUpdateProductService(formData);
      if (svcError) {
        setError([svcError || 'Error updating product.']);
      } else if (data) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(['Error updating product, please try again.']);
    } finally {
      setOpenWarning(false);
      setLoading(false);
    }
  };

  if (loading && !product) return <Spinner />;
  if (!product) return <Spinner />;

  return (
    <div className='relative bg-background-1'>
      <div className="w-full sticky top-0 z-50"><Header /></div>
      <div className="w-full"><SubHeader title={'Edit Product'}/></div>
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
              <EditProductForm
                product={product}
                setProduct={setProduct}
                productCategories={productCategories}
                bands={bands}
                taxBands={taxBands}
                bandsError={bandsError}
                setBandsError={setBandsError}
                materials={materials}
                handleSubmit={handleOpenWarning}
                error={error}
                companyDetails={companyDetails}
              />
            </div>
            <div className='max-h-[90%] overflow-y-auto scrollbar-thin w-1/5'>
              {/* Side preview reused from create flow */}
              {/* We can show minimal preview */}
              <div className='bg-white rounded-lg p-3 shadow-md text-sm text-text-gray'>
                <span className='font-semibold text-brand-blue'>Preview</span>
                <div className='mt-2 flex flex-col gap-2'>
                  <span><strong>Name:</strong> {product.name || 'N/A'}</span>
                  <span><strong>Category:</strong> {product.category || 'N/A'}</span>
                  <span><strong>Components:</strong> {product.components?.length || 0}</span>
                  <span><strong>Price Bands:</strong> {product.pricing?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <div><PageDescription pageDescription={pageDescription}/></div>
        </div>
      </div>

      {/* Warning Modal */}
      {openWarning && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
          <WarningModal
            title={'Update Product'}
            message={'Are you sure you want to update this product?'}
            subText={'Please ensure all details are correct before proceeding.'}
            button1Style={'bg-primary text-white hover:bg-primary-hover'}
            button2Style={'bg-error text-white hover:bg-error-hover'}
            button1Text={'Yes, Update'}
            button2Text={'Cancel'}
            onClose={() => setOpenWarning(false)}
            onClick={handleUpdateProduct}
            loading={loading}
            loadingText={'Updating Product...'}
          />
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
          <SuccessModal
            message={'Product updated successfully!'}
            subText={'Your changes have been saved.'}
            title={'Success'}
            buttonStyle={'bg-brand-blue text-white hover:bg-blue-shadow4'}
            onClose={()=>{
              setSuccess(false); setError([]); setOpenWarning(false); router.push('/pages/account/admin/product-management');
            }}
            buttonText={'OK'}
          />
        </div>
      )}
    </div>
  );
};

export default EditProduct;
