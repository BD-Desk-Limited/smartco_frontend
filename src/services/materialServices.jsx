'use client';
const token = sessionStorage.getItem('token');

//create material categories
export const createMaterialCategories = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/create-category`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error creating material categories, please try again' };
  }
};

//get material categories
export const getMaterialCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/categories`,
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
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error getting material categories, please try again' };
  }
};

//create material units
export const createMaterialUnits = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/create-unit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error creating material units, please try again' };
  }
};

//get material units
export const getMaterialUnits = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/units`,
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
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error getting material units, please try again' };
  }
};

//create material
export const createMaterial = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log('responseData', responseData);
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error creating material, please try again' };
  }
};

//get materials (non-grouped and not deleted)
export const getMaterials = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials`,
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
    return { error: 'error getting materials, please try again' };
  }
};

//get material by id
export const getMaterialById = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
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
    return { error: 'error getting material, please try again' };
  }
};  

//get materials (grouped and ungrouped)
export const getAllMaterials = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/grouped-and-ungrouped`,
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
    return { error: 'error getting materials, please try again' };
  }
};

//update material
export const updateMaterial = async (id, body, file) => {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(body));

    if (file) {
      formData.append('file', file);
    }
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error updating material, please try again' };
  }
};

//delete materials (only allowed if stock is 0)
export const deleteMaterials = async (material_ids) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ material_ids }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error deleting material, please try again' };
  }
};

//Add a new batch to a material
export const addBatchToMaterial = async (materialId, body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${materialId}/batches`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error adding batch, please try again' };
  }
};

//Get all batches of a material
export const getMaterialBatches = async (materialId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${materialId}/batches`,
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
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error getting material batches, please try again' };
  }
};

//Update a batch of a material
export const updateMaterialBatch = async (materialId, batchId, body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${materialId}/batches/${batchId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error updating material batch, please try again' };
  }
};

//Delete a batch of a material
export const deleteMaterialBatch = async (materialId, batchId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${materialId}/batches/${batchId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error deleting material batch, please try again' };
  }
};