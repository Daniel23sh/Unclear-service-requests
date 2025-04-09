import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  // Close dropdown if click outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={toggleRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
      >
        <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-gray-700" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
          <button
            onClick={() => selectLanguage('en')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            English
          </button>
          <button
            onClick={() => selectLanguage('he')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            עברית
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
