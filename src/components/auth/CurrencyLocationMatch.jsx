import React, { useState, useEffect } from 'react';

const CurrencyLocationMatch = ({ dataObject, setDataObject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  // Regional neighboring countries mapping
  const getNeighboringCountries = (countryCode) => {
    const regions = {
      // North America
      'US': ['CA', 'MX', 'GB', 'AU'],
      'CA': ['US', 'GB', 'AU', 'FR'],
      'MX': ['US', 'GT', 'BZ', 'ES'],
      
      // West Africa
      'NG': ['BJ', 'NE', 'TD', 'CM', 'GH', 'TG'],
      'GH': ['CI', 'BF', 'TG', 'NG', 'LR'],
      'CI': ['LR', 'GN', 'ML', 'BF', 'GH'],
      'SN': ['GM', 'GN', 'ML', 'MR'],
      
      // East Africa
      'KE': ['UG', 'TZ', 'ET', 'SO', 'SS'],
      'TZ': ['KE', 'UG', 'RW', 'BI', 'ZM', 'MW'],
      'ET': ['ER', 'DJ', 'SO', 'KE', 'SS', 'SD'],
      'UG': ['KE', 'TZ', 'RW', 'CD', 'SS'],
      
      // Southern Africa
      'ZA': ['NA', 'BW', 'ZW', 'MZ', 'SZ', 'LS'],
      'ZW': ['ZA', 'BW', 'ZM', 'MZ'],
      'BW': ['ZA', 'NA', 'ZM', 'ZW'],
      
      // Europe
      'GB': ['IE', 'FR', 'NL', 'BE', 'US', 'CA'],
      'DE': ['FR', 'NL', 'BE', 'LU', 'CH', 'AT', 'CZ', 'PL', 'DK'],
      'FR': ['GB', 'BE', 'LU', 'DE', 'CH', 'IT', 'ES'],
      'IT': ['FR', 'CH', 'AT', 'SI', 'SM', 'VA'],
      'ES': ['FR', 'PT', 'AD', 'MX', 'AR'],
      
      // Asia
      'IN': ['PK', 'CN', 'NP', 'BT', 'BD', 'MM', 'LK'],
      'CN': ['IN', 'PK', 'AF', 'KG', 'KZ', 'MN', 'RU', 'KP', 'MM', 'LA', 'VN'],
      'JP': ['KR', 'CN', 'RU', 'US'],
      'KR': ['KP', 'CN', 'JP'],
      
      // Middle East
      'AE': ['SA', 'OM', 'QA', 'BH', 'KW', 'IR'],
      'SA': ['AE', 'OM', 'YE', 'QA', 'BH', 'KW', 'IQ', 'JO'],
      'EG': ['LY', 'SD', 'PS', 'IL', 'SA', 'JO'],
      
      // South America
      'BR': ['AR', 'UY', 'PY', 'BO', 'PE', 'CO', 'VE', 'GY', 'SR', 'GF'],
      'AR': ['BR', 'UY', 'PY', 'BO', 'CL'],
      'CO': ['VE', 'BR', 'PE', 'EC', 'PA'],
      
      // Oceania
      'AU': ['NZ', 'PG', 'ID', 'US', 'GB'],
      'NZ': ['AU', 'FJ', 'NC']
    };
    
    return regions[countryCode] || [];
  };

  // Detect user's location via IP
  const detectUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const text = await response.text();
        try {
          const locationData = JSON.parse(text);
          setUserLocation({
            country: locationData.country_name,
            countryCode: locationData.country_code,
            city: locationData.city
          });
          return locationData.country_code;
        } catch (jsonError) {
          console.error('Invalid JSON response from ipapi:', text);
          return null;
        }
      }
    } catch (error) {
      console.error('Could not detect ipapi location:', error);
    }
    return null;
  };

  // Generate smart fallback countries based on user location
  const generateSmartFallbacks = (userCountryCode) => {
    const baseFallbacks = [
      { name: 'United States', code: 'US', currency: { code: 'USD', symbol: '$', name: 'US Dollar' } },
      { name: 'United Kingdom', code: 'GB', currency: { code: 'GBP', symbol: '£', name: 'British Pound' } },
      { name: 'Nigeria', code: 'NG', currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' } },
      { name: 'Canada', code: 'CA', currency: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' } },
      { name: 'Australia', code: 'AU', currency: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' } },
      { name: 'Germany', code: 'DE', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
      { name: 'France', code: 'FR', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
      { name: 'Japan', code: 'JP', currency: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' } },
      { name: 'India', code: 'IN', currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' } },
      { name: 'Brazil', code: 'BR', currency: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' } }
    ];

    if (!userCountryCode) return baseFallbacks;

    // Get country-specific fallbacks based on location
    const countryFallbacks = {
      'NG': [
        { name: 'Nigeria', code: 'NG', currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' } },
        { name: 'Ghana', code: 'GH', currency: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' } },
        { name: 'Benin', code: 'BJ', currency: { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' } },
        { name: 'Cameroon', code: 'CM', currency: { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc' } },
        { name: 'United Kingdom', code: 'GB', currency: { code: 'GBP', symbol: '£', name: 'British Pound' } }
      ],
      'US': [
        { name: 'United States', code: 'US', currency: { code: 'USD', symbol: '$', name: 'US Dollar' } },
        { name: 'Canada', code: 'CA', currency: { code: 'CAD', symbol: '$', name: 'Canadian Dollar' } },
        { name: 'Mexico', code: 'MX', currency: { code: 'MXN', symbol: '$', name: 'Mexican Peso' } },
        { name: 'United Kingdom', code: 'GB', currency: { code: 'GBP', symbol: '£', name: 'British Pound' } },
        { name: 'Australia', code: 'AU', currency: { code: 'AUD', symbol: '$', name: 'Australian Dollar' } }
      ],
      'GB': [
        { name: 'United Kingdom', code: 'GB', currency: { code: 'GBP', symbol: '£', name: 'British Pound' } },
        { name: 'Ireland', code: 'IE', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
        { name: 'France', code: 'FR', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
        { name: 'Germany', code: 'DE', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
        { name: 'United States', code: 'US', currency: { code: 'USD', symbol: '$', name: 'US Dollar' } }
      ]
    };

    return countryFallbacks[userCountryCode] || baseFallbacks;
  };

  // Fetch countries data from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        
        // Detect user location first
        const userCountryCode = await detectUserLocation();
        
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,currencies,cca2'
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          console.error('Invalid JSON response from REST Countries:', text);
          throw new Error('Invalid JSON response from countries API');
        }
        
        // Transform the data to our format
        const formattedCountries = data
          .map(country => {
            const countryName = country.name.common;
            const currencies = country.currencies;
            
            // Get the first currency (most countries have one primary currency)
            const currencyKey = currencies ? Object.keys(currencies)[0] : null;
            const currency = currencyKey ? currencies[currencyKey] : null;
            
            return {
              name: countryName,
              code: country.cca2,
              currency: currency ? {
                code: currencyKey,
                symbol: currency.symbol || '',
                name: currency.name || currencyKey
              } : {
                code: '',
                symbol: '',
                name: ''
              }
            };
          })
          .filter(country => country.currency.code)
          .sort((a, b) => {
            // Prioritize user's country and neighboring countries
            if (userCountryCode) {
              const neighbors = [userCountryCode, ...getNeighboringCountries(userCountryCode)];
              const aIsNeighbor = neighbors.includes(a.code);
              const bIsNeighbor = neighbors.includes(b.code);
              
              if (aIsNeighbor && !bIsNeighbor) return -1;
              if (!aIsNeighbor && bIsNeighbor) return 1;
              if (a.code === userCountryCode) return -1;
              if (b.code === userCountryCode) return 1;
            }
            
            return a.name.localeCompare(b.name);
          });
        
        setCountries(formattedCountries);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again later.');
        
        // Use smart fallbacks based on user location
        const userCountryCode = userLocation?.countryCode;
        const smartFallbacks = generateSmartFallbacks(userCountryCode);
        setCountries(smartFallbacks);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [userLocation?.countryCode]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setDataObject(prevData => ({
      ...prevData,
      country: country.name,
      currency: {
        code: country.currency.code,
        symbol: country.currency.symbol,
        name: country.currency.name
      }
    }));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    
    // Clear selected country when user starts typing
    if (dataObject.country && value !== dataObject.country) {
      setDataObject(prevData => ({
        ...prevData,
        country: '',
        currency: {
          code: '',
          symbol: '',
          name: ''
        }
      }));
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // If there's a selected country, clear the search term so user can type
    if (dataObject.country) {
      setSearchTerm('');
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <>
      <label htmlFor="country" className='w-full text-left text-sm font-semibold text-text-gray'>
        Country {userLocation && (
          <span className="text-xs text-gray-500 font-normal">
            (Detected: {userLocation.city}, {userLocation.country})
          </span>
        )}
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="country"
          name="country"
          value={isOpen ? searchTerm : (dataObject.country || searchTerm)}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={loading ? "Loading countries..." : "Select or search for a country..."}
          disabled={loading}
          className={`w-full border-2 rounded-sm px-4 h-8 items-center drop-shadow-md focus:outline-brand-blue text-md border-[#DDDDDD] ${
            dataObject.country?.length ? 'border-brand-blue' : ''
          } focus-within:border-brand-blue ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        
        {/* Clear button */}
        {(dataObject.country || searchTerm) && !loading && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setDataObject(prevData => ({
                ...prevData,
                country: '',
                currency: { code: '', symbol: '', name: '' }
              }));
              setIsOpen(false);
            }}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
          >
            ×
          </button>
        )}
        
        {loading && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute z-50 w-full mt-1 bg-red-50 border-2 border-red-200 rounded-md p-2">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {isOpen && !loading && !error && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => {
                const isUserCountry = userLocation?.countryCode === country.code;
                const isNeighboring = userLocation?.countryCode && 
                  getNeighboringCountries(userLocation.countryCode).includes(country.code);
                
                return (
                  <div
                    key={country.code + '-' + index}
                    onClick={() => handleCountrySelect(country)}
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex justify-between items-center ${
                      isUserCountry ? 'bg-blue-100 border-blue-200' : 
                      isNeighboring ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{country.name}</span>
                      {isUserCountry && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          Your Location
                        </span>
                      )}
                      {isNeighboring && !isUserCountry && (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                          Nearby
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {country.currency.symbol} {country.currency.code}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        )}
      </div>
      
      {dataObject.country && dataObject.currency.code && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Selected Currency:</span> {dataObject.currency.name} ({dataObject.currency.symbol} {dataObject.currency.code})
          </p>
        </div>
      )}
    </>
  );
};

export default CurrencyLocationMatch;