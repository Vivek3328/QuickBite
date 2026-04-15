import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/home.jpg";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignup((prevState) => !prevState);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (isSignup && formData.name.length < 5) {
      newErrors.name = "Name must be at least 5 characters long.";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
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
      setErrors({
        general: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-[calc(100vh-4.25rem)] items-center justify-center px-4 py-12 sm:px-6"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900/80 via-ink-900/65 to-brand-900/50" />

      <div className="relative z-10 w-full max-w-md">
        <div className="surface-card border border-white/20 bg-white/95 p-8 shadow-card-hover backdrop-blur-sm sm:p-10">
          <h2 className="font-display text-center text-2xl font-bold text-ink-900">
            {isSignup ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-center text-sm text-ink-500">
            {isSignup
              ? "Join QuickBite to order from local favourites."
              : "Sign in to continue ordering."}
          </p>

          {errors.general && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignup && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your name"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@email.com"
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-600">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="mt-6 text-center text-xs text-ink-400">
            Running a kitchen?{" "}
            <Link to="/add-restaurant" className="font-medium text-brand-700 hover:underline">
              Restaurant portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
