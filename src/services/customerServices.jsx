'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//Get customer by customerNumber, email, or phone
export const getCustomerByCustomerNumberEmailOrPhoneService = async (
  customerNumberOrEmailOrPhone
) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customers/${customerNumberOrEmailOrPhone}`,
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
    return { error: 'error fetching customer, please try again' };
  }
};

//Register new customer
export const registerNewCustomerService = async (customerData) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customers/${customerData.branch._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customerData),
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
    return { error: 'error registering customer, please try again' };
  }
};

// Self-register new customer using registration token
export const selfRegisterationCustomerService = async (customerData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customers/self-register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
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
    return { error: 'error registering customer, please try again' };
  }
};

//Validate customer registration token for self-registration flow
export const validateCustomerSelfRegistrationTokenService = async (
  registrationToken
) => {
  const token = getToken();
  try {
    console.log('Validating registration token:', registrationToken);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customers/validate-registration-token/${registrationToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
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
