//function to verify name input
export function verifyName(name) {
  const verified = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name);
  if (verified && name !== null && name !== undefined && name !== '') {
    return { passed: true, message: 'Name is valid.' };
  } else {
    return {
      passed: false,
      message:
        'Invalid character in name format.  Please ensure the name contains only letters, spaces, and common punctuation.',
    };
  }
}

//function to verify email input
export function verifyEmail(email) {
  const verified = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email
  );
  if (verified && email !== null && email !== undefined && email !== '') {
    return { passed: true, message: 'Email is valid.' };
  } else {
    return {
      passed: false,
      message: 'Invalid email format. Please enter a valid email address.',
    };
  }
}

//function to verify international phone number input
export function verifyPhoneNumber(phoneNumber) {
  const verified = /^\+(?:[0-9] ?){6,14}[0-9]$/.test(phoneNumber);
  if (
    verified &&
    phoneNumber !== null &&
    phoneNumber !== undefined &&
    phoneNumber !== ''
  ) {
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
}

//function to verify input text
export function verifyInputText(inputText) {
  if (inputText === null || inputText === undefined) {
    return { passed: false, message: 'Input is required.' };
  }

  const value = String(inputText).trim();
  if (value.length === 0) {
    return { passed: false, message: 'Input cannot be empty.' };
  }

  // More permissive regex that allows most common text characters
  const allowed = /^[A-Za-z0-9\s.,''""’’&@#$%*()[\]{}|<>?!;:_/+\-=]*$/;
  const verified = allowed.test(value);

  //if (!verified) {
  //  // Find invalid characters for debugging
  //  const invalidChars = value.split('')
  //    .filter(char => !char.match(allowed))
  //    .join('');
  //
  //  console.log('Invalid characters found:', invalidChars);
  //  console.log('Full input:', value);
  //}

  return {
    passed: verified,
    message: verified
      ? 'Input text is valid.'
      : 'Invalid character in text input. Only letters, numbers, spaces, and common punctuation allowed.',
  };
}
