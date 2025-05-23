'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//create branch
export const createBranchService = async (branchData) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/branches`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(branchData),
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
    return { error: 'error creating branch, please try again' };
  }
};

//get all branches by company id
export const getAllBranchesByCompanyId = async () => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/branches`,
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
    return { error: 'error fetching branches, please try again' };
  }
};

//activate or deactivate branch
export const toggleBranchStatus = async (branchIds, status) => {
    const token = getToken();
    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branches/status`,
            {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                branchIds,
                status,
                }),
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
        return { error: 'error toggling branch status, please try again' };
    }
}


//delete branches by id
export const deleteBranchesById = async (branchIds) => {
    const token = getToken();
    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branches`,
            {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                branchIds,
                }),
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
        return { error: 'error deleting branches, please try again' };
    }
};

//get branch by id
export const getBranchById = async (branchId) => {
  const token = getToken();
  try {
    const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/branches/${branchId}`,
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
  }catch (error) {
      console.error('Error:', error);
      return { error: 'error fetching branch, please try again' };
  }
};

//get all users by branch id
export const getAllUsersByBranchId = async (branchId) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/branches/users/${branchId}`,
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
      console.log('Response data:', responseData.data);
      return { data: responseData.data };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error fetching users, please try again' };
  }
};

//get all branch bands by company id
export const getAllBranchBandsByCompanyId = async (companyId) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/branches/bands/${companyId}`,
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
    return { error: 'error fetching bands, please try again' };
  }
};

//get all taxbands by company id
export const getAllTaxBandsByCompanyId = async () => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tax-bands`,
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
    return { error: 'error fetching tax bands, please try again' };
  }
};

//edit branch by id
export const editBranchById = async (branchId, branchData) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/branches/${branchId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(branchData),
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
    return { error: 'error editing branch, please try again' };
  }
};

//create tax band
export const createTaxBand = async (taxBandData) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tax-bands`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taxBandData),
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
    return { error: 'error creating tax band, please try again' };
  }
};