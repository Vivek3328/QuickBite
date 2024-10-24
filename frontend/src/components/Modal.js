import React, { useState } from "react";

const Modal = ({ showModal, onClose, onSubmit }) => {
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [paymode, setPaymentMode] = useState("");

  const [errors, setErrors] = useState({});

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

    // Validation
    const newErrors = {};
    if (!mobile) newErrors.mobile = "Phone number is required.";
    if (!pincode) newErrors.pincode = "Pincode is required.";
    if (!state) newErrors.state = "State is required.";
    if (!city) newErrors.city = "City is required.";
    if (!paymode) newErrors.paymode = "Payment mode is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(addressDetails);
      resetForm(); // Reset the form on successful submission
      onClose();
    }
  };

  const handleClose = () => {
    resetForm(); // Reset the form when closing the modal
    onClose();
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Enter Your Address
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={`border rounded w-full p-2 focus:outline-none focus:ring-2 ${
              errors.mobile ? "border-red-500" : "focus:ring-red-500"
            }`}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className={`border rounded w-full p-2 focus:outline-none focus:ring-2 ${
              errors.pincode ? "border-red-500" : "focus:ring-red-500"
            }`}
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm">{errors.pincode}</p>
          )}

          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`border rounded w-full p-2 focus:outline-none focus:ring-2 ${
              errors.state ? "border-red-500" : "focus:ring-red-500"
            }`}
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state}</p>
          )}

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`border rounded w-full p-2 focus:outline-none focus:ring-2 ${
              errors.city ? "border-red-500" : "focus:ring-red-500"
            }`}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

          <select
            value={paymode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className={`border rounded w-full p-2 focus:outline-none focus:ring-2 ${
              errors.paymode ? "border-red-500" : "focus:ring-red-500"
            }`}
          >
            <option value="">Select Payment Mode</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
          {errors.paymode && (
            <p className="text-red-500 text-sm">{errors.paymode}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
          >
            Proceed
          </button>
          <button
            onClick={handleClose}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
