import countryToCurrency from 'country-to-currency';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });

const getSymbol = (code) => {
  try {
    return (
      new Intl.NumberFormat('en', {
        style: 'currency',
        currency: code,
        currencyDisplay: 'narrowSymbol',
      })
        .formatToParts(0)
        .find((p) => p.type === 'currency')?.value || code
    );
  } catch {
    return code;
  }
};

export const ALL_COUNTRIES = Object.entries(countryToCurrency)
  .map(([code, currencyCode]) => {
    let name;
    try {
      name = regionNames.of(code);
    } catch {
      return null;
    }
    if (!name || name === code || !currencyCode) return null;

    return {
      name,
      code,
      currency: {
        code: currencyCode,
        symbol: getSymbol(currencyCode),
        name: currencyNames.of(currencyCode) || currencyCode,
      },
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

// Detect country without any network call (e.g. "en-GB" -> "GB")
export const detectCountryFromLocale = () => {
  if (typeof navigator === 'undefined') return null;
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const lang of langs) {
    try {
      const region = new Intl.Locale(lang).maximize().region;
      if (region && countryToCurrency[region]) return region;
    } catch {}
  }
  return null;
};
