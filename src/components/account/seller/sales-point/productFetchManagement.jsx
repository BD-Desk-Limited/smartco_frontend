import { getProductsByBranchIdService } from '@/services/productsServices';
import {
  replaceDocuments,
  getAllDocuments,
  getDocumentsByParameters,
  getErrorMessage,
} from '@/utilities/indexedDBManagement';
const INDEXED_DB_STORE_NAME = 'products';
const INDEXED_DB_META_STORE_NAME = 'meta-data';

const fetchProductsFromAPI = async (branchId) => {
  /* API call to fetch products from server, and update indexedDB with the new data, then return the stored result from indexedDB to ensure local data is always in sync with the server source of truth. if indexedDB update fails, log the error but still return the fetched products, availability is priority now.*/

  try {
    const response = await getProductsByBranchIdService(branchId);
    if (response?.error) {
      console.error('API error fetching products:', response.error);
      throw new Error(response.error);
    }

    if (response?.data) {
      const fetchedProducts = await response.data;

      //update indexedDB with new products and return the stored result
      const updateResult = await updateProductsInIndexedDB(fetchedProducts);
      if (!updateResult?.products) {
        console.error(
          'Failed to persist fetched products to IndexedDB. Returning fetched products without persistence:',
          getErrorMessage(updateResult?.error || updateResult?.message)
        );
        return fetchedProducts; //fallback to returning fetched products even if IndexedDB update fails, to avoid total failure of product loading
      } else {
        return updateResult.products;
      }
    } else {
      console.error('Unexpected API response structure:', response);
      throw new Error('Unexpected API response structure');
    }
  } catch (err) {
    console.error('Error loading products:', err);
    throw err;
  }
};

const fetchProductsDataFromIndexedDB = async () => {
  try {
    const responseData = await getAllDocuments(INDEXED_DB_STORE_NAME);
    const metaData = await getDocumentsByParameters(
      INDEXED_DB_META_STORE_NAME,
      [{ key: `${INDEXED_DB_STORE_NAME}-lastUpdated` }]
    );

    if (responseData.success) {
      const result = {
        updatedAt: metaData?.data?.[0]?.value || null,
        success: responseData.success,
        products: responseData.data || [],
      };
      return result;
    } else {
      console.error('Failed to fetch products from IndexedDB');
      return { success: false, products: [] };
    }
  } catch (err) {
    console.error('Error fetching products from IndexedDB:', err);
    return { success: false, products: [] };
  }
};

const updateProductsInIndexedDB = async (products) => {
  try {
    const productsArray = Array.isArray(products) ? products : [];
    const validProducts = productsArray.filter(
      (product) => product && product._id !== undefined && product._id !== null
    );
    const uniqueProducts = Array.from(
      new Map(
        validProducts.map((product) => [String(product._id), product])
      ).values()
    );

    //update products in IndexDB atomically (clear + put in one transaction)
    if (uniqueProducts.length === 0) {
      return {
        updatedAt: new Date().toISOString(),
        productsUpdated: 0,
        products: [],
      };
    }

    const response = await replaceDocuments(
      INDEXED_DB_STORE_NAME,
      uniqueProducts
    );

    if (response.success) {
      const persistedProductsResponse = await getAllDocuments(
        INDEXED_DB_STORE_NAME
      );
      if (!persistedProductsResponse?.success) {
        console.error(
          'Products wrote but could not be re-read from IndexedDB:',
          getErrorMessage(
            persistedProductsResponse?.error ||
              persistedProductsResponse?.message
          )
        );
        return null;
      }

      const result = {
        updatedAt: response.updatedAt,
        productsUpdated: persistedProductsResponse?.data?.length || 0,
        products: persistedProductsResponse?.data || [],
      };
      return result;
    } else {
      console.error(
        'Failed to update products in IndexedDB:',
        getErrorMessage(response?.error || response?.message)
      );
      return null;
    }
  } catch (err) {
    console.error(
      'Error updating products in IndexedDB:',
      getErrorMessage(err)
    );
    return null;
  }
};

const loadProducts = async (branchId, forceRefresh) => {
  try {
    // Load products from indexedDB or API based on last refresh time
    const DBData = await fetchProductsDataFromIndexedDB();
    const now = new Date().getTime(); // Current timestamp
    // If last refresh was more than 24 hours ago, fetch from API, otherwise load from indexedDB
    if (
      forceRefresh ||
      !DBData?.updatedAt ||
      !DBData?.products ||
      !DBData?.success ||
      DBData?.products?.length === 0 ||
      now - new Date(DBData.updatedAt).getTime() > 24 * 60 * 60 * 1000
    ) {
      const fetchedProducts = await fetchProductsFromAPI(branchId);
      //update indexedDB with new products and return the stored result
      const updateResult = await updateProductsInIndexedDB(fetchedProducts);
      if (!updateResult?.products) {
        throw new Error(
          'Force refresh fetched products but failed to persist to IndexedDB.'
        );
      }
      return updateResult.products;
    } else {
      const indexedDBProducts = await fetchProductsDataFromIndexedDB();
      return indexedDBProducts?.products || [];
    }
  } catch (err) {
    console.error('Error loading products:', err);
    throw err;
  }
};

// fetch products without meta data
const fetchProductsFromIndexedDB = async () => {
  try {
    const indexedDBData = await fetchProductsDataFromIndexedDB();
    return indexedDBData?.products || [];
  } catch (err) {
    console.error('Error fetching products from IndexedDB:', err);
    throw err;
  }
};

export { fetchProductsFromAPI, fetchProductsFromIndexedDB, loadProducts };
