// Cart.js
import React, { useEffect, useState } from "react";
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
          owner: cartItems[0].owner, // Assuming all items have the same owner
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

      // console.log(response.data.order.razorpayOrderId);

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
          color: "#3399cc",
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
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout.");
    }
  };

  const coupons = {
    "50OFF": { type: "percentage", value: 50, minAmount: 1000 }, // 50% off on minimum cart value of 1000
    "10OFF": { type: "percentage", value: 10 }, // 10% off for any amount
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);

    const initialQuantities = {};
    items.forEach((item) => {
      initialQuantities[item._id] = 1; // Set default quantity to 1
    });
    setQuantities(initialQuantities);
    dispatch(setTotalItems(items.length));
    calculateTotalPrice(items, initialQuantities);
  }, [dispatch]);

  const calculateTotalPrice = (items, quantities) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * quantities[item._id],
      0
    );
    setTotalPrice(total);
  };

  const changeQuantity = (itemId, change) => {
    const newQuantities = { ...quantities };
    newQuantities[itemId] = Math.max(newQuantities[itemId] + change, 0); // Allow zero quantity

    if (newQuantities[itemId] === 0) {
      const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      dispatch(setTotalItems(updatedCartItems.length));
    }

    setQuantities(newQuantities);

    console.log(quantities[itemId._id]);
    calculateTotalPrice(cartItems, newQuantities);
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode];
    if (coupon) {
      if (coupon.minAmount && totalPrice < coupon.minAmount) {
        alert(`Coupon requires a minimum cart value of $${coupon.minAmount}.`);
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
    <div className="container mx-auto py-8 flex flex-wrap pt-20">
      <div className="flex-1 lg:ml-10 lg:mr-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="space-y-2">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg transition-transform transform "
              >
                <img
                  src={item.image}
                  alt={item.itemname}
                  className="w-16 h-16 object-cover mr-4 rounded-md"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.itemname}</h2>
                  <p className="text-gray-600">Price: ${item.price}</p>
                </div>
                <div className="flex items-center">
                  <button
                    className="bg-[rgb(239,79,95)] text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                    onClick={() => changeQuantity(item._id, -1)}
                  >
                    <span className="text-2xl font-bold mb-2">-</span>
                  </button>
                  <span className="text-lg mx-4">{quantities[item._id]}</span>
                  <button
                    className="bg-[rgb(239,79,95)] text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                    onClick={() => changeQuantity(item._id, 1)}
                  >
                    <span className="text-xl font-bold mb-1">+</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="w-full h-3/4 md:w-1/3 bg-white shadow-lg rounded-lg p-6 ml-4 mt-8 md:mt-0 border border-gray-200 mr-8">
          <h2 className="text-xl font-bold mb-4 text-[rgb(239,79,95)] ">
            Cart Summary
          </h2>
          <div className="flex justify-between mb-2 border-b pb-2">
            <span className="text-gray-700">Item Total:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 border-b pb-2">
            <span className="text-gray-700">GST (18%):</span>
            <span className="font-semibold">${gst}</span>
          </div>
          <div className="flex justify-between mb-2 border-b pb-2">
            <span className="text-gray-700">Restaurant Charges:</span>
            <span className="font-semibold">${restaurantCharges}</span>
          </div>
          <div className="flex justify-between mb-2 border-b pb-2">
            <span className="text-gray-700">Delivery Fee:</span>
            <span className="font-semibold">${deliveryFee}</span>
          </div>
          <div className="flex justify-between mb-2 border-b pb-2">
            <span className="text-gray-700">Platform Fee:</span>
            <span className="font-semibold">${platformFee}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between mb-2 border-b pb-2">
              <span className="text-gray-700">
                Discount ({appliedCoupon.code}):
              </span>
              <span className="font-semibold text-red-500">
                -${discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mb-4 pt-2 border-t">
            <span>Grand Total:</span>
            <span className="text-green-500">${grandTotal.toFixed(2)}</span>
          </div>

          <div className="mb-4 flex">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border text-sm rounded w-3/5 p-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={applyCoupon}
              className="ml-4 w-2/5 bg-blue-500 text-white text-base py-1 rounded hover:bg-blue-700 transition"
            >
              Apply Coupon
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-[rgb(239,79,95)]  text-white text-base py-1 rounded hover:bg-red-700 transition"
          >
            Checkout
          </button>
        </div>
      )}
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
      <ToastContainer hideProgressBar={true} position="top-center" />
    </div>
  );
};

export default Cart;
