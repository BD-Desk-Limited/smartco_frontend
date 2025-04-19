'use client';
const token = sessionStorage.getItem('token');

//get all branches by company id
export const getAllBranchesByCompanyId = async () => {
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