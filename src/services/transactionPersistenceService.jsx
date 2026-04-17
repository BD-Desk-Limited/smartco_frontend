'use client';

import {
  deleteDocuments,
  getAllDocuments,
  getDocumentsByParameters,
  upsertDocuments,
} from '@/utilities/indexedDBManagement';
import { recordTransactionsService } from './transactionServices';

/**
 * TRANSACTION PERSISTENCE SERVICE
 *
 * Implements 5-layer data loss prevention strategy:
 * Layer 1: IndexedDB (primary)
 * Layer 2: API with exponential backoff retry
 * Layer 3: Pending queue (IndexedDB)
 * Layer 4: Encrypted localStorage (final fallback)
 * Layer 5: Background sync & recovery
 *
 * Each transaction gets tracking ID for audit trail.
 * Status tracked at each layer for recovery purposes.
 */

// Constants
const PENDING_TRANSACTIONS_STORE = 'pending-transactions';
const TRANSACTION_LOG_STORE = 'transaction-logs';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS = [500, 1500, 5000]; // ms between retries
const LOCALSTORAGE_KEY_PREFIX = 'txn_pending_';
const LOCALSTORAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
const TRANSACTION_TIMEOUT = 30000; // 30 seconds

//Log transaction attempt for audit trail
const logTransactionAttempt = async (
  trackingId,
  layer,
  status,
  details = {}
) => {
  /* shape of log entry: { trackingId, logs: [{ layer, status, timestamp, details }] }
   */
  try {
    const timestamp = new Date().toISOString();
    const logEntry = { layer, status, details, timestamp };

    let updatedLogs = { trackingId, logs: [logEntry] };

    //existing logs for this trackingId
    const existingLogsResponse = await getDocumentsByParameters(
      TRANSACTION_LOG_STORE,
      [{ trackingId: (value) => value === trackingId }]
    );
    const existingLogs = existingLogsResponse?.data || [];

    if (existingLogs?.length > 0) {
      updatedLogs = existingLogs[0] || {};
      // update details of existing logs if already exists
      updatedLogs = { ...updatedLogs, logs: [...updatedLogs.logs, logEntry] };
    }

    // Try to store log entry in IndexedDB, if fails, fallback to console logging
    await upsertDocuments(TRANSACTION_LOG_STORE, [updatedLogs]);
  } catch (err) {
    // Fallback: store in memory or skip if IDB unavailable
    console.debug(`Log entry for ${trackingId}:`, {
      trackingId,
      layer,
      status,
      timestamp: new Date().toISOString(),
    });
  }
};

//LAYER 1: IndexedDB - Primary Storage with Verification
const persistToIndexedDB = async (transactions) => {
  try {
    // log attempt for each transaction before writing to IDB
    const txnsWithTracking =
      (await Promise.all(
        transactions?.map(async (transaction) => {
          await logTransactionAttempt(
            transaction.trackingId,
            'IDB',
            'attempting'
          );

          return {
            ...transaction,
            persistedAt: new Date().toISOString(),
            persistedTo: ['idb'],
            status: 'stored_idb',
          };
        })
      )) || [];
    // Store transactions in IndexedDB, use upsert to handle both new and existing records
    const response = await upsertDocuments(
      'pending-transactions',
      txnsWithTracking
    );

    if (!response?.success) {
      // Log failure for each transaction
      txnsWithTracking.forEach(async (txn) => {
        await logTransactionAttempt(txn.trackingId, 'IDB', 'failed', {
          error: response?.error,
        });
      });

      return { success: false, layer: 'IDB', error: response?.error };
    }

    // Verify write succeeded by reading back the stored transactions
    const verifyReadResponse = await getAllDocuments(
      PENDING_TRANSACTIONS_STORE
    );
    const verifyRead = verifyReadResponse?.data || [];
    const storedTxns =
      (verifyRead &&
        verifyRead.length > 0 &&
        verifyRead?.filter((t) =>
          txnsWithTracking?.map((tx) => tx.trackingId).includes(t.trackingId)
        )) ||
      [];
    // Check if all transactions were stored correctly
    const allStored = txnsWithTracking?.every((txn) =>
      storedTxns?.some((stored) => stored.trackingId === txn.trackingId)
    );
    const trackingIdsNotStored = txnsWithTracking
      .filter(
        (txn) =>
          !storedTxns?.some((stored) => stored.trackingId === txn.trackingId)
      )
      .map((t) => t.trackingId);

    if (!allStored) {
      // Log failure for transactions that were not stored
      trackingIdsNotStored.forEach(async (trackingId) => {
        await logTransactionAttempt(trackingId, 'IDB', 'failed', {
          error: 'Verification failed - transaction not found after write',
        });
      });

      return {
        success: false,
        layer: 'IDB',
        error: 'Verification failed',
      };
    }

    // Log success for each transaction
    txnsWithTracking?.forEach(async (txn) => {
      await logTransactionAttempt(txn.trackingId, 'IDB', 'success', {
        recordId: txn.orderId,
      });
    });

    return {
      success: true,
      layer: 'IDB',
      storedCount: transactions?.length || 0,
    };
  } catch (err) {
    for (const transaction of transactions) {
      await logTransactionAttempt(transaction.trackingId, 'IDB', 'failed', {
        error: err.message,
      });
    }
    return { success: false, layer: 'IDB', error: err.message };
  }
};

