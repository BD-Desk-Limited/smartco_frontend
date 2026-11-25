/**
 * Validates and formats Excel time input
 * @param {string} timeString - Time string from Excel (expected format: HH:MMAM/PM)
 * @returns {{ isValid: boolean, display: string }} Validation result and display string
 */
export const validateExcelTime = (timeString) => {
  if (!timeString) {
    return { isValid: false, display: 'N/A' };
  }

  // Remove any whitespace and convert to uppercase
  const cleanTime = timeString.trim().toUpperCase();

  // Regular expression for HH:MMAM/PM format
  const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])(AM|PM)$/;

  if (!timeRegex.test(cleanTime)) {
    return {
      isValid: false,
      display: 'Invalid Time',
    };
  }

  return {
    isValid: true,
    display: cleanTime,
  };
};

/**
 * Formats time string for business hours display
 * @param {string} timeString - The time string to format
 * @returns {{ isValid: boolean, display: string }} Formatted time with validation status
 */
export const formatBusinessHours = (timeString) => {
  return validateExcelTime(timeString);
};

export const ISOStringToLocalTime = (dateString) => {
  return dateString
    ? new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';
};

/**
 * Formats a date object into a YYYY-MM-DD string
 * @param {Date} date - The date object to format
 * @returns {string} The formatted date string
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toYMD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Returns the current date (local) as a yyyy-mm-dd string
 * @returns {string}
 */
export const getDateNow = () => toYMD(new Date());

/**
 * Returns the first day of the current month (local) as a yyyy-mm-dd string
 * @returns {string}
 */
export const getFirstDayOfMonth = () => {
  const now = new Date();
  return toYMD(new Date(now.getFullYear(), now.getMonth(), 1));
};
