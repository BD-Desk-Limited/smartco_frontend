'use client';
// TODO: this is just a boilerplate for now, we will add more state and logic to it as we build out the sales point features. For now, it just provides a place to store the cart and pending order data, and persist it across page reloads within the same session.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const SalesPointContext = createContext(null);

const SALES_POINT_STORAGE_KEY = 'sales_point_state_v1';

const salesPointStateKeys = [
  'cart',
  'pending_order',
  'pending_customer_registration',
  'pending_order_schedule',
];

const initialSalesPointState = {
  cart: [],
  pending_order: null,
  pending_customer_registration: null,
  pending_order_schedule: null,
};

export const useSalesPoint = () => {
  const context = useContext(SalesPointContext);

  if (!context) {
    throw new Error('useSalesPoint must be used within a SalesPointProvider');
  }

  return context;
};

export const SalesPointProvider = ({ children }) => {
  const [salesPointState, setSalesPointState] = useState(
    initialSalesPointState
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const hydrateFromSession = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(SALES_POINT_STORAGE_KEY);
      if (!stored) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(stored);

      setSalesPointState((prev) => ({
        ...prev,
        ...parsed,
      }));
    } catch (error) {
      console.error(
        'Failed to hydrate sales point state from sessionStorage',
        error
      );
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    hydrateFromSession();
  }, [hydrateFromSession]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;

    try {
      sessionStorage.setItem(
        SALES_POINT_STORAGE_KEY,
        JSON.stringify(salesPointState)
      );
    } catch (error) {
      console.error(
        'Failed to persist sales point state to sessionStorage',
        error
      );
    }
  }, [salesPointState, isHydrated]);

  const setStateByKey = useCallback((key, valueOrUpdater) => {
    if (!salesPointStateKeys.includes(key)) {
      throw new Error(`Invalid SalesPoint state key: ${key}`);
    }

    setSalesPointState((prev) => {
      const current = prev[key];
      const nextValue =
        typeof valueOrUpdater === 'function'
          ? valueOrUpdater(current)
          : valueOrUpdater;

      return {
        ...prev,
        [key]: nextValue,
      };
    });
  }, []);

  const clearStateByKey = useCallback((key) => {
    if (!salesPointStateKeys.includes(key)) {
      throw new Error(`Invalid SalesPoint state key: ${key}`);
    }

    setSalesPointState((prev) => ({
      ...prev,
      [key]: initialSalesPointState[key],
    }));
  }, []);

  const resetSalesPointState = useCallback(() => {
    setSalesPointState(initialSalesPointState);

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SALES_POINT_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      salesPointState,
      salesPointStateKeys,
      setSalesPointState,
      setStateByKey,
      clearStateByKey,
      resetSalesPointState,
      isHydrated,
    }),
    [
      salesPointState,
      setStateByKey,
      clearStateByKey,
      resetSalesPointState,
      isHydrated,
    ]
  );

  return (
    <SalesPointContext.Provider value={value}>
      {children}
    </SalesPointContext.Provider>
  );
};

export { initialSalesPointState, salesPointStateKeys, SALES_POINT_STORAGE_KEY };
