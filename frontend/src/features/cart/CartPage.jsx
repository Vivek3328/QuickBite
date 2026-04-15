import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setTotalItems } from "@/store/cartSlice";
import { useAuth } from "@/context/AuthContext";
import { checkoutOrder, getRazorpayKey } from "@/api/orders";
import { validateCouponApi } from "@/api/coupons";
import { CheckoutAddressModal } from "@/components/ui/CheckoutAddressModal";
import { ROUTES } from "@/constants/routes";
import { STORAGE_KEYS } from "@/constants/storage";
import { computeGrandTotal } from "@/utils/pricing";

export default function CartPage() {
  const { userToken } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const pricing = useMemo(
    () => computeGrandTotal(totalPrice, discount),
    [totalPrice, discount]
  );

  const handleSubmit = async (shippingDetails) => {
    const items = cartItems.map((item) => ({
      menuitem: item._id,
      quantity: quantities[item._id],
    }));

    try {
      const { key } = await getRazorpayKey(userToken);

      const response = await checkoutOrder(userToken, {
        item: items,
        owner: cartItems[0].owner,
        shipping: shippingDetails,
        couponCode: appliedCoupon?.code || undefined,
      });

      if (!response.success || !response.razorpayOrder) {
        toast.error("Failed to place order.");
        return;
      }

      const options = {
        key,
        amount: response.razorpayOrder.amount,
        currency: "INR",
        name: "QuickBite",
        description: "Order payment",
        image: "https://example.com/your_logo",
        order_id: response.razorpayOrder.id,
        callback_url: `${import.meta.env.VITE_API_BASE_URL}/orders/verify-payment`,
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

      const rzp = new window.Razorpay(options);
      rzp.open();
      setShowModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred during checkout.");
    }
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.cartItems)) || [];
    setCartItems(items);

    const initialQuantities = {};
    items.forEach((item) => {
      initialQuantities[item._id] = item.quantity ?? 1;
    });
    setQuantities(initialQuantities);
    dispatch(setTotalItems(items.length));
    calculateTotalPrice(items, initialQuantities);
  }, [dispatch]);

  const calculateTotalPrice = (items, qtys) => {
    const total = items.reduce((acc, item) => acc + item.price * qtys[item._id], 0);
    setTotalPrice(total);
  };

  const changeQuantity = (itemId, change) => {
    setDiscount(0);
    setAppliedCoupon(null);
    const newQuantities = { ...quantities };
    newQuantities[itemId] = Math.max(newQuantities[itemId] + change, 0);

    if (newQuantities[itemId] === 0) {
      const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
      const { [itemId]: _removed, ...restQty } = newQuantities;
      setCartItems(updatedCartItems);
      setQuantities(restQty);
      localStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(updatedCartItems));
      dispatch(setTotalItems(updatedCartItems.length));
      calculateTotalPrice(updatedCartItems, restQty);
      return;
    }

    setQuantities(newQuantities);
    calculateTotalPrice(cartItems, newQuantities);
  };

  const applyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      toast.info("Enter a coupon code");
      return;
    }
    try {
      const res = await validateCouponApi({ code, subtotal: totalPrice });
      if (res.success && res.discount != null) {
        const d = Math.min(Number(res.discount), totalPrice);
        setDiscount(d);
        setAppliedCoupon({ code: res.code || code });
        setCouponCode("");
        toast.success("Coupon applied");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || "Invalid coupon";
      toast.error(msg);
    }
  };

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
              to={ROUTES.home}
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              ← Back to restaurants
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {cartItems.length === 0 ? (
              <div className="surface-card p-12 text-center">
                <p className="text-ink-600">Your cart is empty.</p>
                <Link to={ROUTES.home} className="btn-primary mt-6 inline-flex">
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
                    ₹{pricing.subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">GST (18%)</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">₹{pricing.gst}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Restaurant</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">
                    ₹{pricing.restaurantCharges}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Delivery</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">
                    ₹{pricing.deliveryFee}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Platform</dt>
                  <dd className="font-semibold tabular-nums text-ink-900">
                    ₹{pricing.platformFee}
                  </dd>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between gap-4 text-emerald-700">
                    <dt>Discount ({appliedCoupon.code})</dt>
                    <dd className="font-semibold tabular-nums">
                      −₹{pricing.discountAmount.toFixed(2)}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 text-base font-bold text-ink-900">
                <span>Grand total</span>
                <span className="text-brand-700 tabular-nums">
                  ₹{pricing.grandTotal.toFixed(2)}
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
      <CheckoutAddressModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
