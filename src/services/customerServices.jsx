'use client';

import { fetchCustomerData } from './sampleData';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//TODO: get customer by id, email, or phone
export const getCustomerByIdEmailOrPhoneService = async (
  customerIdOrEmailOrPhone
) => {
  const token = getToken();
  try {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customers/${customerIdOrEmailOrPhone}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );*/

    // Mock response for testing
    const response = {
      ok: true,
      json: async () => await fetchCustomerData(customerIdOrEmailOrPhone),
    };

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
    return { error: 'error fetching customer, please try again' };
  }
};

//TODO: create or update customer
export const registerNewCustomerService = async (customerData) => {
  const token = getToken();

  try {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customerData),
      }
    );*/

    // Mock response for testing
    const response = await new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          ok: true,
          json: async () => ({
            data: {
              _id: 'mockCustomerId123',
              customerNumber: 'CUST-003',
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
            },
          }),

          // Uncomment below to simulate an error response
          /*ok: false,
          json: async () => ({
            message: 'Failed to register customer. Please try again now.',
          }),*/
        });
      }, 1000)
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log('Registered new customer:', responseData);
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error registering customer, please try again' };
  }
};

//TODO: Validate customer registration token for self-registration flow
export const validateCustomerRegistrationTokenService = async (
  registrationToken,
  orderId
) => {
  const token = getToken();
  try {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/validate-registration?token=${registrationToken}&orderId=${orderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );*/

    // Mock response for testing
    const response = await new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          ok: true,
          json: async () => ({
            valid: true,
          }),

          // Uncomment below to simulate an invalid token response
          /*ok: false,
          json: async () => ({
            valid: false,
            message:
              'Invalid or expired registration link, Looks like the link has expired.',
          }),

          // Uncomment below to simulate an error response
          /*ok: false,
          json: async () => ({  
            valid: false,
            message: 'Failed to validate registration token. Please try again now.',
          }),*/
        });
      }, 1000)
    );

    if (response.ok) {
      const data = await response.json();
      return { data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error validating registration token, please try again' };
  }
};
