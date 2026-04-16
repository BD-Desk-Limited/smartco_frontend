'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//create or update sales transactions
export const recordTransactionsService = async (transactionsData) => {
  const token = getToken();

  try {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionsData),
      }
    );*/

    //simulate api call with a delay response and return the sent data as response
    const response = await new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          ok: true,
          json: async () => ({ data: transactionsData }),
          message: 'Transactions recorded successfully...',

          //error sample response
          //ok: false,
          //json: async () => ({ message: 'Failed to record transactions' }),
        });
      }, 1000)
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
    return { error: 'error recording transactions, please try again' };
  }
};
