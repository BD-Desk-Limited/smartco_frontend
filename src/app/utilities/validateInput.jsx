//helper function to validate email input
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const result = emailRegex.test(email);

  if (!result) {
    return {
      error: 'please enter a valid email address',
      isValid: false,
    };
  }
  return {
    error: null,
    isValid: true,
  };
};

//helper function to validate phone number input
const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  const result = phoneRegex.test(phoneNumber);

  if (!result) {
    return {
      error:
        'phone number must be in international format starting with + and country code',
      isValid: false,
    };
  }
  return {
    error: null,
    isValid: true,
  };
};

//helper function to validate password input atleast 8 characters long and must contain a number, a special character and a capital letter
const validatePassword = (password) => {
  const errors = {
    length: 'password must be at least 8 characters long',
    capital: 'password must contain at least one capital letter',
    specialCharacter: 'password must contain at least one special character',
    number: 'password must contain at least one number',
  };

  const lengthValid = password.length >= 8;
  const capitalValid = /[A-Z]/.test(password);
  const specialCharacterValid = /[!@#$%^&*]/.test(password);
  const numberValid = /\d/.test(password);

  if (!lengthValid || !capitalValid || !specialCharacterValid || !numberValid) {
    return {
      error: {
        length: !lengthValid ? errors.length : null,
        capital: !capitalValid ? errors.capital : null,
        specialCharacter: !specialCharacterValid
          ? errors.specialCharacter
          : null,
        number: !numberValid ? errors.number : null,
      },
      isValid: false,
    };
  }
  return {
    error: null,
    isValid: true,
  };
};

export { validateEmail, validatePhoneNumber, validatePassword };
