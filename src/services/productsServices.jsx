'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//get all products not deleted by company id
export const getAllProductsByCompanyIdService = async () => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error fetching products, please try again' };
  }
};

//deactivate product
export const enableOrDisableProductService = async (productIds, status) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_ids: productIds,
          status: status,
        }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error updating product status, please try again' };
  }
};

//delete product(s)
export const deleteProductsService = async (product_ids) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_ids }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log('Delete Response Data:', responseData);
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error deleting products, please try again' };
  }
};

//get product by id
export const getProductByIdService = async (productId) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error fetching product, please try again' };
  }
};

//create or update product
export const createOrUpdateProductService = async (productData) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: productData._id ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error saving product, please try again' };
  }
};

//get all product categories by company id
export const getAllProductCategoriesByCompanyIdService = async () => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/categories`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error fetching product categories, please try again' };
  }
};

// update product availability in specified branches by product id
export const updateProductAvailabilityInBranchesService = async (
  productId,
  branchIds,
  action
) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/availability`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, branchIds, action }),
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error updating product availability, please try again' };
  }
};

// activate product in all branches by product id
export const activateProductInAllBranchesService = async (productId) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/availability/make-all-available`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      error: 'error activating product in all branches, please try again',
    };
  }
};

// deactivate product in all branches by product id
export const deactivateProductInAllBranchesService = async (productId) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/availability/make-all-unavailable`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      error: 'error deactivating product in all branches, please try again',
    };
  }
};

//TODO: fetch products by branchId to be used in sales point
import { sampleProducts } from '@/services/sampleData';
export const getProductsByBranchIdService = async (branchId) => {
  console.log('Fetching products for branch:', branchId);
  const token = getToken();
  try {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/branch/${branchId}`,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
    );*/

    //placeholder response until API is ready
    const response = {
      ok: true,
      data: new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleProducts);
        }, 2000);
      }),
    };

    if (response.ok) {
      const responseData = await response.data;
      return { data: responseData };
    }

    let errorMessage = 'error fetching products for branch, please try again';
    if (typeof response.json === 'function') {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    }

    return { error: errorMessage };
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error fetching products for branch, please try again' };
  }
};