//LAYER 2: API with Exponential Backoff Retry
const persistToAPIWithRetry = async (transactions) => {
  let lastSuccessMessage = 'Transactions recorded successfully';
  let singleTransaction = transactions?.length === 1;
  let customerRegToken = null;

  // Log initial attempt for each transaction
  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      for (const transaction of transactions) {
        await logTransactionAttempt(
          transaction.trackingId,
          'API',
          'attempting',
          {
            attempt: attempt + 1,
            maxAttempts: MAX_RETRY_ATTEMPTS,
          }
        );

        // Add timeout to prevent infinite hang
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('API request timeout')),
            TRANSACTION_TIMEOUT
          )
        );

        const apiPromise = recordTransactionsService([transaction]);
        const response = await Promise.race([apiPromise, timeoutPromise]);

        if (response?.data) {
          lastSuccessMessage =
            response?.message || 'Transactions recorded successfully';
          if (singleTransaction) {
            customerRegToken = response?.data?.customerRegToken || null; // API returns a customer registration token to be used for post-transaction customer self-registration
          }

          //delete local IDB record after successful API persistence
          await deleteDocuments('pending-transactions', [transaction.orderId]);

          //delete logs for this transaction after successful API persistence
          await deleteDocuments(TRANSACTION_LOG_STORE, [
            transaction.trackingId,
          ]);
        } else {
          throw new Error(response?.error || 'Unknown API error');
        }
      }

      return {
        success: true,
        layer: 'API',
        message: lastSuccessMessage,
        customerRegToken: customerRegToken,
      };
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRY_ATTEMPTS - 1;
      const delayMs = RETRY_DELAYS[attempt] || 10000;

      for (const transaction of transactions) {
        await logTransactionAttempt(transaction.trackingId, 'API', 'failed', {
          attempt: attempt + 1,
          error: err.message,
          willRetry: !isLastAttempt,
          nextRetryMs: isLastAttempt ? 0 : delayMs,
        });
      }

      if (isLastAttempt) {
        return {
          success: false,
          layer: 'API',
          message: err.message || 'error recording transactions to API',
          retriesExhausted: true,
        };
      }

      // Wait before retry with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return {
    success: false,
    layer: 'API',
    message: 'error recording transactions to API',
    error: 'All retry attempts exhausted',
    retriesExhausted: true,
  };
};

