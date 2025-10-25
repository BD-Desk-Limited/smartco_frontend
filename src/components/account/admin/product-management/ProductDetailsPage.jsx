'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import ViewProductDetails from './components/view-product-details/ViewProductDetails';
import AdminSideBar from '../AdminSideBar';
import { getProductByIdService } from '@/services/productsServices';
import { getAllBranchesByCompanyId } from '@/services/branchServices';

const ProductDetailsPage = () => {

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [productData, setProductData] = React.useState({});
  const [branches, setBranches] = React.useState([]);

  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Products',
    icon: '/assets/product.png',
    iconActive: '/assets/product_active.png',
    link: '/product-management',
    title: 'Product Management',
    requiredAccess: 'Product_Management',
  });
  const pageDescription =
    'The Product Details page provides a comprehensive overview of a product, including its name, category, tax information, prices across branch bands, stock status, and other relevant details. It also displays the product\'s components and any available alternatives for components that have options. Use this page to review all attributes and settings associated with the product, ensuring accurate management and visibility throughout your organization.';
  

  React.useEffect(() => {
    // Fetch product data by id
    if (id) {
      const fetchProductData = async () => {
        const response = await getProductByIdService(id);
        if (response.data) {
          setProductData(response.data);
        } 
        if (response.error) {
          console.error('Error fetching product data:', response.error);
          router.push('/pages/account/admin/product-management');
        };
      }
      fetchProductData();
    };
  }, [id, router]);

  //get all branches by company id
  React.useEffect(() => {
    if (id){
      const fetchBranches = async () => {
        const response = await getAllBranchesByCompanyId();
        if (response.data) {
          setBranches(response.data);
        }
        if (response.error) {
          console.error('Error fetching branches:', response.error);
        };
      }
      fetchBranches();
    }
  }, [id]);

  React.useEffect(() => {
    if (!id) {
      router.push('/pages/account/admin/product-management');
    };
  }, [id, router]);

      
  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Products_Management',
  );  
  if (accessCheckFailed) {
    return accessCheckFailed;
  };

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-[100vh] overflow-hidden no-scrollbar">
      <div className='h-full'>
        <AdminSideBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
      <div className="w-full h-full overflow-y-auto no-scrollbar">
        <ViewProductDetails
          pageDescription={pageDescription}
          productData={productData}
          setProductData={setProductData}
          branches={branches}
          setBranches={setBranches}
        />
      </div>
    </div>
  );
}

export default ProductDetailsPage;