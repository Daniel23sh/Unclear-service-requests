import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import citiesData from "../data/israeli_cities.json";
import Select from 'react-select';
import axios from "axios";


const professionOptions = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Technician'];

const isValidHebrew = (text) => /^[\u0590-\u05FF]{1,10}$/.test(text);
const isValidPhone = (text) => /^[0-9]{10}$/.test(text);

const LoginPage = ({ show, onClose }) => {
  const { t, i18n } = useTranslation();
  const [rightPanelActive, setRightPanelActive] = useState(false);

  // Registration state
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

    // Login state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");


useEffect(() => {
    // Set the imported JSON data to the state.
    setCityOptions(citiesData);
    console.log("🏙️ Cities loaded:", citiesData);
  }, []); 

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        onClose && onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);
  
  const handleRegister = async () => {
    if (!isValidHebrew(firstName) || !isValidHebrew(lastName)) {
      setError(t('register.errors.invalidName'));
      return;
    }
    if (!isValidPhone(phone)) {
      setError(t('register.errors.invalidPhone'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('register.errors.invalidEmail'));
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
    // Simulate registration success. Replace with an API call if needed.

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
      setFirstName("");
      setLastName("");
      setPhone("");
      setProfession("");
      setCity("");
      setEmail("");
      setPassword("");
      setSuccess(true);
    } catch (error) {
      console.error("❌ Registration error:", error);
      let errorMsg = error.response?.data?.detail || "An error occurred";
      errorMsg = errorMsg.replace(/^Server error:\s*\d+:\s*/, ""); // Remove the "Server error: ###:" prefix.
      setError(errorMsg);
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    try {
      const resp = await axios.post("http://localhost:8000/login", {
        email: loginEmail,
        password: loginPassword,
      });
      console.log("✅ Login successful:", resp.data);
      setSuccess(true)
      // Close modal or navigate on success
      onClose && onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      setLoginError(msg);
    }
  };

  const handleOk = () => {
    setSuccess(false);
    if (onClose) onClose();
  };

  const handleSignUpClick = () => setRightPanelActive(true);
  const handleSignInClick = () => setRightPanelActive(false);

  if (!show) return null;

  const styles = `
    @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');
    
    * {
      box-sizing: border-box;
    }
    
    h1 {
      font-weight: bold;
      margin: 0;
    }
    
    h2 {
      text-align: center;
    }
    
    p {
      font-size: 14px;
      font-weight: 100;
      line-height: 20px;
      letter-spacing: 0.5px;
      margin: 20px 0 30px;
    }
    
    span {
      font-size: 12px;
    }
    
    a {
      color: #333;
      font-size: 14px;
      text-decoration: none;
      margin: 15px 0;
    }
    
    button {
      border-radius: 20px;
      border: 1px solid #8e24aa;
      background-color: #8e24aa;
      color: #FFFFFF;
      font-size: 12px;
      font-weight: bold;
      padding: 12px 45px;
      letter-spacing: 1px;
      text-transform: uppercase;
      transition: transform 80ms ease-in;
    }
    
    button:active {
      transform: scale(0.95);
    }
    
    button:focus {
      outline: none;
    }
    
    button.ghost {
      background-color: transparent;
      border-color: #FFFFFF;
    }
    
    form {
      background-color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 50px;
      height: 100%;
      text-align: center;
    }
    
    input {
      background-color: #eee;
      border: none;
      padding: 12px 15px;
      margin: 8px 0;
      width: 100%;
    }
    
    .container {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
                0 10px 10px rgba(0,0,0,0.22);
    position: relative;
    overflow: hidden;
    width: 1000px;       /* Increased width */
    max-width: 100%;
    min-height: 600px;  /* Increased min-height */
  }

    
    .form-container {
      position: absolute;
      top: 0;
      height: 100%;
      transition: all 0.6s ease-in-out;
    }
    
    .sign-in-container {
      left: 0;
      width: 50%;
      z-index: 2;
    }
    
    .container.right-panel-active .sign-in-container {
      transform: translateX(100%);
    }
    
    .sign-up-container {
      left: 0;
      width: 50%;
      opacity: 0;
      z-index: 1;
    }
    
    .container.right-panel-active .sign-up-container {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
      animation: show 0.6s;
    }
    
    @keyframes show {
      0%, 49.99% {
        opacity: 0;
        z-index: 1;
      }
      50%, 100% {
        opacity: 1;
        z-index: 5;
      }
    }
    
    .overlay-container {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      overflow: hidden;
      transition: transform 0.6s ease-in-out;
      z-index: 100;
    }
    
    .container.right-panel-active .overlay-container {
      transform: translateX(-100%);
    }
    
    .overlay {
      background: #8e24aa;
      background: -webkit-linear-gradient(to right, rgb(158,76,181), rgb(121,20,163));
      background: linear-gradient(to right, rgb(172,96,194), rgb(122,48,154));
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 0 0;
      color: #FFFFFF;
      position: relative;
      left: -100%;
      height: 100%;
      width: 200%;
      transform: translateX(0);
      transition: transform 0.6s ease-in-out;
    }
    
    .container.right-panel-active .overlay {
      transform: translateX(50%);
    }
    
    .overlay-panel {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 40px;
      text-align: center;
      top: 0;
      height: 100%;
      width: 50%;
      transform: translateX(0);
      transition: transform 0.6s ease-in-out;
    }
    
    .overlay-left {
      transform: translateX(-20%);
    }
    
    .container.right-panel-active .overlay-left {
      transform: translateX(0);
    }
    
    .overlay-right {
      right: 0;
      transform: translateX(0);
    }
    
    .container.right-panel-active .overlay-right {
      transform: translateX(20%);
    }
    
    .social-container {
      margin: 20px 0;
    }
    
    .social-container a {
      border: 1px solid #DDDDDD;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 0 5px;
      height: 40px;
      width: 40px;
    }
    
    footer {
      background-color: #222;
      color: #fff;
      font-size: 14px;
      bottom: 0;
      position: fixed;
      left: 0;
      right: 0;
      text-align: center;
      z-index: 999;
    }
    
    footer p {
      margin: 10px 0;
    }
    
    footer i {
      color: red;
    }
    
    footer a {
      color: #3c97bf;
      text-decoration: none;
    }
  `;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className={`container ${rightPanelActive ? "right-panel-active" : ""}`} id="container">
        {/* Conditional close button: left when in sign-in mode, right when in sign-up mode */}
        <button 
          onClick={onClose}
          className={`absolute top-2 ${rightPanelActive ? "right-2" : "left-2"} bg-purple-500 text-white px-2 py-1 rounded z-50`}
        >
          X
        </button>
       {/* Sign-up Container: Registration Form */}
<div className="form-container sign-up-container">
  <form className={`space-y-4 ${i18n.language === 'he' ? 'text-right' : 'text-left'}`}>
    {/* Header */}
    <h1>{i18n.language === 'he' ? "הרשמה" : "Sign Up"}</h1>
    
    {/* First Name and Last Name */}
    <div className="flex gap-4">
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
        className="w-1/2 p-2 border border-gray-300 rounded placeholder:text-sm"
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
        className="w-1/2 p-2 border border-gray-300 rounded placeholder:text-sm"
      />
    </div>
    
    {/* Email */}
    <input
      type="email"
      placeholder={t('register.email')}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded placeholder:text-sm"
    />
    
    {/* Phone and Password */}
    <div className="flex gap-4">
        <input
          type="tel"
          placeholder={t('register.phone')}
          value={phone}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            if (digits.length <= 10) setPhone(digits);
          }}
          className={`w-1/2 p-2 border border-gray-300 rounded placeholder:text-sm ${
            i18n.language === "he" ? "text-right" : "text-left"
          }`}
        />
        <input
          type="password"
          placeholder={t('register.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded placeholder:text-sm"
        />
      </div>
      
      {/* City and Profession */}
      <div className="flex gap-4">
  <select
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="w-[200px] p-2 border border-gray-300 rounded placeholder:text-sm"
  >
    <option value="">{t('register.selectCity')}</option>
    {cityOptions.map((c) => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
  <select
    value={profession}
    onChange={(e) => setProfession(e.target.value)}
    className="w-[190px] p-2 border border-gray-300 rounded placeholder:text-sm"
  >
    <option value="">{t('register.selectProfession')}</option>
    {professionOptions.map((p) => (
      <option key={p} value={p}>{p}</option>
    ))}
  </select>
</div>
      
      {/* Submission Button */}
<button onClick={handleSignUpClick} id="signUp">
                {i18n.language === 'he' ? "הרשם" : "Sign Up"}
              </button>
{error && <p className="text-red-500 mt-2">{error}</p>}

{success && (
  <div className="h-full flex items-center justify-center absolute inset-0 bg-white bg-opacity-90">
    <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
      <div className="text-green-500 text-4xl mb-4">✔</div>
      <h2 className="text-2xl font-bold mb-4">{t('register.successTitle')}</h2>
      <p className="text-gray-600 mb-6">{t('register.successText')}</p>
    </div>
  </div>
)}
    </form>
  </div>
        {/* Sign-in Container */}
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>

            <input  type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot your password?</a>
            <button onClick={handleLogin}>Sign In </button>
            {success && (
  <div className="h-full flex items-center justify-center absolute inset-0 bg-white bg-opacity-90">
    <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
      <div className="text-green-500 text-4xl mb-4">✔</div>
      <h2 className="text-2xl font-bold mb-4">{t('register.successTitle')}</h2>
      <p className="text-gray-600 mb-6">{t('register.successText')}</p>
    </div>
  </div>
)}
          </form>
        </div>
        {/* Overlay for toggling sign-in / sign-up */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={handleSignInClick} id="signIn">
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handleSignUpClick} id="signUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
