/* Working from here next time*/
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/admin/SubHeader';
import React from 'react';
import ProductManagementSidebar from '../ProductManagementSidebar';
import PageDescription from '@/components/account/PageDescription';
import { useAuth } from '@/contexts/authContext';
import { getAllBranchBandsByCompanyId } from '@/services/branchServices';
import { getAllTaxBandsByCompanyId } from '@/services/taxBandServices';
import {
  createOrUpdateProductService,
  getAllProductCategoriesByCompanyIdService,
  getProductByIdService,
} from '@/services/productsServices';
import { getAllMaterials } from '@/services/materialServices';
import { verifyInputText } from '@/utilities/verifyInput';
import Spinner from '@/components/account/Spinner';
import SuccessModal from '@/components/account/SuccessModal';
import WarningModal from '@/components/account/WarningModal';
import { getCompanyDetails } from '@/services/companyServices';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SetPrices from '../create-products/SetPrices';
import SelectComponents from '../create-products/SelectComponents';
import ProductSidePreview from '../create-products/ProductSidePreview';

const EditableProductDetails = ({ pageDescription }) => {
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

  const [openPriceOverlay, setOpenPriceOverlay] = React.useState(false);
  const [openComponentsOverlay, setOpenComponentsOverlay] =
    React.useState(false);
  const [showSelectComponents, setShowSelectComponents] = React.useState({});
  const [visibleTab, setVisibleTab] = React.useState('Components and pricing');

  const selectedSubMenu = {
    name: 'View All Products',
    link: '/',
  };
  const tabs = ['Components and pricing', 'Tax details'];

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
            pricing: (p.pricing || []).map((band) => ({
              band: band.band,
              price: band.price,
            })),
            productTax: (p.productTax || []).map((tax) => ({
              isTaxExcluded: tax.isTaxExcluded || false,
              taxBand: tax?.taxBand?._id,
              taxPercentage: tax?.taxDetails.taxPercentage || 0,
              additionalTaxAmount: tax?.taxDetails.additionalTaxAmount || 0,
              effectiveDate: tax?.taxDetails.effectiveDate || new Date(),
            })),
            components: (p.components || []).map((comp) => ({
              categoryName: comp?.categoryName || '',
              materialChoices: (comp.materialChoices || []).map((choice) => ({
                material: choice?.material?._id,
                quantity: choice?.quantity || 0,
                additionalPrice: (choice?.additionalPrice || []).map((add) => ({
                  band: add.band,
                  price: add.price || 0,
                })),
              })),
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

  // adapters for child components (they expect products[])
  const products = product ? [product] : [];

  const setProducts = React.useCallback((updater) => {
    setProduct((prevProduct) => {
      if (!prevProduct) return prevProduct;

      if (typeof updater === 'function') {
        const next = updater([prevProduct]);
        if (next && next[0]) {
          if (JSON.stringify(next[0]) !== JSON.stringify(prevProduct)) {
            return { ...next[0] };
          }
        }
        return prevProduct;
      } else if (Array.isArray(updater)) {
        if (updater[0]) {
          if (JSON.stringify(updater[0]) !== JSON.stringify(prevProduct)) {
            return { ...updater[0] };
          }
        }
        return prevProduct;
      }

      return prevProduct;
    });
  }, []);
  const productIndex = 0;

  // Handle image upload
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImage = { file, url: imageUrl };
      setProduct((prev) => ({
        ...prev,
        image: newImage,
      }));
    }
  };

  // Remove image function
  const removeImage = () => {
    setProduct((prev) => ({
      ...prev,
      image: null,
    }));
  };

  // Validation then open warning
  const handleOpenWarning = () => {
    if (!product) return;
    setLoading(true);

    if (!product.name) {
      setError(['Product name is required.']);
      setLoading(false);
      return;
    }
    const validName = verifyInputText(product.name);
    if (!validName.passed) {
      setError([validName.message]);
      setLoading(false);
      return;
    }

    if (!product.description) {
      setError(['Product description is required.']);
      setLoading(false);
      return;
    }
    const validDescription = verifyInputText(product.description);
    if (!validDescription.passed) {
      setError([validDescription.message]);
      setLoading(false);
      return;
    }

    if (!product.category || product.category.trim() === '') {
      setError(['Product category is required.']);
      setLoading(false);
      return;
    }

    if (
      !product.components ||
      !product.components.every((c) => c.materialChoices.length > 0)
    ) {
      setError(['At least one component with material choices is required.']);
      setLoading(false);
      return;
    }

    if (
      !product.components.every((c) =>
        c.materialChoices.every((m) => m.quantity && m.quantity > 0)
      )
    ) {
      setError([
        'All material choices must have a quantity greater than zero.',
      ]);
      setLoading(false);
      return;
    }

    for (const key in bandsError) {
      if (bandsError[key]) {
        setError(['Please resolve price/tax band errors before updating.']);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setOpenWarning(true);
  };

  const handleUpdateProduct = async () => {
    setLoading(true);
    setError([]);
    setSuccess(false);
    try {
      const formattedProducts = [
        {
          _id: product._id,
          name: product.name,
          description: product.description || '',
          category: product.category,

          //Format components.
          components: (product.components || []).map((comp) => ({
            categoryName: comp.categoryName || '',
            isOptional: comp.isOptional || false,
            materialChoices: (comp.materialChoices || []).map((mc) => ({
              material: mc.material,
              quantity: mc.quantity || 1,
              additionalPrice: (mc.additionalPrice || []).map((ap) => ({
                band: ap.band,
                price: Number(ap.price) || 0,
                effectiveDate: ap.effectiveDate || new Date().toISOString(),
              })),
            })),
          })),

          // Format pricing
          pricing: (product.pricing || []).map((p) => ({
            band: p.band,
            price: Number(p.price) || 0,
            effectiveDate: p.effectiveDate || new Date().toISOString(),
          })),

          // productTax formatted to backend expected
          productTax: (product.productTax || []).map((tax) => ({
            taxBand: tax.taxBand,
            isTaxExcluded: tax.isTaxExcluded ?? false,
            taxDetails: [
              {
                taxPercentage: Number(tax.taxPercentage) || 0,
                additionalTaxAmount: Number(tax.additionalTaxAmount) || 0,
                effectiveDate: tax.effectiveDate || new Date().toISOString(),
              },
            ],
          })),
        },
      ];

      const formData = new FormData();
      formData.append('products', JSON.stringify(formattedProducts));

      if (product.image && product.image.file) {
        formData.append(product.name, product.image.file);
      }

      const { data, error: svcError } =
        await createOrUpdateProductService(formData);
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

  const switchTab = (tab) => {
    setVisibleTab(tab);
  };

  if (!product) return <Spinner />;

  return (
    <div className="relative bg-background-1">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Edit Product'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute top-0 z-20">
          <ProductManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="h-full flex flex-col gap-3 min-h-[70vh] max-h-[80vh] overflow-y-auto no-scrollbar">
            <div className="p-1 h-full flex flex-col gap-2 min-h-[70vh] max-h-[80vh] overflow-y-auto no-scrollbar relative">
              {/* Header Section (name + actions) */}
              <div className="bg-text-white py-1 px-5 sticky top-0 z-10 w-full flex flex-row items-center justify-between mb-2">
                <h3 className="flex flex-row items-center gap-4">
                  <span className="text-lg font-semibold flex flex-col mx-5">
                    <span className="ml-2">
                      {product?.name
                        ? product.name[0]?.toUpperCase() + product.name.slice(1)
                        : 'Unnamed Product'}
                    </span>
                    <span className="text-xs text-text-gray py-1 ml-3">
                      ID: {product?._id}
                    </span>
                  </span>
                </h3>

                {/* Error notice (inline) */}
                {error && error.length > 0 && (
                  <div className=" animate-bounce bg-error bg-opacity-20 border border-error text-error p-3 rounded-lg z-50">
                    {error.map((e, idx) => (
                      <p className="text-sm" key={idx}>
                        {e}
                      </p>
                    ))}
                  </div>
                )}

                <ul className="flex flex-row gap-3 list-none">
                  <li>
                    <button
                      onClick={handleOpenWarning}
                      className="border border-brand-blue text-text-gray p-1 rounded-lg flex flex-row items-center gap-1 hover:bg-brand-blue hover:text-text-white transition"
                    >
                      <Image
                        src={`/assets/edit.png`}
                        alt={`Save`}
                        width={16}
                        height={16}
                      />
                      Save Changes
                    </button>
                  </li>
                </ul>
              </div>

              <div className="flex flex-row w-full px-5 gap-5">
                {/* Left: Image, Category, Description */}
                <div className="w-1/5 gap-5 flex flex-col">
                  <div className="bg-white shadow-lg p-2 rounded-lg flex flex-col gap-2">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span
                        className={`${product?.image ? 'bg-gray-shadow8 p-5' : 'bg-gray-200 p-5'} rounded-full flex items-center justify-center`}
                      >
                        <Image
                          src={
                            product?.image
                              ? product.image.url
                              : '/assets/shopping.png'
                          }
                          alt={product?.name || 'Product Image'}
                          className="w-24 h-24 object-cover rounded-full"
                          width={96}
                          height={96}
                        />
                      </span>

                      {/* Image upload input */}
                      <div className="flex flex-col gap-1 w-full">
                        <label
                          htmlFor="image-upload"
                          className="text-sm bg-brand-blue text-white px-3 py-1 rounded cursor-pointer text-center hover:bg-blue-700"
                        >
                          {product?.image ? 'Change Image' : 'Upload Image'}
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAddImage}
                          className="hidden"
                        />
                        {product?.image && (
                          <button
                            onClick={removeImage}
                            className="text-sm bg-error text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Name */}
                    <div className="flex flex-col">
                      <label className="text-sm text-text-gray">Name</label>
                      <input
                        value={product.name || ''}
                        onChange={(e) =>
                          setProduct((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="border border-gray-border rounded-md p-2 text-sm"
                      />
                    </div>
                    {/* Category */}
                    <div className="flex flex-col">
                      <label className="text-sm text-text-gray">Category</label>
                      <select
                        value={product.category || ''}
                        onChange={(e) =>
                          setProduct((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="border border-gray-border rounded-md p-2 text-sm"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {productCategories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Description */}
                    <div className="flex flex-col">
                      <label className="text-sm text-text-gray">
                        Description
                      </label>
                      <textarea
                        value={product.description || ''}
                        onChange={(e) =>
                          setProduct((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="border border-gray-border rounded-md p-2 text-sm h-24"
                      />
                    </div>
                  </div>
                </div>

                {/* Center: Components, Prices & Tax with edit overlays */}
                <div className="w-3/5 bg-white rounded-lg shadow-lg p-3 text-sm">
                  <div className="flex flex-row items-center justify-between mb-2">
                    <h4 className="font-semibold text-brand-green">
                      {tabs.map((tab, idx) => (
                        <span
                          key={idx}
                          onClick={() => switchTab(tab)}
                          className={`cursor-pointer mr-4 ${tab === visibleTab ? 'border-b-2 border-brand-green pb-1' : ''}`}
                        >
                          {tab}
                        </span>
                      ))}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOpenComponentsOverlay(true)}
                        className="text-sm border border-brand-blue text-brand-blue px-2 py-1 rounded hover:bg-brand-blue hover:text-white"
                      >
                        Edit Components
                      </button>
                      <button
                        onClick={() => setOpenPriceOverlay(true)}
                        className="text-sm border border-brand-blue text-brand-blue px-2 py-1 rounded hover:bg-brand-blue hover:text-white"
                      >
                        Edit Price & Tax
                      </button>
                    </div>
                  </div>
                  {/* Summary tables like in view */}
                  {visibleTab === 'Components and pricing' && (
                    <>
                      <div className="mb-3">
                        <p className="font-semibold">Base prices by bands</p>
                        {product?.pricing?.length > 0 ? (
                          <table className="w-full mb-2">
                            <thead>
                              <tr className="bg-background-2 border-y border-y-gray-border">
                                <th className="p-1 text-left">Price Band</th>
                                <th className="p-1 text-left">Base Price</th>
                              </tr>
                            </thead>
                            <tbody className="border-b">
                              {product.pricing.map((band, i) => (
                                <tr key={i}>
                                  <td className="p-1">{band.band}</td>
                                  <td className="p-1">
                                    {companyDetails?.currency?.symbol || '$'}
                                    {Number(band.price || 0).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-text-gray">No price bands yet.</p>
                        )}
                      </div>
                      <div>
                        <h5 className="font-semibold">Components summary</h5>
                        {product?.components?.length > 0 ? (
                          product.components.map((comp, idx) => (
                            <div key={idx} className="border rounded p-2 my-1">
                              <div className="flex justify-between">
                                <span>
                                  {comp.categoryName || 'Unnamed Category'}
                                </span>
                                <span className="text-text-gray">
                                  Alternatives:{' '}
                                  {comp.materialChoices?.length || 0}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-text-gray">No components yet.</p>
                        )}
                      </div>
                    </>
                  )}

                  {visibleTab === 'Tax details' && (
                    <div>
                      <p className="font-semibold mb-2">Tax Bands Applied</p>
                      {product?.productTax?.length > 0 ? (
                        <table className="w-full mb-2">
                          <thead>
                            <tr className="bg-background-2 border-y border-y-gray-border">
                              <th className="p-1 text-left">Tax Band</th>
                              <th className="p-1 text-left">Tax Percentage</th>
                              <th className="p-1 text-left">
                                Additional Tax Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="border-b">
                            {product.productTax.map((tax, i) =>
                              tax.isTaxExcluded ? (
                                <tr key={i}>
                                  <td className="p-1">
                                    {taxBands.find(
                                      (tb) => tb._id === tax.taxBand
                                    )?.name || 'Unknown Tax Band'}{' '}
                                  </td>
                                  <td
                                    className="p-1 text-center italic"
                                    colSpan={3}
                                  >
                                    Tax Excluded
                                  </td>
                                </tr>
                              ) : (
                                <tr key={i}>
                                  <td className="p-1">
                                    {taxBands.find(
                                      (tb) => tb._id === tax.taxBand
                                    )?.name || 'Unknown Tax Band'}
                                  </td>
                                  <td className="p-1">{tax.taxPercentage}%</td>
                                  <td className="p-1">
                                    {companyDetails?.currency?.symbol || '$'}
                                    {Number(
                                      tax.additionalTaxAmount || 0
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-text-gray">
                          No tax bands applied yet.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Overlays */}
                  {openComponentsOverlay && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                      <div className="bg-brand-blue rounded-md shadow-lg w-[50vw] max-h-[85vh] overflow-y-auto p-2">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setOpenComponentsOverlay(false)}
                            className="bg-error text-white px-2 rounded"
                          >
                            Close
                          </button>
                        </div>
                        <SelectComponents
                          products={products}
                          setProducts={setProducts}
                          productIndex={productIndex}
                          materials={materials}
                          setMaterials={setMaterials}
                          bands={bands}
                          showSelectComponents={showSelectComponents}
                          setShowSelectComponents={setShowSelectComponents}
                          closeComponentsDropdown={() =>
                            setOpenComponentsOverlay(false)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {openPriceOverlay && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                      <div className="bg-brand-blue rounded-md shadow-lg w-[40vw] max-h-[85vh] overflow-y-auto p-2">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setOpenPriceOverlay(false)}
                            className="bg-error text-white px-2 rounded"
                          >
                            Close
                          </button>
                        </div>
                        <SetPrices
                          products={products}
                          setProducts={setProducts}
                          productIndex={productIndex}
                          bands={bands}
                          taxBands={taxBands}
                          bandsError={bandsError}
                          setBandsError={setBandsError}
                          companyDetails={companyDetails}
                          closePriceDropdown={() => setOpenPriceOverlay(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: simple summary */}
                <ProductSidePreview
                  selectedProduct={product}
                  taxBands={taxBands}
                  materials={materials}
                  companyDetails={companyDetails}
                />
              </div>
            </div>
            <div>
              <PageDescription pageDescription={pageDescription} />
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {openWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <SuccessModal
            message={'Product updated successfully!'}
            subText={'Your changes have been saved.'}
            title={'Success'}
            buttonStyle={'bg-brand-blue text-white hover:bg-blue-shadow4'}
            onClose={() => {
              setSuccess(false);
              setError([]);
              setOpenWarning(false);
              router.push('/pages/account/admin/product-management');
            }}
            buttonText={'OK'}
          />
        </div>
      )}
    </div>
  );
};

export default EditableProductDetails;
