'use client';
let db;
const DBName = 'SmartCoDB';
const version = 1;
const documents = [
  { name: 'meta-data', keyPath: 'key' }, // Store for metadata like last sync times, updatedAt, etc.
  { name: 'products', keyPath: '_id' }, // Main products data store
  { name: 'pending-transactions', keyPath: 'orderId' }, // Queue for offline sync
  { name: 'transaction-logs', keyPath: 'trackingId' }, // Audit trail
];

// Function to open IndexedDB and create object stores if they don't exist
const openIndexedDB = async () => {
  if (!window.indexedDB) {
    return Promise.reject(new Error("Your browser doesn't support IndexedDB."));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName, version);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      documents.forEach((doc) => {
        if (!db.objectStoreNames.contains(doc.name)) {
          db.createObjectStore(doc.name, { keyPath: doc.keyPath });
        }
      });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error || new Error('Could not open IndexedDB'));
    };
  });
};

// Function to add a new document to a specified object store
const addDocuments = async (storeName, documentsArray) => {
  if (!Array.isArray(documentsArray) || !documentsArray.length) {
    return Promise.reject(
      new Error('Documents must be a non-empty array of objects.')
    );
  }

  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(new Error('Store name must be a valid string.'));
  }

  const activeDb = db || (await openIndexedDB());

  return new Promise((resolve) => {
    const txn = activeDb.transaction(storeName, 'readwrite');
    const store = txn.objectStore(storeName);

    documentsArray.forEach((doc) => {
      store.add(doc);
    });

    txn.oncomplete = () => {
      const updateTime = new Date().toISOString();
      // metadata update; do not fail the main write if metadata is unavailable.
      if (activeDb.objectStoreNames.contains('meta-data')) {
        try {
          const metaDataStore = activeDb
            .transaction('meta-data', 'readwrite')
            .objectStore('meta-data');
          metaDataStore.put({
            key: `${storeName}-lastUpdated`,
            value: updateTime,
          });
        } catch {
          // Ignore metadata update errors to keep add operation successful.
        }
      }

      resolve({
        success: true,
        message: `Documents added to ${storeName} successfully!`,
        storage: 'local',
        data: documentsArray,
        updatedAt: updateTime,
      });
    };

    txn.onerror = (event) => {
      resolve({
        success: false,
        message: `Error adding documents to ${storeName}: ${event.target.error}`,
        storage: 'local',
        error: event.target.error,
      });
    };
  });
};

// Function to add or overwrite documents in a specified object store (uses put instead of add)
const upsertDocuments = async (storeName, documentsArray) => {
  if (!Array.isArray(documentsArray) || !documentsArray.length) {
    return Promise.reject(
      new Error('Documents must be a non-empty array of objects.')
    );
  }

  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(new Error('Store name must be a valid string.'));
  }

  const activeDb = db || (await openIndexedDB());

  return new Promise((resolve) => {
    const txn = activeDb.transaction(storeName, 'readwrite');
    const store = txn.objectStore(storeName);

    documentsArray.forEach((doc) => {
      store.put(doc);
    });

    txn.oncomplete = () => {
      const updateTime = new Date().toISOString();
      if (activeDb.objectStoreNames.contains('meta-data')) {
        try {
          const metaDataStore = activeDb
            .transaction('meta-data', 'readwrite')
            .objectStore('meta-data');
          metaDataStore.put({
            key: `${storeName}-lastUpdated`,
            value: updateTime,
          });
        } catch {
          // Ignore metadata update errors to keep upsert operation successful.
        }
      }

      resolve({
        success: true,
        message: `Documents upserted to ${storeName} successfully!`,
        storage: 'local',
        data: documentsArray,
        updatedAt: updateTime,
      });
    };

    txn.onerror = (event) => {
      resolve({
        success: false,
        message: `Error upserting documents to ${storeName}: ${event.target.error}`,
        storage: 'local',
        error: event.target.error,
      });
    };
  });
};