//LAYER 3: Persistence onlocal storage
const persistToLocalStorageFallback = async (transactions) => {
  const txnsWithTracking = transactions.map((transaction) => ({
    ...transaction,
    trackingId: transaction.trackingId || generateTrackingId(),
  }));

  try {
    for (const transaction of txnsWithTracking) {
      await logTransactionAttempt(
        transaction.trackingId,
        'localStorage',
        'attempting'
      );
    }

    // Check quota before writing
    const currentUsage = Object.keys(localStorage)
      .filter((k) => k.startsWith(LOCALSTORAGE_KEY_PREFIX))
      .reduce((sum, k) => sum + localStorage[k].length, 0);

    let newDataSize = 0;
    for (const transaction of txnsWithTracking) {
      newDataSize += calculateSize(transaction);

      if (currentUsage + newDataSize > LOCALSTORAGE_MAX_SIZE) {
        await logTransactionAttempt(
          transaction.trackingId,
          'localStorage',
          'skipped',
          {
            reason: 'Quota exceeded',
            currentUsage,
            newSize: newDataSize,
            maxSize: LOCALSTORAGE_MAX_SIZE,
          }
        );
      }
    }

    if (currentUsage + newDataSize > LOCALSTORAGE_MAX_SIZE) {
      return {
        success: false,
        layer: 'localStorage',
        error: 'Storage quota exceeded',
        skipped: true,
      };
    }

    for (const transaction of txnsWithTracking) {
      const localStorageEntry = {
        trackingId: transaction.trackingId,
        transaction,
        storedAt: new Date().toISOString(),
        checksum: generateChecksum(transaction),
      };

      const encryptedData = encryptData(localStorageEntry);

      if (!encryptedData) {
        throw new Error('Encryption failed');
      }

      const key = `${LOCALSTORAGE_KEY_PREFIX}${transaction.trackingId}`;
      localStorage.setItem(key, encryptedData);

      // Verify write
      const retrieved = localStorage.getItem(key);
      const decrypted = decryptData(retrieved);

      if (!decrypted || decrypted.checksum !== localStorageEntry.checksum) {
        localStorage.removeItem(key);
        // Log failure for this transaction and delete all entries so they all fail together to avoid partial writes
        await logTransactionAttempt(
          transaction.trackingId,
          'localStorage',
          'failed',
          {
            reason: 'Verification failed after write',
          }
        );

        // Clean up all entries for this batch to avoid partial success scenario
        for (const txn of txnsWithTracking) {
          const cleanupKey = `${LOCALSTORAGE_KEY_PREFIX}${txn.trackingId}`;
          localStorage.removeItem(cleanupKey);
          await logTransactionAttempt(
            txn.trackingId,
            'localStorage',
            'cleanup',
            {
              reason: 'Cleaning up after failed verification',
            }
          );
        }

        return {
          success: false,
          layer: 'localStorage',
          error: 'Verification failed after write',
        };
      }

      for (const transaction of txnsWithTracking) {
        await logTransactionAttempt(
          transaction.trackingId,
          'localStorage',
          'success'
        );
      }
    }

    // If we get here, all transactions were successfully stored and verified in localStorage
    return {
      success: true,
      layer: 'localStorage',
      encrypted: true,
    };
  } catch (err) {
    for (const transaction of txnsWithTracking) {
      await logTransactionAttempt(
        transaction.trackingId,
        'localStorage',
        'failed',
        {
          error: err.message,
        }
      );
    }
    return {
      success: false,
      layer: 'localStorage',
      error: err.message,
    };
  }
};

