import { deviceHeaders, getDeviceInfo } from '@/utilities/deviceInfo';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  console.error(
    'NEXT_PUBLIC_API_URL not set — API requests will be relative to this site.'
  );
}

const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

export const loginService = async (form) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, deviceInfo: getDeviceInfo() }),
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json().catch(() => ({}));
      // details: e.g. { wrongCompanyPassword, company } when the password is another company's
      return {
        error: errorData.message || 'Error logging in, please try again',
        details: errorData,
      };
    }
  } catch (error) {
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

// devices: [{ id, name, authorizationToken }] from this browser
// -> { data: [{ id, name, authorizationToken }] } the companies still trusting it
export const deviceCompaniesService = async (devices) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/device-companies`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          devices: devices.map((d) => ({
            companyId: d.id,
            authorizationToken: d.authorizationToken,
          })),
        }),
      }
    );
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload.companies || [] };
    return { error: payload.message || 'Could not check this device' };
  } catch {
    return { error: 'Network error' };
  }
};

// The device's authorization for one company, with its allowed branches
// -> { data: companyData } or { error }
export const checkDeviceAuthorizationService = async ({
  companyId,
  authorizationToken,
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/is-device-authorized`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, authorizationToken }),
      }
    );
    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.isAuthorized) return { data: payload.companyData };
    // unauthorized: the company no longer trusts this device (not a network problem)
    return {
      error: payload.message || 'This device is not authorized',
      unauthorized: response.status === 403 || payload.isAuthorized === false,
    };
  } catch {
    return { error: 'Network error' };
  }
};

export const authorizeDeviceService = async (body) => {
  const token = getToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/add-trusted-device`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error authorizing device, please try again' };
  }
};

export const requestPasswordResetService = async (emailOrPhone) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error requesting password reset, please try again' };
  }
};

export const verifyPasswordResetLinkService = async (token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-password-reset-link/${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error verifying password reset link, please try again' };
  }
};

// "Log out from all devices" link from the login notification email.
// -> { data: { message } } | { error, alreadyDone? } (alreadyDone: the link was used before)
export const logOutAllDevicesService = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/auth/logout-all-devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload };
    return {
      error: payload?.message || 'Something went wrong, please try again',
      alreadyDone: Boolean(payload?.alreadyDone),
    };
  } catch (error) {
    console.error('Log out of all devices failed:', error);
    return {
      error: 'Network error, please check your connection and try again',
    };
  }
};

// Reset password takes in the token, old password and the new password
export const resetPasswordService = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${body.token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error resetting password, please try again' };
  }
};

//signup service
export const signupService = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/companies/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error signing up, please try again' };
  }
};

//get user details
export const getUserService = async (token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...deviceHeaders(), // keeps this device's clock current on the sessions screen
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error getting user details, please try again' };
  }
};

//sales point login service
export const salesPointLoginService = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/sales-point-login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body, deviceInfo: getDeviceInfo() }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error logging in, please try again' };
  }
};

//sales point pin change service
export const changePinService = async (body) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/sales-point/change-pin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error resetting pin, please try again' };
  }
};
