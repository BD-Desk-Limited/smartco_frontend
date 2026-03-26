// functions to handle online and offline login
import { salesPointLoginService } from '@/services/authServices';
import { importSPKI, jwtVerify } from 'jose';

// helper function to derive a local encryption key
const deriveLocalKey = async (pin, staffId, deviceId) => {
  // Derive a local key from PIN, staffId, and deviceId
  const encoder = new TextEncoder();
  const salt = encoder.encode(`${staffId}:${deviceId}`);
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  // Derive an AES-GCM key for encrypting/decrypting the token
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 150_000, // slows brute force
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// function to encrypt token
const encryptToken = async (token, pin, staffId, deviceId) => {
  const key = await deriveLocalKey(pin, staffId, deviceId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(token)
  );
  return JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  });
};

// function to decrypt token
const decryptToken = async (encryptedPayload, pin, staffId, deviceId) => {
  const { iv, data } = JSON.parse(encryptedPayload);
  const key = await deriveLocalKey(pin, staffId, deviceId);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data)
  );
  return new TextDecoder().decode(decrypted);
};

// function to verify JWT with stored public key
const verifyJwtWithPublicKey = async (token) => {
  try {
    const publicKeyPem = localStorage.getItem('publicKey');
    if (!publicKeyPem) return null;
    const publicKey = await importSPKI(publicKeyPem, 'RS256');
    const { payload } = await jwtVerify(token, publicKey);
    return payload;
  } catch {
    return null;
  }
};

// function to set user from JWT payload
const setUserFromPayload = async (payload, body, setUser) => {
  const user = {
    ...payload,
    staffId: body.staffId,
  };
  setUser(user);
};

// Online login handler
const handleOnlineLogin = async (
  body,
  companyData,
  setError,
  setUser,
  router,
  toggleUserMode
) => {
  try {
    const response = await salesPointLoginService(body);

    if (response.error) {
      const hasOfflineAccess = !!localStorage.getItem(`token_${body.staffId}`);
      if (hasOfflineAccess) {
        await handleOfflineLogin(
          body,
          setUser,
          companyData,
          router,
          setError,
          toggleUserMode
        );
        return;
      }
      setError(response?.error);
      return;
    }

    if (response?.data) {
      setUser(response?.data?.user);
      const publicKey = response?.data?.publicKey;

      //save public key and token to local storage
      localStorage.setItem('publicKey', publicKey);

      // 2. Encrypt the token with the local key
      const encryptedToken = await encryptToken(
        response?.data?.token,
        body.pin,
        body.staffId,
        companyData?.authorizationToken
      );

      // 3. Store encrypted token for offline login purposes (localStorage)
      localStorage.setItem(`token_${body.staffId}`, encryptedToken);

      // Store token in sessionStorage for normal online usage (clears on tab close)
      sessionStorage.setItem('token', response?.data?.token);

      //update sellers info in local storage
      let sellersInfo = JSON.parse(localStorage.getItem('sellersInfo')) || [];

      //add new seller to the list
      const newSeller = {
        staffId: body.staffId,
        imageURL: response?.data?.user?.profilePictureUrl,
        name: response?.data?.user?.fullName,
        companyId: companyData?.id,
      };

      //check if the seller already exists
      const sellerIndex =
        sellersInfo &&
        sellersInfo?.findIndex((seller) => seller.staffId === body.staffId);

      if (sellerIndex === -1) {
        sellersInfo.push(newSeller);
      } else {
        sellersInfo[sellerIndex] = newSeller;
      }
      localStorage.setItem('sellersInfo', JSON.stringify(sellersInfo));
      toggleUserMode('online');
      router.push('/pages/account/sales-point');
    }
  } catch (error) {
    const hasOfflineAccess = !!localStorage.getItem(`token_${body.staffId}`);
    if (hasOfflineAccess) {
      await handleOfflineLogin(
        body,
        setUser,
        companyData,
        router,
        setError,
        toggleUserMode
      );
      return;
    }
    setError(
      error?.message || 'An unexpected error occurred. Please try again.'
    );
  }
};

const handleOfflineLogin = async (
  body,
  setUser,
  companyData,
  router,
  setError,
  toggleUserMode
) => {
  try {
    // Load encrypted token
    const encryptedPayload = localStorage.getItem(`token_${body.staffId}`);

    if (!encryptedPayload) {
      throw new Error(
        'No offline access for this user on this device, please connect to internet or use another device.'
      );
    }

    // Try to decrypt token
    const token = await decryptToken(
      encryptedPayload,
      body.pin,
      body.staffId,
      companyData?.authorizationToken
    );

    if (!token) {
      setError('Invalid login details');
      return;
    }

    // Verify token signature + expiry
    const payload = await verifyJwtWithPublicKey(token);

    if (!payload) {
      setError(
        'Offline access expired, please connect to internet or use another device.'
      );
      return;
    }

    // Login success
    await setUserFromPayload(payload, body, setUser);

    // Store decrypted token in sessionStorage for normal usage (API calls)
    sessionStorage.setItem('token', token);

    toggleUserMode('offline');
    router.push('/pages/account/sales-point');
  } catch (err) {
    setError(
      err?.message ||
        'You are offline. An unexpected error occurred. Please try again.'
    );
  }
};

export const login = async (
  e,
  body,
  setError,
  setLoading,
  setUser,
  router,
  companyData,
  toggleUserMode
) => {
  e.preventDefault();
  setError('');

  // Before validation
  if (!body.staffId || !body.staffId.trim()) {
    setError('Staff ID is required');
    return;
  }

  if (body.pin.length < 4) {
    setError('Pin must be at least 4 digits');
    return;
  }

  const isValid =
    /^[a-zA-Z0-9-\/]+$/.test(body.staffId) && /^[0-9]{4,}$/.test(body.pin);
  if (!isValid) {
    setError('Invalid Staff ID or Pin. Please check your input and try again.');
    return;
  }

  const isOnline = navigator.onLine;

  try {
    setLoading(true);
    //check if online or offline
    if (isOnline) {
      console.log('Attempting online login, its online', isOnline);
      await handleOnlineLogin(
        body,
        companyData,
        setError,
        setUser,
        router,
        toggleUserMode
      );
    } else {
      console.log('Attempting offline login, its offline', isOnline);
      await handleOfflineLogin(
        body,
        setUser,
        companyData,
        router,
        setError,
        toggleUserMode
      );
    }
  } catch (error) {
    setError(
      error?.message || 'An unexpected error occurred. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};
