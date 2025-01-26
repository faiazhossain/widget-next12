import React, { useState, useEffect, useRef } from 'react';
import { setConfig, autocomplete } from 'barikoiapis';

const Autocomplete = ({ onSelect }) => {
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  if (!apiKey) {
    console.error('API key is missing! Please add it to your .env.local file.');
    return;
  }
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dropdownRef = useRef(null); // Reference for the dropdown

  useEffect(() => {
    setConfig({
      apiKey: apiKey,
      version: 'v2',
    });
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setIsDropdownVisible(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await autocomplete({ q: query, area: 'mirpur' });
        setResults(response.places);
        setIsDropdownVisible(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (result) => {
    setQuery(result.address);
    onSelect(result);
    setResults([]);
    setIsDropdownVisible(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (results.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const handleBlur = () => {
    // Close the dropdown after a short delay to allow the click event to register
    setTimeout(() => {
      setIsFocused(false);
      setIsDropdownVisible(false);
    }, 200);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search for places..."
        className="autocomplete-input"
      />

      {/* Loading spinner */}
      {isFocused && loading && (
        <div className="loading-spinner">Loading...</div>
      )}

      {/* Display results if available and dropdown is visible */}
      {isFocused && isDropdownVisible && results.length > 0 && (
        <div ref={dropdownRef} className="autocomplete-dropdown">
          {results.map((result, index) => (
            <div
              key={index}
              className="autocomplete-item"
              onClick={() => handleSelect(result)}
            >
              {result.address}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
