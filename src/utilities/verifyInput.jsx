//function to verify name input
export function verifyName(name) {
  const verified = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name);
  if (verified) {
    return { passed: true, message: 'Name is valid.' };
  } else {
    return { passed: false, message: 'Invalid character in name format.' };
  }
}

//function to verify email input
export function verifyEmail(email) {
  const verified = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email
  );
  if (verified) {
    return { passed: true, message: 'Email is valid.' };
  } else {
    return { passed: false, message: 'Invalid email format.' };
  }
}

//function to verify international phone number input
export function verifyPhoneNumber(phoneNumber) {
  const verified = /^\+(?:[0-9] ?){6,14}[0-9]$/.test(phoneNumber);
  if (verified) {
    return { passed: true, message: 'International phone number is valid.' };
  } else {
    return {
      passed: false,
      message: 'Invalid international phone number format.',
    };
  }
}

//function to verify password input
export function verifyPassword(password) {
  const verifyLength = password.length >= 8;
  const verifyContainsUpperCase = /[A-Z]/.test(password);
  const verifyContainsSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(
    password
  );

  return {
    passed:
      verifyLength && verifyContainsUpperCase && verifyContainsSpecialCharacter,
    verifyLength,
    verifyContainsUpperCase,
    verifyContainsSpecialCharacter,
    message: !verifyLength
      ? 'Password must be at least 8 characters long.'
      : !verifyContainsUpperCase
        ? 'Password must contain at least one uppercase letter.'
        : !verifyContainsSpecialCharacter
          ? 'Password must contain at least one special character.'
          : 'Password is valid.',
  };
};

//function to verify input text
export function verifyInputText(inputText) {
  const verified = /^[a-zA-Z0-9\s.,'-_]*$/.test(inputText);
  if (verified) {
    return { passed: true, message: 'Input text is valid.' };
  } else {
    return { passed: false, message: 'Invalid character in text input.' };
  }
};



