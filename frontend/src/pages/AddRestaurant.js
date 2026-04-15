import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pincode: "",
    mobile: "",
    restaurantType: "",
    foodtype: "",
    image: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setFormData({
      name: "",
      address: "",
      pincode: "",
      mobile: "",
      restaurantType: "",
      foodtype: "",
      image: "",
      email: "",
      password: "",
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("upload_preset", "quickbite");
      formDataToSend.append("cloud_name", "drdcsopo2");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/drdcsopo2/image/upload",
          formDataToSend
        );
        setFormData((prev) => ({ ...prev, image: response.data.url }));
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/ownerauth/loginowner`,
          {
            email: formData.email,
            password: formData.password,
          }
        );
        console.log("Login Successful:", response.data);
        localStorage.setItem("ownerToken", response.data.authtoken);
        localStorage.setItem("role", "owner");
        navigate("/restaurant-menu");
        window.location.reload();
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/ownerauth/registerowner`,
          { ...formData }
        );
        setIsLogin(true);
        console.log("Registration Successful:", res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-card overflow-hidden p-6 sm:p-10">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            {isLogin ? "Restaurant sign in" : "Register your restaurant"}
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            Manage your menu and incoming orders from one place.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`mt-8 grid gap-5 ${isLogin ? "mx-auto max-w-md" : "sm:grid-cols-2 lg:grid-cols-3"}`}
        >
          {isLogin ? (
            <>
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
                  placeholder="owner@restaurant.com"
                  required
                />
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
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Restaurant name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="The Spice House"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Street, area"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="560001"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Phone
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10-digit number"
                  required
                />
              </div>

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
                  required
                />
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
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Cuisine
                </label>
                <input
                  type="text"
                  name="foodtype"
                  value={formData.foodtype}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="North Indian, Italian…"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Type
                </label>
                <select
                  name="restaurantType"
                  value={formData.restaurantType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-vegetarian</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Cover image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleFileChange}
                  className="input-field py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-800"
                  required
                />
              </div>
            </>
          )}

          <div className={isLogin ? "" : "sm:col-span-2 lg:col-span-3"}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 disabled:opacity-50"
            >
              {loading ? "Please wait…" : isLogin ? "Sign in" : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-ink-600">
          {isLogin ? "New partner? " : "Already registered? "}
          <button
            type="button"
            onClick={toggleForm}
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-ink-400">
          Ordering food?{" "}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Customer sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AddRestaurant;
