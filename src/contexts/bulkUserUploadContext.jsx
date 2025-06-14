'use client';
import React, { createContext, useState, useContext } from 'react';

//create a context for bulk material upload

const bulkUserUploadContext = createContext(null);

export const BulkUserUploadProvider = ({ children }) => {
  const [bulkUserData, setBulkUserData] = useState(null);
  const [errorData, setErrorData] = useState([]);

  return (
    <bulkUserUploadContext.Provider value={{ bulkUserData, setBulkUserData, errorData, setErrorData }}>
      {children}
    </bulkUserUploadContext.Provider>
  );
}

// Custom hook to use the bulkMaterialUploadContext
export const useBulkUserUpload = () => {
  return useContext(bulkUserUploadContext);
};

