import React, { useState, useEffect, useMemo } from 'react';
import { ALL_COUNTRIES, detectCountryFromLocale } from '@/utilities/countries';

const CurrencyLocationMatch = ({ dataObject, setDataObject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedCode, setSuggestedCode] = useState(null);

  useEffect(() => {
    const set = () => {
      setSuggestedCode(detectCountryFromLocale());
    };
    set();
  }, []);

  // Suggested country first, then alphabetical
  const countries = useMemo(() => {
    if (!suggestedCode) return ALL_COUNTRIES;
    return [...ALL_COUNTRIES].sort(
      (a, b) =>
        (b.code === suggestedCode) - (a.code === suggestedCode) ||
        a.name.localeCompare(b.name)
    );
  }, [suggestedCode]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setDataObject((prevData) => ({
      ...prevData,
      country: country.name,
      currency: {
        code: country.currency.code,
        symbol: country.currency.symbol,
        name: country.currency.name,
      },
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
      setDataObject((prevData) => ({
        ...prevData,
        country: '',
        currency: {
          code: '',
          symbol: '',
          name: '',
        },
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
      <label
        htmlFor="country"
        className="w-full text-left text-sm font-semibold text-text-gray"
      >
        Country
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="country"
          name="country"
          value={isOpen ? searchTerm : dataObject.country || searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={'Select or search for a country...'}
          className={`w-full border-2 rounded-sm px-4 h-8 items-center drop-shadow-md focus:outline-brand-blue text-md border-[#DDDDDD] ${
            dataObject.country?.length ? 'border-brand-blue' : ''
          } focus-within:border-brand-blue`}
        />

        {/* Clear button */}
        {(dataObject.country || searchTerm) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setDataObject((prevData) => ({
                ...prevData,
                country: '',
                currency: { code: '', symbol: '', name: '' },
              }));
              setIsOpen(false);
            }}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
          >
            ×
          </button>
        )}

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{country.name}</span>
                    {country.code === suggestedCode && !searchTerm && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        Suggested
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {country.currency.symbol} {country.currency.code}
                  </span>
                </div>
              ))
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
            <span className="font-semibold">Selected Currency:</span>{' '}
            {dataObject.currency.name} ({dataObject.currency.symbol}{' '}
            {dataObject.currency.code})
          </p>
        </div>
      )}
    </>
  );
};

export default CurrencyLocationMatch;
