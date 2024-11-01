import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ showModal, onClose, onSubmit }) => {
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [paymode, setPaymentMode] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.post("https://countriesnow.space/api/v0.1/countries/states", {
      country: "India",
    })
      .then((response) => {
        setStates(response.data.data.states);
      })
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  useEffect(() => {
    if (state) {
      axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: "India",
        state: state,
      })
        .then((response) => {
          setCities(response.data.data);
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [state]);

  const resetForm = () => {
    setMobile("");
    setPincode("");
    setState("");
    setCity("");
    setPaymentMode("");
    setErrors({});
  };

  const handleSubmit = () => {
    const addressDetails = { mobile, pincode, state, city, paymode };

    const newErrors = {};
    if (!mobile) newErrors.mobile = "Phone number is required.";
    if (!pincode) newErrors.pincode = "Pincode is required.";
    if (!state) newErrors.state = "State is required.";
    if (!city) newErrors.city = "City is required.";
    if (!paymode) newErrors.paymode = "Payment mode is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(addressDetails);
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Your Address</h2>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Phone Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={`border rounded text-sm w-full p-2 focus:outline-none focus:ring-2 ${errors.mobile ? "border-red-500" : "focus:ring-red-500"}`}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`border rounded w-full p-1 text-sm focus:outline-none focus:ring-2 ${errors.state ? "border-red-500" : "focus:ring-red-500"}`}
          >
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state.name}>{state.name}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`border rounded w-full p-1 focus:outline-none focus:ring-2 ${errors.city ? "border-red-500" : "focus:ring-red-500"}`}
            disabled={!state}
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className={`border rounded text-sm w-full p-1 focus:outline-none focus:ring-2 ${errors.pincode ? "border-red-500" : "focus:ring-red-500"}`}
          />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}

          <select
            value={paymode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className={`border rounded w-full p-1 text-sm focus:outline-none focus:ring-2 ${errors.paymode ? "border-red-500" : "focus:ring-red-500"}`}
          >
            <option value="">Select Payment Mode</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
          {errors.paymode && <p className="text-red-500 text-sm">{errors.paymode}</p>}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white text-sm px-4 py-1 rounded hover:bg-green-700 transition duration-200"
          >
            Proceed
          </button>
          <button
            onClick={handleClose}
            className="ml-4 bg-red-500 text-white text-sm px-4 py-1 rounded hover:bg-red-700 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
