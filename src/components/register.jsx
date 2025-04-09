import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({onClose}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!firstName || !lastName || !phone || !profession || !city || !email || !password) {
      setError("All fields are required!");
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
      console.log("📝 Registering user with the following data:");
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Phone:", phone);
      console.log("Profession:", profession);
      console.log("City:", city);
      console.log("Email:", email);
      console.log("Password:", password); // ⚠️ Only show in dev, never log in prod


      const response = await axios.post("http://localhost:8000/register", userData);
      console.log("Registration successful:", response.data);
      setSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  const handleOk = () => {
    setSuccess(false);
    if (onClose) onClose(); // closes the modal
  };

  return (  
    <div className="h-full flex items-center justify-center">
      {success ? (
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
          <div className="text-green-500 text-4xl mb-4">✔</div>
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">You have successfully registered as a professional.</p>
          <button
            onClick={handleOk}
            className="px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
          >
            OK
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Professional Registration</h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
            >
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
