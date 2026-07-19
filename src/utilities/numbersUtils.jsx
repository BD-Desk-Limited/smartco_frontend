// use case. commaNumberFormat(1234567) returns "1,234,567"
// use case. commaNumberFormat(1234.567, 2) returns "1,234.57"
export function commaNumberFormat(num, decimals = 0) {
  if (typeof num !== 'number' || Number.isNaN(num)) return null;
  if (typeof decimals !== 'number' || decimals < 0 || decimals > 100)
    return null;

  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
