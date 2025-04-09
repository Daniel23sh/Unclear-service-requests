import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 py-2 shadow-sm">
      {/* Left side: logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 mr-2">
          <FontAwesomeIcon icon={faTools} size="2x" />
        </div>
        <h1 className="text-2xl font-bold">Helply</h1>
      </div>
      <div className="flex items-center gap-4">
      <ul className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <li className="cursor-pointer hover:text-blue-600 flex items-center">
            {t('tutors')} <span className="ml-1 text-blue-500"> </span>
          </li>
        </ul>
        </div>

      {/* Right side: menu items and action buttons */}
      <div className="flex items-center gap-4">
        <ul className="flex items-center gap-6 text-sm font-medium text-gray-700">

          <li className="cursor-pointer hover:text-blue-600">
            {t('joinAsPro')}
          </li>
        </ul>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors">
          {t('login')}
        </button>
        <LanguageToggle />
      </div>
    </nav>
  );
};

export default Navbar;
