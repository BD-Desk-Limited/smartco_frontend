'use client';
import React, { createContext, useState, useContext } from 'react';

//create a context for bulk material upload

const createProductsContext = createContext(null);

export const CreateProductsProvider = ({ children }) => {
  
  const emptyForm = { name: '', description: '', category: '', image: null, pricing: [], productTax: [] }; // empty form for resetting after creation
  const [products, setProducts] = useState([emptyForm]);

  // Retrieve from local storage on initial load. if no products in local storage, set to emptyForm
  React.useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts([emptyForm]);
    }
  }, []);

  //store products in local storage anytime products state changes
  React.useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
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
