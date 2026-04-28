'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//Endpoint for fetching scheduled orders for today by branch ID
export const getOrdersForTodayByBranchIdService = async (branchId) => {
  console.log('Fetching scheduled orders for today for branch:', branchId);
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/scheduled/${branchId}
      `,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data || [] };
    }

    let errorMessage =
      'error fetching scheduled orders for today for branch, please try again';
    if (typeof response.json === 'function') {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    }

    return { error: errorMessage };
  } catch (error) {
    console.error('Error:', error);
    return {
      error: 'error fetching scheduled orders for today, please try again',
    };
  }
};