// Function to delete documents by an array of keys
const deleteDocuments = async (storeName, keys) => {
  if (!Array.isArray(keys) || !keys.length) {
    return Promise.reject(
      new Error('Keys to delete must be a non-empty array of valid keys.')
    );
  }

  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(new Error('Store name must be a valid string.'));
  }

  const activeDb = db || (await openIndexedDB());
  if (!Array.isArray(keys)) {
    keys = [keys]; // Convert single key to array for uniform processing
  }

  if (
    !keys.length ||
    keys.some((key) => key === undefined || key === null) ||
    !Array.isArray(keys)
  ) {
    return Promise.reject(
      new Error(
        'Invalid keys provided for deletion. Keys must be a non-empty array or a single valid key.'
      )
    );
  }

  return new Promise((resolve) => {
    const txn = activeDb.transaction(storeName, 'readwrite');
    const store = txn.objectStore(storeName);

    keys.forEach((key) => {
      store.delete(key);
    });

    txn.oncomplete = () => {
      resolve({
        success: true,
        message: `Documents with keys ${keys.join(', ')} deleted from ${storeName} successfully!`,
        storage: 'local',
        data: keys,
      });
    };

    txn.onerror = (event) => {
      resolve({
        success: false,
        message: `Error deleting documents from ${storeName}: ${event.target.error}`,
        storage: 'local',
        error: event.target.error,
      });
    };
  });
};

// Function to clear all documents from a specified object store
const clearStore = async (storeName) => {
  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(
      new Error('Please name the document store you want to clear.')
    );
  }

  const activeDb = db || (await openIndexedDB());

  return new Promise((resolve) => {
    const txn = activeDb.transaction(storeName, 'readwrite');
    const store = txn.objectStore(storeName);
    store.clear();

    txn.oncomplete = () => {
      resolve({
        success: true,
        message: `All documents cleared from ${storeName} successfully!`,
        storage: 'local',
      });
    };

    txn.onerror = (event) => {
      resolve({
        success: false,
        message: `Error clearing documents from ${storeName}: ${event.target.error}`,
        storage: 'local',
        error: event.target.error,
      });
    };
  });
};

// Function to get documents by an array of keys
const getDocumentsByKeys = async (storeName, keys) => {
  if (!Array.isArray(keys) || !keys.length) {
    return Promise.reject(
      new Error('Keys must be a non-empty array of valid keys.')
    );
  }

  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(new Error('Please provide a valid store name.'));
  }
  const activeDb = db || (await openIndexedDB());
  const keysArray = Array.isArray(keys) ? keys : [keys]; // Convert single key to array for uniform processing

  if (
    !keysArray.length ||
    keysArray.some((key) => key === undefined || key === null)
  ) {
    return Promise.resolve({
      success: false,
      message:
        'Invalid keys provided. Keys must be a non-empty array or a single valid key.',
      storage: 'local',
      error: new Error('Invalid keys'),
    });
  }

  return new Promise((resolve) => {
    const txn = activeDb.transaction(storeName, 'readonly');
    const store = txn.objectStore(storeName);

    const fetchedDocuments = [];
    let remaining = keysArray.length;
    let hasResolved = false;

    keysArray.forEach((key) => {
      const request = store.get(key);

      request.onsuccess = (event) => {
        const document = event.target.result;
        if (document !== undefined) {
          fetchedDocuments.push(document);
        }

        remaining -= 1;
        if (!hasResolved && remaining === 0) {
          hasResolved = true;
          resolve({
            success: true,
            message: `Documents fetched from ${storeName} successfully!`,
            storage: 'local',
            data: fetchedDocuments,
          });
        }
      };

      request.onerror = (event) => {
        if (!hasResolved) {
          hasResolved = true;
          resolve({
            success: false,
            message: `Error fetching documents from ${storeName}: ${event.target.error}`,
            storage: 'local',
            error: event.target.error,
          });
        }
      };
    });
  });
};

// Function to fetch all documents from a specified object store
const getAllDocuments = async (storeName) => {
  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(new Error('Please provide a valid store name.'));
  }
  const activeDb = db || (await openIndexedDB());

  return new Promise((resolve) => {
    const txn = activeDb?.transaction(storeName, 'readonly');
    const store = txn?.objectStore(storeName);
    const request = store?.getAll();

    request.onsuccess = (event) => {
      resolve({
        success: true,
        message: `Documents fetched from ${storeName} successfully!`,
        storage: 'local',
        data: event.target.result,
      });
    };

    request.onerror = (event) => {
      resolve({
        success: false,
        message: `Error fetching documents from ${storeName}: ${event.target.error}`,
        storage: 'local',
        error: event.target.error,
      });
    };
  });
};

