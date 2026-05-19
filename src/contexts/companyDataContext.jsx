'use client';
import React, { createContext, useState, useContext } from 'react';

// Create a context for company data
const CompanyDataContext = createContext(null);

const getInitialCompanyData = () => {
  if (typeof window === 'undefined') return null;

  try {
    const storedCompanyData = localStorage.getItem('companyData');
    const fetchedData = storedCompanyData
      ? JSON.parse(storedCompanyData)
      : null;
    return { ...fetchedData, isLoaded: true };
  } catch (error) {
    console.error('Failed to read companyData from localStorage', error);
    return { isLoaded: true };
  }
};

export const CompanyDataProvider = ({ children }) => {
  const [companyData, SetCompanyDataState] = useState(getInitialCompanyData);

  const setCompanyData = (data) => {
    // Update the company data in state and localStorage
    SetCompanyDataState({ ...data, isLoaded: true });
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
