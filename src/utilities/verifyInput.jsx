//function to verify name input
export function verifyName(name) {
    const verified = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name);
    if (verified) {
        return true;
    } else {
        return "Invalid name format.";
    }
}

//function to verify email input
export function verifyEmail(email) {
    const verified = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (verified) {
        return true;
    } else {
        return "Invalid email format.";
    }
}

//function to verify international phone number input
export function verifyPhoneNumber(phoneNumber) {
    const verified = /^\+(?:[0-9] ?){6,14}[0-9]$/.test(phoneNumber);
    if (verified) {
        return true;
    } else {
        return "Invalid international phone number format.";
    }
}

//function to verify password input
export function verifyPassword(password) {
    const verified = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    if (verified) {
        return true;
    } else {
        return "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.";
    }
};