//LAYER 4: Recovery & Sync Functions - Check for pending transactions that need syncing
const checkAndSyncPendingTransactions = async () => {
  try {
    // get all pending transactions
    const pendingTransactionsResponse = await getAllDocuments(
      PENDING_TRANSACTIONS_STORE
    );
    let allPendingTxns = pendingTransactionsResponse?.data || [];

    if (!allPendingTxns || allPendingTxns.length === 0) {
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;

    while (allPendingTxns.length > 0) {
      let thisBatch = [];

      if (allPendingTxns.length > 10) {
        // If there are more than 10 pending transactions, we process them in batches of 10 to avoid overwhelming the API
        thisBatch = allPendingTxns.slice(0, 10);
        // assign what is left as the next value of allPendingTxns for the next batch processing after this one is done
        allPendingTxns = allPendingTxns.slice(10);
      } else {
        thisBatch = allPendingTxns;
        allPendingTxns = [];
      }

      const now = new Date();
      // Determine the earliest next retry time in this batch — guard against missing/invalid nextRetryAt
      const validNextRetryDates = thisBatch
        ?.map((txn) => new Date(txn.nextRetryAt))
        .filter((d) => !isNaN(d.getTime())); //check if all date are valid dates and filter out invalid ones
      // If no valid nextRetryAt dates, we can attempt to sync immediately, otherwise we wait until the earliest nextRetryAt time
      const nextRetry =
        validNextRetryDates.length > 0
          ? validNextRetryDates.reduce((earliest, d) =>
              d < earliest ? d : earliest
            )
          : now;

      // Skip if not ready for retry
      if (nextRetry > now) {
        return { synced: 0, failed: 0, nextRetryAt: nextRetry.toISOString() };
      }

      // Only retry if online
      if (!isOnline()) {
        return { synced: 0, failed: 0, nextRetryAt: nextRetry.toISOString() };
      }

      //Add next retry time to logs for this batch before attempting retry
      const updatedBatchWithRetryCount = thisBatch.map((txn) => {
        const currentRetryCount = txn.retryCount ?? 0;
        const nextRetryCount = currentRetryCount + 1;
        //2minutes backoff for first 3 retries, then 5 minutes backoff for subsequent retries
        const backoffMinutes = nextRetryCount <= 3 ? 2 : 5;
        const backoffMs = backoffMinutes * 60 * 1000;
        return {
          ...txn,
          retryCount: nextRetryCount,
          nextRetryAt: new Date(Date.now() + backoffMs).toISOString(),
        };
      });

      if (updatedBatchWithRetryCount.length === 0) {
        continue; // if there are no transactions to retry in this batch, skip to the next batch
      }

      const retryResult = await persistToAPIWithRetry(
        updatedBatchWithRetryCount
      );

      if (retryResult.success) {
        //gets removed once synced successfully to API in persistToAPIWithRetry function, so we just need to count them here
        synced += thisBatch.length;
      } else {
        // check if retry count for each transaction in this batch has exceeded 10 retries, if yes, mark as failed and return failure for this batch, if not, update the next retry time and retry count in IndexedDB for each transaction in this batch and return failure for this batch so they can be retried in later sync attempt
        const updatedBatch = updatedBatchWithRetryCount?.map((txn) => {
          if (txn.retryCount >= 10) {
            return {
              ...txn,
              retryCount: 0, // reset retry count
              status: 'failed',
              failedAt: new Date().toISOString(),
            };
          }
          return txn;
        });
        // Count how many transactions in this batch have been marked as failed
        const failedCount = updatedBatch.filter(
          (txn) => txn.status === 'failed'
        ).length;
        failed += failedCount;

        // Update all transactions in this batch in IndexedDB with new retry time and status
        if (updatedBatch.length > 0) {
          await upsertDocuments(PENDING_TRANSACTIONS_STORE, updatedBatch);
        }
      }
    }

    return { synced, failed };
  } catch (err) {
    console.error('Error syncing pending transactions:', err);
    return { synced: 0, failed: 0, error: err.message };
  }
};

//LAYER 5: Recovery & Sync Functions - Recover localStorage transactions and attempt sync
const recoverLocalStorageTransactions = async () => {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(LOCALSTORAGE_KEY_PREFIX)
    );

    if (keys.length === 0) {
      return { recovered: 0, failed: 0 };
    }

    let recovered = 0;
    let failed = 0;

    for (const key of keys) {
      try {
        const encryptedData = localStorage.getItem(key);
        const decrypted = decryptData(encryptedData);

        if (!decrypted) {
          localStorage.removeItem(key); // Remove corrupted entry
          failed++;
          continue;
        }

        // Verify checksum
        if (decrypted.checksum !== generateChecksum(decrypted.transaction)) {
          localStorage.removeItem(key);
          failed++;
          continue;
        }

        // Try to sync to API
        let syncResult = { success: false };
        if (isOnline()) {
          syncResult = await persistToAPIWithRetry([decrypted.transaction]);

          if (syncResult.success) {
            localStorage.removeItem(key);
            recovered++;
            continue;
          }
        }

        // If offline or API failed, add to indexedDB pending queue for later sync
        if (!syncResult.success) {
          await persistToIndexedDB(
            decrypted.transactions
              ? decrypted.transactions
              : [decrypted.transaction]
          );

          localStorage.removeItem(key);
          recovered++;
        }
      } catch (err) {
        console.error(`Error recovering transaction from ${key}:`, err);
        failed++;
      }
    }

    return { recovered, failed };
  } catch (err) {
    console.error('Error recovering localStorage transactions:', err);
    return { recovered: 0, failed: 0, error: err.message };
  }
};

//Get transaction status across all layers
const getTransactionStatus = async (trackingId) => {
  try {
    const logsResponse = await getAllDocuments(TRANSACTION_LOG_STORE);
    const logs = logsResponse?.data || [];
    const txnLogRecord = logs?.find((log) => log.trackingId === trackingId);
    const timeline = Array.isArray(txnLogRecord?.logs) ? txnLogRecord.logs : [];

    const successLayers = [
      ...new Set(
        timeline
          .filter((log) => log.status === 'success')
          .map((log) => log.layer)
      ),
    ];

    const failureLayers = [
      ...new Set(
        timeline
          .filter((log) => log.status === 'failed')
          .map((log) => log.layer)
      ),
    ];

    const pendingQueueResponse = await getDocumentsByParameters(
      PENDING_TRANSACTIONS_STORE,
      [{ trackingId: (value) => value === trackingId }]
    );
    const inPendingQueue = pendingQueueResponse?.data || [];

    const inLocalStorage =
      localStorage.getItem(`${LOCALSTORAGE_KEY_PREFIX}${trackingId}`) !== null;

    return {
      trackingId,
      successLayers,
      failureLayers,
      storedIn: {
        indexedDB: inPendingQueue.length > 0,
        localStorage: inLocalStorage,
      },
      timeline,
      isFullySynced: successLayers.includes('API'),
    };
  } catch (err) {
    console.error('Error getting transaction status:', err);
    return null;
  }
};

