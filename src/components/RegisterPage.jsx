import React, { useState } from "react";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";

const RegisterPage = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // States for handling messages
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    // Reset messages on new submission
    setError("");
    setSuccessMessage("");

    try {
      // Send a POST request to your new backend endpoint
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If server responds with an error (e.g., user exists)
        throw new Error(data.msg || 'Something went wrong');
      }

      // On success, show welcome message
      setSuccessMessage(`Welcome, ${username}! Your account has been created.`);
      
      // Clear the form fields
      setUsername("");
      setEmail("");
      setPassword("");

    } catch (err) {
      // Set the error message to display it in the form
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
          <FiX size={24} />
        </button>

        {successMessage ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-700">{successMessage}</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Create an Account
            </h2>
            <form onSubmit={handleRegister}>
              {/* ... (Your form inputs for username, email, and password are the same) ... */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
                <input id="username" type="text" placeholder="e.g., jatin_tulswani" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input id="email" type="text" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-6">
                <label htmlFor="text" className="block text-gray-700 font-semibold mb-2">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
              </div>
              
              {/* Display error message if any */}
              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                Register
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;