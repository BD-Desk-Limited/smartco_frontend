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
      display: 'Invalid Time'
    };
  }

  return {
    isValid: true,
    display: cleanTime
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