'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//TODO: create or update sales transactions
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
          json: async () => ({
            data: {
              ...transactionsData,
              customerRegToken: transactionsData?.linkedCustomer
                ? null
                : 'http://localhost:3000/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-159959',
            },
          }),
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

//TODO: Send receipt through configured channels (email/whatsapp)
export const sendReceiptService = async ({
  transactionId,
  channel,
  recipient,
  receipt,
}) => {
  const token = getToken();

  try {
    if (process.env.NEXT_PUBLIC_API_URL) {
      /*const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/send-receipt`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId,
            channel,
            recipient,
            receipt,
          }),
        }
      );*/

      // Mock response when API URL is not configured yet.
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              data: {
                transactionId,
                channel,
                recipient,
                status: 'queued now',
              },
            }),
          });
        }, 800)
      );

      if (response.ok) {
        const responseData = await response.json();
        return { data: responseData?.data || responseData };
      }

      const errorData = await response.json();
      return {
        error:
          errorData?.message ||
          `Failed to send receipt via ${channel}. Please try again.`,
      };
    }

    const responseData = await mockResponse.json();
    return { data: responseData.data };
  } catch (error) {
    console.error('Error:', error);
    return {
      error: `Error sending receipt via ${channel}. Please try again.`,
    };
  }
};
