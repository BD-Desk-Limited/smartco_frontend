'use client';
import React, { createContext, useState, useContext } from 'react';

//create a context for bulk material upload

const bulkMaterialUploadContext = createContext(null);

export const BulkMaterialUploadProvider = ({ children }) => {
  const [bulkMaterialData, setBulkMaterialData] = useState(null);

  console.log(bulkMaterialData);

  return (
    <bulkMaterialUploadContext.Provider value={{ bulkMaterialData, setBulkMaterialData }}>
      {children}
    </bulkMaterialUploadContext.Provider>
  );
}

// Custom hook to use the bulkMaterialUploadContext
export const useBulkMaterialUpload = () => {
  return useContext(bulkMaterialUploadContext);
};