//function to fetch documents by parameter from a specified object store
const getDocumentsByParameters = async (storeName, parameters) => {
  {
    /*
    function to fetch documents by parameter from a specified object store
    takes storeName, and array of parameters where each parameter is an object with key as the field name and value as the expected value or a function for custom matching e.g 
    [
      { name: (value) => value.substring(0, 7) === 'Product' },
      { category: (value) => value?.name === 'Category A' && value?.region === 'Region 2'},
      { price: (value) => parseFloat(value) < 50 },
      { _id: (value) => keysArray.includes(value) },
    ];
    This example would fetch documents where the name starts with 'Product', the category name is 'Category A', the category region is 'Region 2', the price is less than 50, and the _id is included in a specified keys array.
    */
  }

  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(new Error('Store name must be a valid string.'));
  }
  const activeDb = db || (await openIndexedDB());

  return new Promise((resolve) => {
    const txn = activeDb.transaction(storeName, 'readonly');
    const store = txn.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = (event) => {
      const allDocuments = event.target.result;
      const filteredDocuments = allDocuments.filter((doc) => {
        return parameters?.every((param) => {
          const [key, value] = Object.entries(param)[0]; // Get the key and value from the parameter object
          if (typeof value === 'function') {
            return value(doc[key]);
          }

          return doc[key] === value;
        });
      });

      resolve({
        success: true,
        message: `Documents fetched from ${storeName} with parameters ${JSON.stringify(parameters)} successfully!`,
        storage: 'local',
        data: filteredDocuments,
      });
    };

    request.onerror = (event) => {
      resolve({
        success: false,
        message: `Error fetching documents from ${storeName} with parameters ${JSON.stringify(parameters)}: ${event.target.error}`,
        storage: 'local',
        error: event.target.error,
      });
    };
  });
};

// Utility function to extract error message from various error formats
const getErrorMessage = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  if (value?.message && typeof value.message === 'string') {
    return value.message;
  }
  return 'Unknown error occurred';
};

// Replace all documents in a store atomically in a single transaction (clear + put)
const replaceDocuments = async (storeName, documentsArray) => {
  if (!Array.isArray(documentsArray) || !documentsArray.length) {
    return Promise.reject(
      new Error('Documents must be a non-empty array of objects.')
    );
  }

  if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
    return Promise.reject(new Error('Store name must be a valid string.'));
  }

  const activeDb = db || (await openIndexedDB());

  return new Promise((resolve) => {
    const txn = activeDb.transaction(storeName, 'readwrite');
    const store = txn.objectStore(storeName);

    // Queue clear then all puts in the same transaction — executed atomically
    store.clear();
    documentsArray.forEach((doc) => {
      store.put(doc);
    });

    txn.oncomplete = () => {
      const updateTime = new Date().toISOString();
      if (activeDb.objectStoreNames.contains('meta-data')) {
        try {
          activeDb
            .transaction('meta-data', 'readwrite')
            .objectStore('meta-data')
            .put({ key: `${storeName}-lastUpdated`, value: updateTime });
        } catch {
          // Ignore metadata errors — main write already committed.
        }
      }
      resolve({
        success: true,
        message: `Store ${storeName} replaced successfully!`,
        storage: 'local',
        data: documentsArray,
        updatedAt: updateTime,
      });
    };

    txn.onerror = (event) => {
      resolve({
        success: false,
        message: `Error replacing store ${storeName}: ${event.target.error}`,
        storage: 'local',
        error: event.target.error,
      });
    };
  });
};
export {
  openIndexedDB,
  addDocuments,
  upsertDocuments,
  replaceDocuments,
  deleteDocuments,
  clearStore,
  getAllDocuments,
  getDocumentsByKeys,
  getDocumentsByParameters,
  getErrorMessage,
};
