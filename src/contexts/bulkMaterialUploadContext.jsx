'use client';
import React, { createContext, useState, useContext } from 'react';

//create a context for bulk material upload

const bulkMaterialUploadContext = createContext(null);

export const BulkMaterialUploadProvider = ({ children }) => {
  const [bulkMaterialData, setBulkMaterialData] = useState(null);
  const [errorData, setErrorData] = useState([]);

  return (
    <bulkMaterialUploadContext.Provider value={{ bulkMaterialData, setBulkMaterialData, errorData, setErrorData }}>
      {children}
    </bulkMaterialUploadContext.Provider>
  );
}

// Custom hook to use the bulkMaterialUploadContext
export const useBulkMaterialUpload = () => {
  return useContext(bulkMaterialUploadContext);
};

