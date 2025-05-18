'use client';
import React, { createContext, useState, useContext } from 'react';

//create a context for bulk branch upload

const bulkbranchUploadContext = createContext(null);

export const BulkbranchUploadProvider = ({ children }) => {
  const [bulkbranchData, setBulkbranchData] = useState(null);
  const [errorData, setErrorData] = useState(null);

  return (
    <bulkbranchUploadContext.Provider value={{ bulkbranchData, setBulkbranchData, errorData, setErrorData }}>
      {children}
    </bulkbranchUploadContext.Provider>
  );
}

// Custom hook to use the bulkbranchUploadContext
export const useBulkbranchUpload = () => {
  return useContext(bulkbranchUploadContext);
};

