export const loginService = async (form) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      console.log('Error:', errorMessage);
      return { error: errorMessage };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'error logging in, please try again' };
  }
};

export const resendOTPService = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`,
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
    return { error: 'error resending OTP, please try again' };
  }
};

export const verifyOTPService = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
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
    return { error: 'error verifying OTP, please try again' };
  }
};

export const authorizeDeviceService = async (body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/add-trusted-device`,
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
      console.log('Response:', responseData);
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
