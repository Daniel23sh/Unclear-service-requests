import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../images/logo1.png';
import RegisterModal from "./RegisterModal";
import LoginPage from "./loginpage";
import LanguageToggle from './LanguageToggle';

const Navbar = ({ setView }) => {
  const { t } = useTranslation();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleJoinAsPro = () => {
    // You may want to open the registration modal, or if you want the professionals view:
    setView("professionals");
    // setShowRegisterModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 border-b border-gray-200 flex items-center justify-between px-8 py-2 shadow-sm">
        {/* Left side: logo + "Our Professionals" */}
        <div className="flex items-center gap-6">
          <img src={logo} alt="Helply logo" className="h-12 w-auto" />
          <ul className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <li
              className="mt-2 cursor-pointer hover:text-purple-400 flex items-center"
              onClick={() => setView("professionals")}
            >
              {t('Pro')}
            </li>
          </ul>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <li className="cursor-pointer hover:text-purple-400" onClick={handleJoinAsPro}>
              {t('joinAsPro')}
            </li>
          </ul>
          <button 
            onClick={handleLogin} 
            className="bg-purple-400 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-600 transition-colors"
          >
            {t('login')}
          </button>
          <LanguageToggle />
        </div>
      </nav>

      {/* Modals */}
      <RegisterModal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <LoginPage show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Navbar;
