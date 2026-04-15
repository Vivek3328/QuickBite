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
    axios
      .post("https://countriesnow.space/api/v0.1/countries/states", {
        country: "India",
      })
      .then((response) => {
        setStates(response.data.data.states);
      })
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  useEffect(() => {
    if (state) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
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
    if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must be 6 digits.";
    }
    if (!state) newErrors.state = "Select a state.";
    if (!city) newErrors.city = "Select a city.";
    if (!paymode) newErrors.paymode = "Choose a payment mode.";

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

  const fieldError = (key) => errors[key];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="surface-card max-h-[90vh] w-full max-w-md overflow-y-auto p-6 shadow-card-hover">
        <h2 className="font-display text-xl font-bold text-ink-900">Delivery details</h2>
        <p className="mt-1 text-sm text-ink-500">We need this to complete your order.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Phone
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="10-digit mobile"
              value={mobile}
              maxLength={10}
              onChange={(e) => setMobile(e.target.value)}
              className={`input-field ${fieldError("mobile") ? "border-red-400 ring-red-200" : ""}`}
            />
            {fieldError("mobile") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("mobile")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`input-field ${fieldError("state") ? "border-red-400" : ""}`}
            >
              <option value="">Select state</option>
              {states.map((s, index) => (
                <option key={index} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            {fieldError("state") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("state")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`input-field ${fieldError("city") ? "border-red-400" : ""}`}
              disabled={!state}
            >
              <option value="">Select city</option>
              {cities.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {fieldError("city") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("city")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Pincode
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit pincode"
              value={pincode}
              maxLength={6}
              onChange={(e) => setPincode(e.target.value)}
              className={`input-field ${fieldError("pincode") ? "border-red-400" : ""}`}
            />
            {fieldError("pincode") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("pincode")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Payment
            </label>
            <select
              value={paymode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className={`input-field ${fieldError("paymode") ? "border-red-400" : ""}`}
            >
              <option value="">Select mode</option>
              <option value="Credit Card">Credit card</option>
              <option value="Debit Card">Debit card</option>
              <option value="Net Banking">Net banking</option>
              <option value="Cash on Delivery">Cash on delivery</option>
            </select>
            {fieldError("paymode") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("paymode")}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button type="button" onClick={handleClose} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="btn-primary w-full sm:w-auto">
            Continue to pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
