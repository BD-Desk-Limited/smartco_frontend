'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for company data
const CompanyDataContext = createContext(null);

export const CompanyDataProvider = ({ children }) => {
  const [companyData, SetCompanyData] = useState(null);

  useEffect(() => {
    // Retrieve the JSON string from localStorage
    const storedCompanyData = localStorage.getItem('companyData');

    // Parse the JSON string back into an object
    const fetchedData = storedCompanyData
      ? JSON.parse(storedCompanyData)
      : null;

    SetCompanyData(fetchedData);
  }, []);

  console.log('companyData:', companyData);

  const setCompanyData = (data) => {
    // Update the company data in state and localStorage
    SetCompanyData(data);
    localStorage.setItem('companyData', JSON.stringify(data));
  };

  return (
    <CompanyDataContext.Provider value={{ companyData, setCompanyData }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

// Custom hook to use the CompanyDataContext
export const useCompanyData = () => {
  return useContext(CompanyDataContext);
};

