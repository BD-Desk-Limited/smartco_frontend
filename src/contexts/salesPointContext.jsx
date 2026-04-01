'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const SalesPointContext = createContext(null);

const withholdHours = 2; // Number of hours to withhold sales point data before it can be cleared, can be adjusted as needed. This is to prevent accidental data loss if a user leaves the sales point page and comes back within a short period of time.
const maxWithholdTime = withholdHours * 60 * 60 * 1000; // Convert hours to milliseconds for easier time comparisons

const SALES_POINT_STORAGE_KEY = 'sales_point_state_v1';

// Initial state structure for the sales point context, initiates with empty arrays for each state key and a null seller.
const initialSalesPointState = {
  seller: null,
  states: {
    cart: {},
    pending_orders: [],
    pending_customer_registration: [],
    pending_order_schedule: [],
  },
  lastUpdated: Date.now(),
};

const salesPointStateKeys = Object.keys(initialSalesPointState.states);

export const useSalesPoint = () => {
  const context = useContext(SalesPointContext);

  if (!context) {
    throw new Error('useSalesPoint must be used within a SalesPointProvider');
  }

  return context;
};

export const SalesPointProvider = ({ children }) => {
  const [salesPointState, SetSalesPointState] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const clearStateByWithholdTime = useCallback(() => {
    SetSalesPointState((prev) => {
      const updatedState = prev?.filter((sellerState) => {
        if (!sellerState.lastUpdated) return false; // If we don't have a timestamp, we can't determine if it should be cleared, so we remove it since it's safer to clear potentially stale data than to risk keeping it indefinitely.
        return Date.now() - sellerState.lastUpdated < maxWithholdTime;
      });

      return updatedState;
    });
  }, []);

  // Hydrate from sessionStorage on mount to restore state across page reloads within the same session
  const hydrateFromSession = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(SALES_POINT_STORAGE_KEY);
      if (!stored) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(stored);
      const parsedState = Array.isArray(parsed) ? parsed : [];

      SetSalesPointState(parsedState);
    } catch (error) {
      console.error(
        'Failed to hydrate sales point state from sessionStorage',
        error
      );
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Only run the hydration effect once on mount
  useEffect(() => {
    hydrateFromSession();
  }, [hydrateFromSession]);

  // After hydration, clear stale entries from persisted data.
  useEffect(() => {
    if (!isHydrated) return;
    clearStateByWithholdTime();
  }, [isHydrated, clearStateByWithholdTime]);

  // Persist to sessionStorage whenever salesPointState changes
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

  const handleUpdateSalesPointState = useCallback(
    (currentSellerId, keyToUpdate, updateValue) => {
      try {
        if (!salesPointStateKeys.includes(keyToUpdate)) {
          console.warn(
            `Attempted to update invalid sales point state key: ${keyToUpdate}`
          );
          return;
        }

        SetSalesPointState((prev) => {
          // Find the current seller's state object
          const currentSellerObj = prev?.find(
            (s) => s.seller === currentSellerId
          );
          // If the seller doesn't exist yet, create a new one with the updated state
          if (!currentSellerObj) {
            const newSellerObj = {
              seller: currentSellerId,
              states: {
                ...initialSalesPointState.states,
                [keyToUpdate]: updateValue,
              },
              lastUpdated: Date.now(),
            };
            // Append the new seller object to the existing state array
            return [...(prev || []), newSellerObj];
          } else {
            // If the seller exists, update the specific key in their states
            const updatedSellerObj = {
              ...currentSellerObj,
              states: {
                ...currentSellerObj.states,
                [keyToUpdate]: updateValue,
              },
              lastUpdated: Date.now(),
            };
            // Replace the old seller object with the updated one in the state array
            const otherSellers =
              prev?.filter((s) => s.seller !== currentSellerId) || [];
            return [...otherSellers, updatedSellerObj];
          }
        });
      } catch (error) {
        console.error('Failed to update sales point state by seller', error);
      }
    },
    []
  );

  const reSetSalesPointStates = useCallback(() => {
    SetSalesPointState([]);

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SALES_POINT_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      salesPointState,
      handleUpdateSalesPointState,
      reSetSalesPointStates,
      loadingContext: !isHydrated,
    }),
    [
      salesPointState,
      handleUpdateSalesPointState,
      isHydrated,
      reSetSalesPointStates,
    ]
  );

  return (
    <SalesPointContext.Provider value={value}>
      {children}
    </SalesPointContext.Provider>
  );
};
