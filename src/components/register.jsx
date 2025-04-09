import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import citiesData from "../data/israeli_cities.json";
import LanguageToggle from "../components/LanguageToggle"; // Adjust the path as needed

const professionOptions = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Technician'];

const isValidHebrew = (text) => /^[\u0590-\u05FF]{1,10}$/.test(text);
const isValidPhone = (text) => /^[0-9]{10}$/.test(text);

const Register = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    // Set the imported JSON data to the state.
    setCityOptions(citiesData);
    console.log("🏙️ Cities loaded:", citiesData);
  }, []);

  const handleRegister = async () => {
    if (!isValidHebrew(firstName) || !isValidHebrew(lastName)) {
      setError(t('register.errors.invalidName'));
      return;
    }
    if (!isValidPhone(phone)) {
      setError(t('register.errors.invalidPhone'));
      return;
    }
    if (!profession) {
      setError(t('register.errors.emptyProfession'));
      return;
    }
    if (!city) {
      setError(t('register.errors.emptyCity'));
      return;
    }
    if (password.length < 6) {
      setError(t('register.errors.invalidPassword'));
      return;
    }

    setError("");

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        phone,
        profession,
        city,
        email,
        password,
      };

      const response = await axios.post("http://localhost:8000/register", userData);
      console.log("✅ Registration successful:", response.data);
      setSuccess(true);
    } catch (error) {
      console.error("❌ Registration error:", error);
      setError(error.response?.data?.error || t('register.errors.default'));
    }
  };

  const handleOk = () => {
    setSuccess(false);
    if (onClose) onClose(); // Close modal if provided.
  };

  return (
    <div className="h-full flex items-center justify-center" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      {success ? (
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
          <div className="text-green-500 text-4xl mb-4">✔</div>
          <h2 className="text-2xl font-bold mb-4">{t('register.successTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('register.successText')}</p>
          <button
            onClick={handleOk}
            className="px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
          >
            {t('register.ok')}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          {/* Header container with conditional flex direction */}
          <div className={`flex items-center justify-between mb-6 ${i18n.language === 'he' ? 'flex-row-reverse text-right' : ''}`}>
            <h3 className="w-full text-center text-2xl font-bold text-gray-800">
              {t('register.title')}
            </h3>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="space-y-4">
            <input
              type="text"
              placeholder={t('register.firstName')}
              value={firstName}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 10 && /^[\u0590-\u05FF]*$/.test(value)) {
                  setFirstName(value);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder={t('register.lastName')}
              value={lastName}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 10 && /^[\u0590-\u05FF]*$/.test(value)) {
                  setLastName(value);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="tel"
              placeholder={t('register.phone')}
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                if (digits.length <= 10) setPhone(digits);
              }}
              className={`w-full p-2 border border-gray-300 rounded ${i18n.language === "he" ? "text-right" : "text-left"}`}
            />
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">{t('register.selectProfession')}</option>
              {professionOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">{t('register.selectCity')}</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="email"
              placeholder={t('register.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder={t('register.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
            >
              {t('register.registerButton')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
