'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

const NewCustomerRegistrationContext = createContext(null);

export const useNewCustomerRegistration = () => {
  const context = useContext(NewCustomerRegistrationContext);

  if (!context) {
    throw new Error(
      'useNewCustomerRegistration must be used within a NewCustomerRegistrationProvider'
    );
  }

  return context;
};

export const NewCustomerRegistrationProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState({
    token: null,
    orderId: null,
  });

  const contextValue = useMemo(
    () => ({
      registrationData,
      setRegistrationData,
    }),
    [registrationData, setRegistrationData]
  );

  return (
    <NewCustomerRegistrationContext.Provider value={contextValue}>
      {children}
    </NewCustomerRegistrationContext.Provider>
  );
};