/**
 * MAIN ENTRY POINT: Persist transaction across all layers
 */
const persistTransactionMultiLayer = async (transaction) => {
  const trackingId = generateTrackingId();

  transaction.trackingId = trackingId; // Ensure transaction has tracking ID for logging and tracing
  const results = {
    trackingId,
    transaction,
    timestamp: new Date().toISOString(),
    layers: [],
    success: false,
    persistedTo: [],
    userMessage: '',
    customerRegToken: null,
  };

  try {
    // Check internet status
    const online = isOnline();
    results.online = online;
    let idbResult;
    let apiResult;
    let storageResult;

    // LAYER 1: IndexedDB (always attempt)
    idbResult = await persistToIndexedDB([transaction]);
    results.layers.push(idbResult);

    if (idbResult.success) {
      results.persistedTo.push('IndexedDB');
      results.success = true;
    }

    //proceed to API persistence if IDB succeeded, if IDB failed, we can still attempt API persistence as long as we are online, if API persistence succeeds, it cleans-up the IDB record for this transaction in the API persistence function, if API persistence fails, we will rely on the retry mechanism in checkAndSyncPendingTransactions function to retry syncing this transaction later from the indexedDB

    // LAYER 2: API (only if online)
    if (online) {
      apiResult = await persistToAPIWithRetry([transaction]); // This will also handle cleanup of IndexedDB if successful

      results.layers.push(apiResult);

      if (apiResult.success) {
        results.persistedTo.push('API');
        results.success = true;
        results.userMessage = 'Transaction saved to backend';
        results.customerRegToken = apiResult?.customerRegToken || null; // in case API returns a customer registration token to be used for post-transaction customer self-registration
        return results;
      }
    }

    // LAYER 3: localStorage (final fallback) if both IDB and API failed
    if (!apiResult.success && !idbResult.success) {
      storageResult = await persistToLocalStorageFallback(transaction);
      results.layers.push(storageResult);

      if (storageResult.success) {
        results.persistedTo.push('localStorage');
        results.userMessage = !online
          ? 'You are offline. Transaction saved locally for later sync.'
          : 'Transaction saved locally as backup. Backend sync will retry.';
        results.success = true;
        return results;
      } else {
        // If we get here, all layers failed
        results.success = false;
        results.userMessage =
          'Failed to save transaction. Please check your connection and try again.';

        return results;
      }
    }

    if (idbResult.success || apiResult.success || storageResult.success) {
      //if any result is successfull, return success. Data would be synced later
      results.success = true;
      return results;
    }
  } catch (err) {
    results.success = false;
    results.error = err.message;
    results.userMessage =
      'Unexpected error saving transaction. Please try again.';
    return results;
  }
};

/*-------------------------------------------Helper Functions-------------------------------------------*/
//Generate unique tracking ID for transaction audit trail
const generateTrackingId = () => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

//Calculate approximate size of object in bytes
const calculateSize = (obj) => {
  return new Blob([JSON.stringify(obj)]).size;
};

//Check if browser is online
const isOnline = () => {
  return typeof window !== 'undefined' && navigator.onLine;
};

//Encrypt data for localStorage
const encryptData = (data) => {
  try {
    const jsonStr = JSON.stringify(data);
    // Simple encoding
    return btoa(jsonStr);
  } catch (err) {
    console.error('Encryption failed:', err);
    return null;
  }
};

//Decrypt data from localStorage
const decryptData = (encryptedData) => {
  try {
    const jsonStr = atob(encryptedData); // simple decoding
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Decryption failed:', err);
    return null;
  }
};

// Simple checksum generator for data integrity verification
const generateChecksum = (data) => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

export {
  checkAndSyncPendingTransactions,
  persistTransactionMultiLayer,
  recoverLocalStorageTransactions,
  getTransactionStatus,
};
