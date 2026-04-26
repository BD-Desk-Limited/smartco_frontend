'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//Record sales transactions
export const recordTransactionsService = async (transactionsData) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionsData),
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
    return { error: 'error recording transactions, please try again' };
  }
};

//Send receipt through configured channels (email/whatsapp)
export const sendReceiptService = async ({
  transactionId,
  channel,
  recipient,
  receiptData,
}) => {
  const token = getToken();

  try {
    if (process.env.NEXT_PUBLIC_API_URL) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/receipts/send`,
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
            receiptData,
          }),
        }
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
