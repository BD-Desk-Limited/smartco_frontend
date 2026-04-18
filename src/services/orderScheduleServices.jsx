'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

// TODO: Endpoint for fetching scheduled orders for today by branch ID
import { sampleScheduledOrderForToday } from './sampleData';
export const getOrdersForTodayByBranchIdService = async (branchId) => {
  console.log('Fetching scheduled orders for today for branch:', branchId);
  const token = getToken();
  try {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/scheduled-today/branch/${branchId}`,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
    );*/

    //placeholder response until API is ready
    const response = {
      ok: true,
      data: new Promise((resolve) => {
        setTimeout(() => {
          resolve([sampleScheduledOrderForToday[0]] || []);
        }, 2000);
      }),
    };

    if (response.ok) {
      const responseData = await response.data;
      return { data: responseData };
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

// TODO: Endpoint for checking order status by branch ID to determine if scheduled orders for today has already been fulfilled or not.
export const checkOrderStatusService = async (orderId) => {
  console.log('Fetching scheduled orders for today for order:', orderId);
  const token = getToken();
  try {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/scheduled-today/order/${orderId}`,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
    );*/

    //placeholder response until API is ready
    const response = {
      /*ok: true,
      data: new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 'pending' }); // Return an empty object or mock order status data as needed
        }, 2000);
      }),*/

      //simulating a response for an order that has already been fulfilled
      ok: true,
      data: new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 'fulfilled' }); // Return an empty object or mock order status data as needed
        }, 2000);
      }),
    };

    if (response.ok) {
      const responseData = await response.data;
      return { data: responseData };
    }

    let errorMessage =
      'error fetching scheduled orders for today, please try again';
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
