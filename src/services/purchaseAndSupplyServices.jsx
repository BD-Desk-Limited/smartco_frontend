'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

export const fetchSuppliersByCompanyIdService = async (searchParams) => {
  const token = getToken();
  const params = new URLSearchParams(searchParams);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/suppliers/search?${params}`,
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
    return { error: 'error fetching suppliers, please try again' };
  }
};

export const savePurchaseRecordService = async (purchaseRecord) => {
  // TODO: Uncomment the fetch request below and remove the console.log when the API is ready
  console.log(purchaseRecord);
  const sampleErrorResponse = {
    error: 'error saving purchase record, please try again later',
  };
  const sampleSuccessResponse = {
    data: {
      message: 'Purchase record saved successfully',
    },
  };
  return sampleSuccessResponse;
};
