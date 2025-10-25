'use client';
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

//create a context for bulk material upload

const createProductsContext = createContext(null);

export const CreateProductsProvider = ({ children }) => {

  const emptyForm = useMemo(() => ({ 
    name: '', 
    description: '', 
    category: '', 
    image: null, 
    pricing: [], 
    productTax: [] 
  }), []); // Define the structure of an empty product form
  const [products, setProducts] = useState([emptyForm]);

  // Retrieve from local storage on initial load. if no products in local storage, set to emptyForm
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts([emptyForm]);
      }
    } catch (error) {
      console.error('Error parsing products from localStorage:', error);
      setProducts([emptyForm]);
    }
  }, [emptyForm]);

  //store products in local storage anytime products state changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('products', JSON.stringify(products));
      } catch (error) {
        console.error('Error storing products to localStorage:', error);
      }
    }
  }, [products]);

  return (
    <createProductsContext.Provider value={{ products, setProducts, emptyForm }}>
      {children}
    </createProductsContext.Provider>
  );
}

// Custom hook to use the createProductsContext
export const useCreateProducts = () => {
  return useContext(createProductsContext);
};
