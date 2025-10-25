'use client';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

// Check if admin has completed required setup steps
export const checkCompanySetupCompletionService = async () => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/setups/company`,
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
      return { error: errorData.message };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'Error checking setup completion' };
  }
};