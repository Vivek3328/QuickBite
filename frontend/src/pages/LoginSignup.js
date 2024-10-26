import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/home.jpg";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignup((prevState) => !prevState);
    setFormData({ name: "", email: "", password: "" });
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/userauth/registeruser`,
          formData
        );
        console.log("Signup Successful:", response);
        setIsSignup(false);
        setFormData({ name: "", email: "", password: "" });
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/userauth/loginuser`,
          {
            email: formData.email,
            password: formData.password,
          }
        );
        console.log("Login Successful:", response.data);
        localStorage.setItem("userToken", response.data.authtoken);
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8 pt-16"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 lg:max-w-sm">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-[rgb(239,79,95)]">
          {isSignup ? "Create Account" : "Welcome Back!"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)]"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)]"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-[rgb(239,79,95)] text-white py-2 rounded-lg font-bold hover:bg-[rgb(219,59,75)] transition-colors duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Processing..." : isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={toggleForm}
            className="text-[rgb(239,79,95)] font-semibold ml-1 hover:underline"
          >
            {isSignup ? "Login" : "Signup"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
