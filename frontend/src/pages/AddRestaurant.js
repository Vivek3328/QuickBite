import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      } else {
        console.log("before register");
        console.log(formData);

        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/ownerauth/registerowner`,
          { ...formData }
        );
        console.log(formData);
        setIsLogin(true);
        console.log("Registration Successful:", res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-extrabold text-center mb-4 text-[rgb(239,79,95)]">
          {isLogin ? "Restaurant Owner Login" : "Register Your Restaurant"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`grid gap-4 ${isLogin ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
            }`}
        >
          {isLogin ? (
            <>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
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
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Registration fields */}
              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  placeholder="Enter your restaurant name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  placeholder="Enter your pincode"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  name="foodtype"
                  value={formData.foodtype}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  placeholder="Italian, Spanish, etc."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Type of Restaurant
                </label>
                <select
                  name="restaurantType"
                  value={formData.restaurantType}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Restaurant Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(239,79,95)] transition duration-300 ease-in-out"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-[rgb(239,79,95)] text-white font-semibold py-1 rounded-lg transition duration-300 ease-in-out hover:bg-[rgb(239,79,95,0.8)]"
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-[rgb(239,79,95)] font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;
