import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/home.jpg"; // Example background image for food delivery

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
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
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
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Background image
    >
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md mx-4 md:mx-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-[rgb(239,79,95)]">
          {isSignup ? "Create Account" : "Welcome Back!"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)]"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)]"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-[rgb(239,79,95)] text-white py-3 px-4 rounded-lg font-bold hover:bg-[rgb(219,59,75)] transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={toggleForm}
            className="text-[rgb(239,79,95)] font-semibold ml-2"
          >
            {isSignup ? "Login" : "Signup"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
