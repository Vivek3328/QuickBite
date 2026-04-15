// Cart.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTotalItems } from "../redux/cartSlice";
import Modal from "../components/Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (shippingDetails) => {
    setShowModal(true);
    const items = cartItems.map((item) => ({
      menuitem: item._id,
      quantity: quantities[item._id],
    }));

    const { key } = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getkey`
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orders/checkout`,
        {
          item: items,
          owner: cartItems[0].owner,
          shipping: shippingDetails,
          totalprice: grandTotal,
          status: "Pending",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("userToken"),
          },
        }
      );

      var options = {
        key: key,
        amount: grandTotal,
        currency: "INR",
        name: "QuickBite",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: response.data.order.razorpayOrderId,
        callback_url: `${process.env.REACT_APP_API_BASE_URL}/orders/verify-payment`,
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#ea580c",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();

      if (response.data.success) {
        toast.success("Order placed successfully");
        setShowModal(false);

        setCartItems([]);
        localStorage.removeItem("cartItems");
        dispatch(setTotalItems(0));
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      alert("An error occurred during checkout.");
    }
  };

  const coupons = {
    "50OFF": { type: "percentage", value: 50, minAmount: 1000 },
    "10OFF": { type: "percentage", value: 10 },
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);

    const initialQuantities = {};
    items.forEach((item) => {
      initialQuantities[item._id] = 1;
    });
    setQuantities(initialQuantities);
    dispatch(setTotalItems(items.length));
    calculateTotalPrice(items, initialQuantities);
  }, [dispatch]);

  const calculateTotalPrice = (items, qtys) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * qtys[item._id],
      0
    );
    setTotalPrice(total);
  };

  const changeQuantity = (itemId, change) => {
    const newQuantities = { ...quantities };
    newQuantities[itemId] = Math.max(newQuantities[itemId] + change, 0);

    if (newQuantities[itemId] === 0) {
      const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      dispatch(setTotalItems(updatedCartItems.length));
    }

    setQuantities(newQuantities);

    calculateTotalPrice(cartItems, newQuantities);
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode];
    if (coupon) {
      if (coupon.minAmount && totalPrice < coupon.minAmount) {
        alert(`Coupon requires a minimum cart value of ₹${coupon.minAmount}.`);
      } else {
        const discountValue =
          coupon.type === "percentage"
            ? (totalPrice * coupon.value) / 100
            : coupon.value;
        setDiscount(discountValue);
        setAppliedCoupon({ code: couponCode, value: coupon.value });
        setCouponCode("");
      }
    } else {
      alert("Invalid coupon code.");
    }
  };

  const subtotal = totalPrice;
  const gst = (subtotal * 0.18).toFixed(2);
  const restaurantCharges = 5;
  const deliveryFee = 3;
  const platformFee = 2;
  const totalAfterDiscount = subtotal - discount;
  const grandTotal =
    parseFloat(totalAfterDiscount) +
    parseFloat(gst) +
    restaurantCharges +
    deliveryFee +
    platformFee;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink-900">Your cart</h1>
              <p className="mt-1 text-sm text-ink-500">
                Review items before checkout. Quantities update instantly.
              </p>
            </div>
            <Link
              to="/"
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              ← Back to restaurants
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {cartItems.length === 0 ? (
              <div className="surface-card p-12 text-center">
                <p className="text-ink-600">Your cart is empty.</p>
                <Link to="/" className="btn-primary mt-6 inline-flex">
                  Browse restaurants
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="surface-card flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:p-5"
                >
                  <img
                    src={item.image}
                    alt={item.itemname}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-ink-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-ink-900">{item.itemname}</h2>
                    <p className="mt-1 text-sm text-ink-500">₹{item.price} each</p>
                  </div>
                  <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
                    <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-2 py-1">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg font-bold text-ink-800 shadow-sm transition hover:bg-brand-50"
                        onClick={() => changeQuantity(item._id, -1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center font-semibold tabular-nums">
                        {quantities[item._id]}
                      </span>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg font-bold text-ink-800 shadow-sm transition hover:bg-brand-50"
                        onClick={() => changeQuantity(item._id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-bold text-ink-900">
                      ₹{(item.price * quantities[item._id]).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {cartItems.length > 0 && (
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-96">
            <div className="surface-card p-6">
              <h2 className="font-display text-lg font-bold text-ink-900">Summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Item total</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">
                    ₹{subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">GST (18%)</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">₹{gst}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Restaurant</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">
                    ₹{restaurantCharges}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Delivery</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">
                    ₹{deliveryFee}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Platform</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">
                    ₹{platformFee}
                  </dd>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between gap-4 text-emerald-700">
                    <dt>Discount ({appliedCoupon.code})</dt>
                    <dd className="font-semibold tabular-nums">
                      −₹{discount.toFixed(2)}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 text-base font-bold text-ink-900">
                <span>Grand total</span>
                <span className="text-brand-700 tabular-nums">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="input-field flex-1 text-sm"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="btn-secondary shrink-0 !px-4 !text-sm"
                >
                  Apply
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn-primary mt-6 w-full !py-3"
              >
                Checkout
              </button>
            </div>
          </aside>
        )}
      </div>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
      <ToastContainer hideProgressBar={true} position="top-center" theme="light" />
    </div>
  );
};

export default Cart;
