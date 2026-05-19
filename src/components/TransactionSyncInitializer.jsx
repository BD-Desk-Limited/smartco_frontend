'use client';

import React, { useEffect } from 'react';
import { initializeTransactionSync } from '@/components/account/seller/sales-point/payment/transactionSyncManager';

/**
 * Transaction Sync Initializer
 *
 * Initializes transaction sync manager on app startup.
 * Handles recovery of abandoned transactions and setup of periodic sync checks.
 *
 * Place this component high in the React tree (after providers) to ensure
 * it initializes early in the app lifecycle.
 */
export const TransactionSyncInitializer = () => {
  useEffect(() => {
    // Initialize transaction sync on component mount
    initializeTransactionSync();
  }, []); // Run once on mount

  return null; // This component doesn't render anything
};

export default TransactionSyncInitializer;
