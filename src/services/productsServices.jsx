'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

//get all products not deleted by company id
export const getAllProductsByCompanyIdService = async () => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
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
    return { error: 'error fetching products, please try again' };
  }
};

//deactivate product
export const enableOrDisableProductService = async (productIds, status) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          productIds: productIds,
          status: status,
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
    return { error: 'error updating product status, please try again' };
  }
};

//delete product(s)
export const deleteProductsService = async (productIds) => {
    const token = getToken();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productIds }),
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
        return { error: 'error deleting products, please try again' };
    }
};

//get product by id
export const getProductByIdService = async (productId) => {
    const token = getToken();
    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
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
        return { error: 'error fetching product, please try again' };
    }
};

//create or update product
export const createOrUpdateProductService = async (productData) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: productData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
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
    return { error: 'error saving product, please try again' };
  }
};

