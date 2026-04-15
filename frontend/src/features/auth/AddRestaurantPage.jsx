import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { loginOwner, registerOwner } from "@/api/ownerAuth";
import { uploadImage } from "@/api/cloudinary";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";

const fieldClass =
  "w-full rounded-2xl border border-ink-200/90 bg-ink-50/50 px-4 py-3 text-[15px] text-ink-900 shadow-sm transition placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15";

export default function AddRestaurantPage() {
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
  const { loginOwner: persistOwnerSession } = useAuth();

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
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await loginOwner({
          email: formData.email,
          password: formData.password,
        });
        persistOwnerSession(data.authtoken);
        navigate(ROUTES.restaurantMenu);
      } else {
        await registerOwner({ ...formData });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-ink-50 lg:grid lg:min-h-[100dvh] lg:min-h-screen lg:grid-cols-[1fr_minmax(0,560px)] lg:items-stretch xl:grid-cols-[1.1fr_minmax(0,520px)]">
      <AuthHeroPanel variant="partner" />

      <div className="flex flex-col px-4 py-10 sm:px-8 lg:max-h-[100dvh] lg:min-h-screen lg:overflow-y-auto lg:px-10 lg:py-12 xl:px-14">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {isLogin ? "Restaurant sign in" : "Register your restaurant"}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              Manage your menu, incoming orders, and customer reach from one place.
            </p>
          </div>

          <div className="rounded-3xl border border-ink-100/90 bg-white p-6 shadow-[0_4px_6px_-1px_rgb(15_23_42_/_0.06),0_20px_50px_-12px_rgb(15_23_42_/_0.12)] sm:p-8">
            {error && (
              <div
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-left text-sm text-red-800"
                role="alert"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                  !
                </span>
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`grid gap-5 ${isLogin ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}
            >
              {isLogin ? (
                <>
                  <div>
                    <label
                      htmlFor="partner-email"
                      className="mb-1.5 block text-sm font-semibold text-ink-700"
                    >
                      Email
                    </label>
                    <input
                      id="partner-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="owner@restaurant.com"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="partner-password"
                      className="mb-1.5 block text-sm font-semibold text-ink-700"
                    >
                      Password
                    </label>
                    <input
                      id="partner-password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Restaurant name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="The Spice House"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="Street, area"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="560001"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="10-digit number"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={fieldClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={fieldClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Cuisine
                    </label>
                    <input
                      type="text"
                      name="foodtype"
                      value={formData.foodtype}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="North Indian, Italian…"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Type
                    </label>
                    <select
                      name="restaurantType"
                      value={formData.restaurantType}
                      onChange={handleChange}
                      className={fieldClass}
                      required
                    >
                      <option value="">Select</option>
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-vegetarian</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                      Cover image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={handleFileChange}
                      className={`${fieldClass} py-2.5 file:mr-3 file:rounded-xl file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-800`}
                      required
                    />
                  </div>
                </>
              )}

              <div className={isLogin ? "" : "sm:col-span-2 lg:col-span-3"}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/35 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <FiLoader className="h-5 w-5 animate-spin" aria-hidden />
                      Please wait…
                    </>
                  ) : isLogin ? (
                    "Sign in to dashboard"
                  ) : (
                    "Submit registration"
                  )}
                </button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-ink-100" />
              </div>
              <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-ink-400">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            <p className="text-center text-[15px] text-ink-600">
              {isLogin ? "New partner? " : "Already registered? "}
              <button
                type="button"
                onClick={toggleForm}
                className="font-semibold text-brand-700 underline-offset-2 hover:underline"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
            </p>

            <p className="mt-8 border-t border-ink-100 pt-6 text-center text-sm text-ink-500">
              Ordering food?{" "}
              <Link
                to={ROUTES.login}
                className="font-semibold text-brand-700 underline-offset-2 hover:underline"
              >
                Customer sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
