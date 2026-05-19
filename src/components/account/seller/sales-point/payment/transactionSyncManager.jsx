'use client';

import { getAllDocuments } from '@/utilities/indexedDBManagement';
/**
 * TRANSACTION SYNC MANAGER
 *
 * Handles automatic recovery and syncing of transactions:
 * - On app startup: check for abandoned transactions
 * - On online event: attempt sync of pending transactions
 * - Periodic checks: every 5 minutes attempt sync
 * - Graceful degradation: continues even if sync fails
 */

import {
  checkAndSyncPendingTransactions,
  recoverLocalStorageTransactions,
} from '../../../../../services/transactionPersistenceService';

let syncCheckInterval = null;
let isInitialized = false;

/**
 * Initialize transaction sync manager
 * Call this once on app startup in root layout
 */
export const initializeTransactionSync = async () => {
  if (isInitialized) {
    return;
  }

  if (typeof window === 'undefined') {
    return; // Skip on server-side
  }

  isInitialized = true;

  try {
    // Attempt immediate recovery on startup
    console.log('[TxnSync] Initializing transaction sync manager...');

    // Step 1: Recover any localStorage backups directly to API, if API fail, they will be re-queued in IndexedDB for next sync attempt.
    // local storage is cleaned up after recovery.
    const localStorageRecovery = await recoverLocalStorageTransactions();
    console.log(
      '[TxnSync] localStorage recovery result:',
      localStorageRecovery
    );

    // Step 2: Sync any pending transactions in IndexedDB that were not successfully synced in previous attempts or were created while offline. or moved from localStorage recovery if API was unreachable.
    const pendingSync = await checkAndSyncPendingTransactions();
    console.log('[TxnSync] Pending transactions sync result:', pendingSync);

    // Step 3: Set up online/offline listeners after initial recovery and sync to catch any new transactions created while offline or any pending transactions that failed to sync due to connectivity issues. so that we can attempt sync immediately when connectivity is restored. not having to wait for app to be restarted or for the periodic check to run.
    setupConnectivityListeners();

    // Step 4: Set up periodic checks
    setupPeriodicSyncCheck();

    console.log('[TxnSync] Transaction sync manager initialized');
  } catch (err) {
    console.error('[TxnSync] Error during initialization:', err);
    // Don't throw - sync is best-effort
  }
};

/**
 * Clean up sync manager (call on unmount if needed)
 */
export const cleanupTransactionSync = () => {
  if (syncCheckInterval) {
    clearInterval(syncCheckInterval);
    syncCheckInterval = null;
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOfflineSyncCount);
  }
};

/**
 * Handle online event - attempt immediate sync
 */
const handleOnline = async () => {
  console.log('[TxnSync] Online event detected, attempting sync...');
  try {
    const result = await checkAndSyncPendingTransactions();
    console.log('[TxnSync] Sync result on online:', result);
  } catch (err) {
    console.error('[TxnSync] Error syncing on online event:', err);
  }
};

// Get the number of pending transactions in In DB
export const getPendingTransactionsCount = async () => {
  try {
    const response = await getAllDocuments('pending-transactions');
    return Array.isArray(response?.data) ? response.data.length : 0;
  } catch (err) {
    console.error('[TxnSync] Error getting pending transaction count:', err);
    return 0;
  }
};

/**
 * Handle offline event - log for debugging and return pending transaction count for monitoring
 */
export const handleOfflineSyncCount = async () => {
  console.log('[TxnSync] Offline event detected, queuing for later sync');
  try {
    const pendingCount = await getPendingTransactionsCount();
    console.log(`[TxnSync] Pending transactions count: ${pendingCount}`);
    return pendingCount;
  } catch (err) {
    console.error(
      '[TxnSync] Error getting pending transaction count on offline event:',
      err
    );
  }
};

/**
 * Set up online/offline listeners
 */
export const setupConnectivityListeners = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOfflineSyncCount);
};

/**
 * Set up periodic sync check every 5 minutes
 */
export const setupPeriodicSyncCheck = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // Clear existing interval if any
  if (syncCheckInterval) {
    clearInterval(syncCheckInterval);
  }

  // Check every 2 minute for demo purposes (adjust as needed, e.g., every 2 minutes in production)
  const CHECK_INTERVAL = 2 * 60 * 1000;

  syncCheckInterval = setInterval(async () => {
    console.log(
      '[TxnSync] Running periodic sync check at',
      new Date().toISOString()
    );
    try {
      const result = await checkAndSyncPendingTransactions();

      console.log(
        '[TxnSync] Next periodic sync check completed. next check in',
        CHECK_INTERVAL / 1000,
        'seconds'
      );

      if (result.synced > 0 || result.failed > 0) {
        console.log('[TxnSync] Periodic sync result:', result);
      }
    } catch (err) {
      console.error('[TxnSync] Error in periodic sync:', err);
    }
  }, CHECK_INTERVAL);
};

/**
 * Service Worker registration for background sync capabilities
 */
export const setupServiceWorkerSync = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    // Attempt to register service worker for background sync
    const registration = await navigator.serviceWorker.ready;

    // Tag for background sync (needs Service Worker support)
    if ('sync' in registration) {
      // This would sync pending transactions even if app is closed
      // Requires Service Worker implementation
      console.log('[TxnSync] Service Worker background sync available');
    }
  } catch (err) {
    console.warn('[TxnSync] Service Worker sync setup error:', err);
    // Not critical - sync will still work via periodic checks
  }
};
