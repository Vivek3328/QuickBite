import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiLoader,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMapPin,
  FiPhone,
  FiGrid,
  FiImage,
} from "react-icons/fi";
import { loginOwner, registerOwner } from "@/api/ownerAuth";
import { uploadImage } from "@/api/cloudinary";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";

const inputWrap = "relative";
const inputIcon =
  "pointer-events-none absolute left-3.5 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-ink-400";
const inputClass =
  "w-full rounded-2xl border border-ink-200/90 bg-ink-50/50 py-3 pl-11 pr-4 text-[15px] text-ink-900 shadow-sm transition placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15";
const inputClassNoIcon =
  "w-full rounded-2xl border border-ink-200/90 bg-ink-50/50 px-4 py-3 text-[15px] text-ink-900 shadow-sm transition placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15";

const sectionTitle = "text-xs font-bold uppercase tracking-wider text-ink-400";

export default function AddRestaurantPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
  const location = useLocation();
  const { loginOwner: persistOwnerSession } = useAuth();
  const partnerRedirectTo = location.state?.from || ROUTES.restaurantMenu;

  const switchMode = (login) => {
    setIsLogin(login);
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
    setShowPassword(false);
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
        navigate(partnerRedirectTo, { replace: true });
      } else {
        await registerOwner({ ...formData });
        toast.success("Registration sent — sign in with your email and password.");
        switchMode(true);
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

      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:max-h-[100dvh] lg:min-h-screen lg:overflow-y-auto lg:px-10 lg:py-12 xl:px-14">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Partner portal
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              {isLogin
                ? "Sign in to manage your menu and live orders."
                : "Create your partner account and list your restaurant on QuickBite."}
            </p>
          </div>

          <div className="rounded-3xl border border-ink-100/90 bg-white p-6 shadow-[0_4px_6px_-1px_rgb(15_23_42_/_0.06),0_20px_50px_-12px_rgb(15_23_42_/_0.12)] sm:p-8">
            <div
              className="mb-8 flex rounded-2xl bg-ink-100/80 p-1"
              role="tablist"
              aria-label="Partner mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={isLogin}
                onClick={() => switchMode(true)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                  isLogin
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-700"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isLogin}
                onClick={() => switchMode(false)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                  !isLogin
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-700"
                }`}
              >
                Register
              </button>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-8">
              {isLogin ? (
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="partner-email"
                      className="mb-1.5 block text-sm font-semibold text-ink-700"
                    >
                      Work email
                    </label>
                    <div className={inputWrap}>
                      <FiMail className={inputIcon} aria-hidden />
                      <input
                        id="partner-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="you@restaurant.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="partner-password"
                      className="mb-1.5 block text-sm font-semibold text-ink-700"
                    >
                      Password
                    </label>
                    <div className={inputWrap}>
                      <FiLock className={inputIcon} aria-hidden />
                      <input
                        id="partner-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${inputClass} pr-12`}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/35 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="h-5 w-5 animate-spin" aria-hidden />
                        Signing in…
                      </>
                    ) : (
                      "Sign in to dashboard"
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <p className={sectionTitle}>Restaurant</p>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Restaurant name
                        </label>
                        <div className={inputWrap}>
                          <FiUser className={inputIcon} aria-hidden />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="The Spice House"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Street address
                        </label>
                        <div className={inputWrap}>
                          <FiMapPin className={`${inputIcon} top-6`} aria-hidden />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Area, landmark, city"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          inputMode="numeric"
                          value={formData.pincode}
                          onChange={handleChange}
                          className={inputClassNoIcon}
                          placeholder="560001"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Phone
                        </label>
                        <div className={inputWrap}>
                          <FiPhone className={inputIcon} aria-hidden />
                          <input
                            type="tel"
                            name="mobile"
                            inputMode="tel"
                            value={formData.mobile}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="10-digit mobile"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Cuisines
                        </label>
                        <div className={inputWrap}>
                          <FiGrid className={inputIcon} aria-hidden />
                          <input
                            type="text"
                            name="foodtype"
                            value={formData.foodtype}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="North Indian, Chinese…"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Kitchen type
                        </label>
                        <select
                          name="restaurantType"
                          value={formData.restaurantType}
                          onChange={handleChange}
                          className={inputClassNoIcon}
                          required
                        >
                          <option value="">Select type</option>
                          <option value="veg">Vegetarian</option>
                          <option value="non-veg">Non-vegetarian</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Cover image
                        </label>
                        <div className={inputWrap}>
                          <FiImage className={`${inputIcon} top-6`} aria-hidden />
                          <input
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={handleFileChange}
                            className={`${inputClass} py-2.5 file:mr-3 file:rounded-xl file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-800`}
                            required
                          />
                        </div>
                        {formData.image ? (
                          <p className="mt-2 text-xs font-medium text-emerald-700">
                            Image uploaded — ready to submit.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className={sectionTitle}>Account</p>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Login email
                        </label>
                        <div className={inputWrap}>
                          <FiMail className={inputIcon} aria-hidden />
                          <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Used to sign in later"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                          Password
                        </label>
                        <div className={inputWrap}>
                          <FiLock className={inputIcon} aria-hidden />
                          <input
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/35 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="h-5 w-5 animate-spin" aria-hidden />
                        Submitting…
                      </>
                    ) : (
                      "Submit registration"
                    )}
                  </button>
                </div>
              )}
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
              Ordering food?{" "}
              <Link
                to={ROUTES.login}
                className="font-semibold text-brand-700 underline-offset-2 hover:underline"
              >
                Customer sign in
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-ink-400">
            By registering you confirm that restaurant details are accurate and you can accept
            orders placed through QuickBite.
          </p>
        </div>
      </div>
    </div>
  );
}
