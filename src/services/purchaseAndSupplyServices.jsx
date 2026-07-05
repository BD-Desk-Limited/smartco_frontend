'use client';

import { fetchSuppliersData } from './sampleData';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

export const fetchSuppliersByCompanyIdService = async (searchTerm) => {
  const token = getToken();
  try {
    /*const response = await fetch(
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
    );*/

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
    return { error: 'error fetching suppliers, please try again' };
  }
};
